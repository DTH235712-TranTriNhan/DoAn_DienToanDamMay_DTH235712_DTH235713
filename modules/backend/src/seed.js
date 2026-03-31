import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Redis } from "ioredis";
import Event from "./models/EventModel.js"; // Nhớ thêm đuôi .js
import { REDIS_KEYS } from "./types/constants.js"; // Nhớ thêm đuôi .js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load cấu hình từ file .env ở thư mục gốc
dotenv.config({ path: path.join(__dirname, "../.env") });

const SEED_EVENTS = [
  {
    title: "Concert Anh Trai Say Hi 2025",
    description: "Sự kiện âm nhạc hoành tráng nhất năm 2025 quy tụ dàn sao khủng.",
    date: new Date("2025-12-25"),
    location: "Sân vận động Quân khu 7, TP.HCM",
    totalTickets: 1000,
    availableTickets: 1000
  },
  {
    title: "Tech Conference 2026",
    description: "Hội nghị công nghệ đỉnh cao, cập nhật xu hướng Cloud, AI và Monorepo.",
    date: new Date("2026-05-10"),
    location: "Trung tâm Hội nghị Quốc gia",
    totalTickets: 500,
    availableTickets: 500
  }
];

const seed = async () => {
  try {
    // 1. Kết nối DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[Seed] 🍃 MongoDB Connected");

    // 2. Kết nối Redis (Dùng URL từ .env, hỗ trợ cả Local và Upstash)
    const redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    });
    console.log("[Seed] ⚡ Redis Connected");

    // 3. Xoá dữ liệu cũ để làm sạch môi trường test
    await Event.deleteMany({});
    console.log("[Seed] 🧹 Cleared old events in MongoDB");

    // 4. Tạo events mới
    const events = await Event.insertMany(SEED_EVENTS);
    console.log(`[Seed] 📁 Inserted ${events.length} events into MongoDB`);

    // 5. QUAN TRỌNG: Đồng bộ số lượng vé vào Redis
    // Đây là bước giúp hệ thống Flash Sale của bạn chạy cực nhanh mà không bị quá tải DB
    for (const event of events) {
      const key = REDIS_KEYS.EVENT_TICKETS(event._id.toString());
      await redis.set(key, event.availableTickets);
      console.log(`[Seed] 🔑 Redis SET ${key} = ${event.availableTickets}`);
    }

    console.log("\n✅ [Seed] Done! Dữ liệu đã sẵn sàng để test.");
    await redis.quit();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ [Seed] Error:", err);
    process.exit(1);
  }
};

seed();
