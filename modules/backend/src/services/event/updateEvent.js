import Event from "../../models/EventModel.js";
import { AppError } from "../../types/errors/AppError.js";
import redis from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";

/**
 * Service: Cập nhật sự kiện - Task 3.3
 * Ràng buộc: Không cho phép sửa đổi totalTickets nếu sự kiện đã bắt đầu bán vé
 * 
 * @param {string} eventId - ID của sự kiện cần cập nhật
 * @param {Object} updateData - Dữ liệu cập nhật mới
 * @returns {Promise<Object>} - Đối tượng sự kiện đã cập nhật
 */
export const updateEvent = async (eventId, updateData) => {
  // 1. Tìm sự kiện hiện tại trong MongoDB
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Sự kiện không tồn tại", 404);
  }

  // 2. RÀNG BUỘC KỸ THUẬT: Kiểm tra nếu sửa totalTickets
  if (updateData.totalTickets !== undefined && updateData.totalTickets !== event.totalTickets) {
    // Nếu số vé khả dụng (availableTickets) ít hơn tổng số vé ban đầu -> Nghĩa là đã có giao dịch thành công
    if (event.availableTickets < event.totalTickets) {
      throw new AppError("Không thể thay đổi tổng số vé khi vé đã bắt đầu được bán", 400);
    }

    // Nếu hợp lệ, tự động đồng bộ lại availableTickets cho hợp lý
    // eslint-disable-next-line no-param-reassign
    updateData.availableTickets = updateData.totalTickets;
  }

  // 3. Cập nhật vào MongoDB
  const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
    new: true,
    runValidators: true
  });

  // 4. Đồng bộ lại Redis nếu totalTickets thay đổi
  // Do availableTickets chưa giảm (chúng ta đã chặn ở trên), việc sync lại Redis là an toàn.
  if (updateData.totalTickets !== undefined) {
    const redisKey = REDIS_KEYS.EVENT_TICKETS(eventId);
    await redis.set(redisKey, updateData.totalTickets);
  }

  console.log(`[EventService] Updated event ${updatedEvent.title}.`);

  return updatedEvent;
};

export default updateEvent;
