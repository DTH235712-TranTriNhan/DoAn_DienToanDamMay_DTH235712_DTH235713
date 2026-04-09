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
  let remaining = await redisClient.decr(key);

  // 🛡️ BỔ SUNG: Cơ chế Fallback nếu Redis mất dữ liệu tạm thời
  if (remaining < 0) {
    console.warn(`[Redis] Key ${key} is negative (${remaining}). Attempting fallback from DB...`);
    
    // Tìm thông tin thực tế từ MongoDB
    const event = await Event.findById(eventId).select("availableTickets title");
    
    if (!event) {
      throw new OutOfTicketsError("Sự kiện không tồn tại hoặc đã bị xóa");
    }

    // Nếu DB vẫn còn vé, nghĩa là Redis bị lệch pha hoặc mất key
    if (event.availableTickets > 0) {
      console.log(`[Fallback] DB has ${event.availableTickets} tickets for "${event.title}". Re-syncing Redis...`);
      
      // Đồng bộ lại Redis (Dùng SET để ghi đè số âm hiện tại)
      await redisClient.set(key, event.availableTickets);
      
      // Thử lại lệnh DECR một lần cuối sau khi đã sync
      remaining = await redisClient.decr(key);
      
      if (remaining < 0) {
        throw new OutOfTicketsError("Hết vé rồi bạn ơi, vui lòng đợi đợt sau!");
      }
    } else {
      // Nếu DB cũng hết vé, ném lỗi luôn
      throw new OutOfTicketsError("Hết vé rồi bạn ơi, vui lòng đợi đợt sau!");
    }
  }

  // 📝 Bước 2: Ghi ticket vào MongoDB Atlas (Persistent Storage)
  const ticket = await Ticket.create({
    event: eventId,
    user: userId,
    status: TICKET_STATUS.CONFIRMED
  });

  // 🔄 Bước 3: Đồng bộ ngược lại MongoDB (Eventual Consistency)
  try {
    await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -1 } });
  } catch (updateError) {
    console.error(
      `[WARN] Event ${eventId} availableTickets sync failed after ticket ${ticket._id}. Manual fix needed.`,
      updateError.message
    );
  }

  return ticket;
};
