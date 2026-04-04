import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Worker } from "bullmq";
import { Redis } from "ioredis";
import mongoose from "mongoose";
import ticketWorkerProcessor from "./queues/ticketWorkerProcessor.js"; // Nhớ đuôi .js
import { QUEUES } from "./types/constants/queues.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load cấu hình môi trường
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../.env") });
}

const bootstrap = async () => {
  try {
    // 1. Worker cần kết nối MongoDB riêng vì nó chạy ở process khác
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5 // Giới hạn pool để tiết kiệm tài nguyên Cloud
    });
    console.log("👷 [Worker] MongoDB Connected");

    // 2. Tạo kết nối Redis riêng cho BullMQ
    const redisConnection = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
      // Nếu dùng Upstash Cloud thì thêm logic TLS như mình hướng dẫn ở file redis.js
    });

    // 3. Khởi tạo Worker để lắng nghe hàng đợi "ticketQueue"
    const worker = new Worker(QUEUES.TICKET, ticketWorkerProcessor, {
      connection: redisConnection,
      concurrency: 5 // Xử lý song song 5 vé cùng lúc
    });

    // 4. Các sự kiện theo dõi trạng thái
    worker.on("completed", job => {
      console.log(`✅ [Worker] Job ${job.id} - Đặt vé thành công!`);
    });

    worker.on("failed", (job, err) => {
      console.error(`❌ [Worker] Job ${job?.id} thất bại:`, err.message);
    });

    console.log("🚀 [Worker] Đang trực chiến, chờ xử lý vé từ hàng chờ...");
  } catch (err) {
    console.error("🔥 [Worker] Khởi động thất bại:", err);
    process.exit(1);
  }
};

bootstrap();
