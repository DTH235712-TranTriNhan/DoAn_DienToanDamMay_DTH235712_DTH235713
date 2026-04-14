import Event from "../../models/EventModel.js";
import { AppError } from "../../types/errors/AppError.js";
import redisClient from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";

/**
 * Service: Cập nhật sự kiện - Task 3.3
 * Ràng buộc: Không cho phép sửa đổi totalTickets nếu sự kiện đã bắt đầu bán vé
 *
 * @param {string} eventId - ID của sự kiện cần cập nhật
 * @param {Object} updateData - Dữ liệu cập nhật mới
 * @returns {Promise<Object>} - Đối tượng sự kiện đã cập nhật
 */
const updateEvent = async (eventId, eventData) => {
  // 1. Khởi tạo và trích xuất trường tường minh (Input Sanitization)
  const { title, description, date, location, totalTickets, imageUrl, isHot, category, price } =
    eventData;
  const updateData = {
    title,
    description,
    date,
    location,
    totalTickets,
    imageUrl,
    isHot,
    category,
    price
  };

  // 2. Tìm sự kiện hiện tại trong MongoDB
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Sự kiện không tồn tại", 404);
  }

  // 2. RÀNG BUỘC KỸ THUẬT: Kiểm tra nếu sửa totalTickets
  if (updateData.totalTickets !== undefined && updateData.totalTickets !== event.totalTickets) {
    // Nếu số vé khả dụng (availableTickets) ít hơn tổng số vé ban đầu -> Nghĩa là đã có giao dịch thành công
    if (event.availableTickets < event.totalTickets) {
      throw new AppError("Không thể thay đổi tổng số vé khi vé đã bắt đầu bán", 400);
    }

    // Nếu hợp lệ, tự động đồng bộ lại availableTickets cho hợp lý

    updateData.availableTickets = updateData.totalTickets;
  }

  // 3. Cập nhật vào MongoDB
  const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
    returnDocument: "after",
    runValidators: true
  });
  console.log(`[DB] Updated event ${eventId} in MongoDB`);

  // 4. Đồng bộ lại Redis nếu có thay đổi về số lượng vé
  // Luôn sử dụng availableTickets để đảm bảo tính nhất quán [cite: Task 3.3]
  if (updateData.totalTickets !== undefined) {
    const redisKey = REDIS_KEYS.EVENT_TICKETS(eventId);
    await redisClient.set(redisKey, updatedEvent.availableTickets);
    console.log(
      `[Redis] Synced availableTickets for event ${eventId} to ${updatedEvent.availableTickets}`
    );
  }

  return updatedEvent;
};

export default updateEvent;
