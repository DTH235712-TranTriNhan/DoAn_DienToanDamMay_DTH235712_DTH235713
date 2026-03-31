const { Redis } = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // Bắt buộc cho BullMQ
  enableReadyCheck: false,
  retryStrategy: times => Math.min(times * 50, 2000)
});

redisClient.on("error", err => console.error("[Redis] Error:", err.message));
redisClient.on("connect", () => console.log("[Redis] Upstash Connected"));

module.exports = redisClient;
