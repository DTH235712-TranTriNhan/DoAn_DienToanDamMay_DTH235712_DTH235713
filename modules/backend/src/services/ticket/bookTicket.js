import redisClient from "../../libs/redis.js";
import Event from "../../models/EventModel.js";
import Ticket from "../../models/TicketModel.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";
import { TICKET_STATUS } from "../../types/constants/statuses.js";
import { OutOfTicketsError } from "../../types/errors/AppError.js";

/**
 * Logic đặt vé — được gọi bởi worker để đảm bảo tính ổn định.
 * Sử dụng chiến thuật "Redis First, DB Second".
 */
export const bookTicket = async (userId, eventId) => {
  const key = REDIS_KEYS.EVENT_TICKETS(eventId);

  // 🚀 Bước 1: DECR atomic trên Redis (Chiến thuật Gatekeeper)
  // Redis xử lý cực nhanh trong RAM, giúp chặn đứng 1000 người khi chỉ còn 1 vé.
  const remaining = await redisClient.decr(key);

  if (remaining < 0) {
    // Hoàn lại slot nếu lỡ trừ quá (Concurrency safety)
    await redisClient.incr(key);
    throw new OutOfTicketsError("Hết vé rồi bạn ơi, vui lòng đợi đợt sau!");
  }

  // 📝 Bước 2: Ghi ticket vào MongoDB Atlas (Persistent Storage)
  const ticket = await Ticket.create({
    event: eventId,
    user: userId,
    status: TICKET_STATUS.CONFIRMED
  });

  // 🔄 Bước 3: Đồng bộ ngược lại MongoDB (Eventual Consistency)
  // Cập nhật số lượng vé thực tế trong DB để hiển thị trên giao diện quản lý.
  await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -1 } });

  return ticket;
};
