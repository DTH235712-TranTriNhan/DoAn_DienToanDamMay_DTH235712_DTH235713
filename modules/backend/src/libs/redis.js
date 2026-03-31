import { Redis } from "ioredis";

/**
 * Cấu hình Redis linh hoạt:
 * Tự động kết nối Local nếu không có URL Cloud hoặc khi đang phát triển.
 */
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const isLocal = redisUrl.includes("127.0.0.1") || redisUrl.includes("localhost");

const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Bắt buộc cho BullMQ [cite: 2]
  enableReadyCheck: false,
  // Nếu là Upstash (Cloud) thì thường cần TLS, Local thì không cần
  tls: !isLocal && redisUrl.startsWith("rediss://") ? {} : undefined,
  retryStrategy: times => Math.min(times * 50, 2000)
});

// Log lỗi có kèm thông tin chi tiết để dễ debug
redisClient.on("error", err => {
  console.error(`[Redis] Error (${isLocal ? "Local" : "Cloud"}):`, err.message);
});

// Log trạng thái kết nối thông minh hơn
redisClient.on("connect", () => {
  console.log(`[Redis] ${isLocal ? "Local Host" : "Upstash Cloud"} Connected ✅`);
});

export default redisClient;
