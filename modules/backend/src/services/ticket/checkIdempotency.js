const redisClient = require("../../libs/redis");
const { REDIS_KEYS } = require("../../types/constants");
const { DuplicateRegistrationError } = require("../../types/errors/AppError");

// Kiểm tra user đã đặt vé cho sự kiện này chưa (dùng Redis SET NX)
// TTL 10 phút — nếu job fail, user có thể thử lại sau 10 phút
const checkIdempotency = async (userId, eventId) => {
  const key = REDIS_KEYS.IDEMPOTENCY(userId, eventId);
  const result = await redisClient.set(key, "1", "EX", 600, "NX");

  if (!result) {
    throw new DuplicateRegistrationError();
  }
};

module.exports = { checkIdempotency };
