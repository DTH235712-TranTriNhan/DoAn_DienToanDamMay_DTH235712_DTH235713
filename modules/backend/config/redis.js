const { Redis } = require("ioredis");

/**
 * Khởi tạo: redisClient
 * Chức năng: Kết nối Upstash Redis phục vụ BullMQ và Caching
 */
const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: times => Math.min(times * 50, 2000)
});

redisClient.on("error", err => {
  console.error("[Redis] Connection error:", err.message);
});

redisClient.on("connect", () => {
  console.log("[Redis] Upstash Connected...");
});

module.exports = redisClient;
