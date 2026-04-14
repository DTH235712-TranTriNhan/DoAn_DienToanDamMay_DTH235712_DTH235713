import mongoose from "mongoose";
import redisClient from "../../libs/redis.js";
import Event from "../../models/EventModel.js";
import Ticket from "../../models/TicketModel.js";
import User from "../../models/UserModel.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";
import { TICKET_STATUS } from "../../types/constants/statuses.js";
import { OutOfTicketsError, InsufficientBalanceError } from "../../types/errors/AppError.js";
import { deductBalance } from "../payment/paymentService.js";

/**
 * Script Lua 1: Kiểm tra tồn tại và Decrement. Trả về -999 nếu key không tồn tại.
 * Điều này giúp phát hiện trường hợp Redis bị mất dữ liệu/flush.
 */
const LUA_ATOMIC_DECR = `
  if redis.call("EXISTS", KEYS[1]) == 1 then
    return redis.call("DECR", KEYS[1])
  else
    return -999
  end
`;

/**
 * Script Lua 2: Đồng bộ từ DB lên Redis và Decrement.
 * Sử dụng SETNX để đảm bảo chỉ có 1 Worker ghi giá trị từ DB lên,
 * các Worker khác sẽ chỉ thực hiện DECR trên giá trị đã được set đó.
 */
const LUA_SYNC_AND_DECR = `
  redis.call("SETNX", KEYS[1], ARGV[1])
  return redis.call("DECR", KEYS[1])
`;

/**
 * Hàm hỗ trợ Retry với Exponential Backoff cho các tác vụ quan trọng trên Cloud
 */
const withRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      const delay = Math.pow(2, i) * 1000;
      console.warn(`[Retry] Thử lại sau ${delay}ms... (Lần ${i + 1}/${maxRetries})`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

/**
 * Logic đặt vé — được gọi bởi worker để đảm bảo tính ổn định.
 * Đã được nâng cấp lên ATOMIC LUA để chống Overselling tuyệt đối.
 */
export const bookTicket = async (userId, eventId) => {
  const key = REDIS_KEYS.EVENT_TICKETS(eventId);

  // 🚀 Bước 1: Thử DECR bằng Lua Script (Gatekeeper - Chống Overselling)
  let remaining = await redisClient.eval(LUA_ATOMIC_DECR, 1, key);

  if (remaining === -999 || remaining < 0) {
    if (remaining === -999) {
      console.warn(`[Redis] Key ${key} is missing. Fetching from DB...`);
    }

    const event = await Event.findById(eventId).select("availableTickets title");
    if (!event) throw new OutOfTicketsError("Sự kiện không tồn tại");

    if (event.availableTickets > 0) {
      if (remaining === -999) {
        remaining = await redisClient.eval(LUA_SYNC_AND_DECR, 1, key, event.availableTickets);
      }
    }

    if (remaining < 0) {
      throw new OutOfTicketsError("Hết vé rồi bạn ơi, vui lòng đợi đợt sau!");
    }
  }

  // 🚀 Bước 2: Bắt đầu Transaction MongoDB để đảm bảo Atomic (Trừ tiền + Tạo vé)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Kiểm tra User và Số dư một lần nữa trong Session (Tránh race condition balance)
    const user = await User.findById(userId).session(session);
    const event = await Event.findById(eventId).session(session);

    if (!event) throw new Error("Sự kiện đã bị xóa");
    if (user.balance < event.price) {
      throw new InsufficientBalanceError();
    }

    // 2. Tạo ticket
    const ticket = await Ticket.create(
      [
        {
          event: eventId,
          user: userId,
          status: TICKET_STATUS.CONFIRMED
        }
      ],
      { session }
    );

    const createdTicket = ticket[0];

    // 3. Trừ tiền qua Payment Service
    await deductBalance(userId, event.price, createdTicket._id, session);

    // 4. Đồng bộ giảm số lượng vé trong DB
    await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -1 } }, { session });

    // ✅ Commit Transaction
    await session.commitTransaction();
    console.log(`[Worker] ✅ Đã thanh toán và tạo vé thành công cho User ${userId}`);

    return createdTicket;
  } catch (error) {
    // ❌ Abort Transaction nếu có bất kỳ lỗi nào
    await session.abortTransaction();
    console.error(`[Worker] ❌ Lỗi trong Transaction:`, error.message);
    
    // Nếu lỗi do Redis đã DECR nhưng DB fail, ta cần cộng lại Redis (Eventual Consistency)
    // Tuy nhiên trong Flash Sale, việc cộng lại thường phức tạp, ở đây ta ưu tiên tính đúng đắn của DB.
    await redisClient.incr(key).catch(err => console.error("[Redis] Rollback failed:", err.message));
    
    throw error;
  } finally {
    session.endSession();
  }
};
