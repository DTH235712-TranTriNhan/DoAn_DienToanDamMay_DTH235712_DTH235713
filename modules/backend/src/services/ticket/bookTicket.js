import redisClient from "../../libs/redis.js";
import Event from "../../models/EventModel.js";
import Ticket from "../../models/TicketModel.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";
import { TICKET_STATUS } from "../../types/constants/statuses.js";
import { OutOfTicketsError } from "../../types/errors/AppError.js";

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

  // 🚀 Bước 1: Thử DECR bằng Lua Script (Gatekeeper)
  let remaining = await redisClient.eval(LUA_ATOMIC_DECR, 1, key);

  // 🛡️ Bước 2: Xử lý Fallback nếu Key biến mất hoặc Hết vé
  if (remaining === -999 || remaining < 0) {
    if (remaining === -999) {
      console.warn(`[Redis] Key ${key} is missing. Fetching from DB...`);
    }

    // Luôn query DB để lấy con số chính xác nhất (Single Source of Truth)
    const event = await Event.findById(eventId).select("availableTickets title");
    if (!event) throw new OutOfTicketsError("Sự kiện không tồn tại");

    if (event.availableTickets > 0) {
      if (remaining === -999) {
        console.log(`[Fallback] Re-syncing Redis for "${event.title}" with ${event.availableTickets} tickets`);
        // Đồng bộ ATOMIC: SETNX + DECR trong cùng 1 request Lua
        remaining = await redisClient.eval(LUA_SYNC_AND_DECR, 1, key, event.availableTickets);
      }
    }

    // Nếu sau tất cả vẫn < 0, chắc chắn là hết vé
    if (remaining < 0) {
      throw new OutOfTicketsError("Hết vé rồi bạn ơi, vui lòng đợi đợt sau!");
    }
  }

  // 📝 Bước 3: Ghi ticket vào MongoDB (Persistent Storage)
  const ticket = await Ticket.create({
    event: eventId,
    user: userId,
    status: TICKET_STATUS.CONFIRMED
  });

  // 🔄 Bước 4: Đồng bộ ngược lại MongoDB (Eventual Consistency) với Retry
  await withRetry(async () => {
    await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -1 } });
  }).catch(err => {
    console.error(`[CRITICAL] Sync DB failed for Event ${eventId} after 3 retries:`, err.message);
    // Lưu ý: Không ném lỗi ở đây để không làm fail job đã tạo ticket thành công
  });

  return ticket;
};
