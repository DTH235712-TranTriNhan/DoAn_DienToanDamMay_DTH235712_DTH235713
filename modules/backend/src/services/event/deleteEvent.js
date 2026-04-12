import Event from "../../models/EventModel.js";
import Ticket from "../../models/TicketModel.js";
import { AppError } from "../../types/errors/AppError.js";
import redisClient from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";

/**
 * Service: Xóa sự kiện
 * 
 * @param {string} eventId - ID của sự kiện cần xóa
 * @returns {Promise<boolean>} - Trạng thái xóa
 */
const deleteEvent = async (eventId) => {
  // 1. Tìm sự kiện để xem có tồn tại không
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Sự kiện không tồn tại", 404);
  }

  // 2. Kiểm tra logic: Chỉ chặn xóa nếu sự kiện CHƯA kết thúc VÀ đã có vé bán ra
  const isExpired = new Date(event.date) < new Date();
  
  if (!isExpired && event.availableTickets < event.totalTickets) {
    throw new AppError("Không thể xóa sự kiện đang hoặc sắp diễn ra khi đã có vé bán ra!", 400);
  }

  // 3. Xóa các vé liên quan (Cascade delete) để đảm bảo toàn vẹn dữ liệu
  const ticketDeleteResult = await Ticket.deleteMany({ event: eventId });
  if (ticketDeleteResult.deletedCount > 0) {
    console.log(`[DB] Deleted ${ticketDeleteResult.deletedCount} tickets associated with event ${eventId}`);
  }

  // 4. Xóa trong MongoDB
  await Event.findByIdAndDelete(eventId);
  console.log(`[DB] Deleted event ${eventId} from MongoDB`);

  // 5. Xóa khỏi Redis (nếu có cache tickets)
  const redisKey = REDIS_KEYS.EVENT_TICKETS(eventId);
  await redisClient.del(redisKey);
  console.log(`[Redis] Removed availableTickets key for event ${eventId}`);

  return true;
};

export default deleteEvent;
