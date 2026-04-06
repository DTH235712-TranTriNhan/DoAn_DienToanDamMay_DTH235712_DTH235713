import Event from "../../models/EventModel.js";
import redisClient from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";

/**
 * Service: Tạo sự kiện mới - Task 3.3
 * 1. Lưu thông tin vào MongoDB
 * 2. Đồng bộ số lượng vé lên Redis để phục vụ luồng Flash Sale nguyên tử (Atomic DECR)
 * 
 * @param {Object} eventData - Dữ liệu sự kiện từ request body
 * @returns {Promise<Object>} - Đối tượng sự kiện đã được lưu
 */
const createEvent = async (eventData) => {
  // 1. Khởi tạo số lượng vé khả dụng (availableTickets) bằng tổng số vé (totalTickets)
  const dataToSave = {
    ...eventData,
    availableTickets: eventData.totalTickets
  };

  // 2. Lưu vào MongoDB
  const newEvent = await Event.create(dataToSave);
  console.log(`[DB] Created event ${newEvent.title} with ID: ${newEvent._id}`);

  // 3. Đưa số vé lên Redis
  // Đây là hằng số cực kỳ quan trọng cho hệ thống chịu tải cao [cite: Task 3.3]
  const redisKey = REDIS_KEYS.EVENT_TICKETS(newEvent._id.toString());
  await redisClient.set(redisKey, newEvent.totalTickets);

  console.log(`[Redis] Synced ${newEvent.totalTickets} tickets for event ${newEvent._id}`);

  return newEvent;
};

export default createEvent;
