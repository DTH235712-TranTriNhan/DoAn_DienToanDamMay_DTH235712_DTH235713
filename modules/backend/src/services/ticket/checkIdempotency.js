import redisClient from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants.js";
// CHÚ Ý: Đảm bảo DuplicateRegistrationError được export đúng từ AppError.js
import { DuplicateRegistrationError } from "../../types/errors/AppError.js";

/**
 * Kiểm tra xem User đã gửi yêu cầu đặt vé cho sự kiện này chưa.
 * Sử dụng cơ chế Atomic SET NX của Redis để chặn trùng lặp ngay lập tức.
 * * @param {string} userId - ID người dùng
 * @param {string} eventId - ID sự kiện
 */
export const checkIdempotency = async (userId, eventId) => {
  const key = REDIS_KEYS.IDEMPOTENCY(userId, eventId);

  // SET key "1" với:
  // "EX", 600: Hết hạn sau 10 phút (TTL)
  // "NX": Chỉ ghi nếu key CHƯA tồn tại (Not Exists)
  const result = await redisClient.set(key, "1", "EX", 600, "NX");

  // Nếu result là null -> Key đã tồn tại -> Người dùng đang nhấn quá nhanh hoặc đã đặt rồi
  if (!result) {
    throw new DuplicateRegistrationError();
  }
};
