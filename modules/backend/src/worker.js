const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const { Worker } = require("bullmq");
const { Redis } = require("ioredis");
const mongoose = require("mongoose");
const ticketWorkerProcessor = require("./queues/ticketWorkerProcessor");

const bootstrap = async () => {
  try {
    // Worker cần kết nối MongoDB riêng (chạy khác process với server)
    await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 5 });
    console.log("[Worker] MongoDB Connected");

    // Tạo Redis connection riêng cho worker (BullMQ yêu cầu)
    const redisConnection = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    });

    const worker = new Worker("ticketQueue", ticketWorkerProcessor, {
      connection: redisConnection,
      concurrency: 5 // Xử lý 5 job song song
    });

    worker.on("completed", job => {
      console.log(`[Worker] Job ${job.id} done`);
    });

    worker.on("failed", (job, err) => {
      console.error(`[Worker] Job ${job?.id} failed:`, err.message);
    });

    console.log("[Worker] Listening for ticket jobs...");
  } catch (err) {
    console.error("[Worker] Bootstrap failed:", err);
    process.exit(1);
  }
};

bootstrap();
