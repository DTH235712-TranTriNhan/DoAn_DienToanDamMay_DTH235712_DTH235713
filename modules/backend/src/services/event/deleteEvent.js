import Event from "../../models/EventModel.js";
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

  // 2. Không cho xóa nếu đã có vé bán ra (để bảo vệ tính toàn vẹn dữ liệu)
  // Lưu ý: tickets có thể được lấy từ TicketModel, ở đây ta kiểm tra availableTickets
  if (event.availableTickets < event.totalTickets) {
    throw new AppError("Không thể xóa sự kiện đã có vé bán ra, hãy yêu cầu người mua huỷ vé để có thể xoá!", 400);
  }

  // 3. Xóa trong MongoDB
  await Event.findByIdAndDelete(eventId);
  console.log(`[DB] Deleted event ${eventId} from MongoDB`);

  // 4. Xóa khỏi Redis (nếu có cache tickets)
  const redisKey = REDIS_KEYS.EVENT_TICKETS(eventId);
  await redisClient.del(redisKey);
  console.log(`[Redis] Removed availableTickets key for event ${eventId}`);

  return true;
};

export default deleteEvent;
