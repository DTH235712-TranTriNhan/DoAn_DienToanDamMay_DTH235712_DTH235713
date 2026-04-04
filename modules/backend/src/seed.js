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
    description:
      "Sự kiện âm nhạc hoành tráng nhất năm 2025 quy tụ dàn sao khủng của showbiz Việt. Trải nghiệm hệ thống âm thanh, ánh sáng hiện đại bậc nhất.",
    date: new Date("2025-12-25"),
    location: "Sân vận động Quân khu 7, TP.HCM",
    totalTickets: 1000,
    availableTickets: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1280&auto=format&fit=crop",
    isFeatured: true
  },
  {
    title: "Tech Conference 2026: AI & Monorepo",
    description:
      "Hội nghị công nghệ đỉnh cao dành cho kỹ sư phần mềm, cập nhật xu hướng Cloud, AI và kiến trúc Monorepo hiện đại.",
    date: new Date("2026-05-10"),
    location: "Trung tâm Hội nghị Quốc gia",
    totalTickets: 500,
    availableTickets: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?q=80&w=1280&auto=format&fit=crop",
    isFeatured: true
  },
  {
    title: "Vaporwave Night: Neon Dreams",
    description:
      "Đêm nhạc điện tử đậm chất Cyberpunk với dàn DJ quốc tế. Đắm chìm trong không gian ánh sáng tím hồng đầy huyền ảo.",
    date: new Date("2025-10-15"),
    location: "Sailing Club, Nha Trang",
    totalTickets: 300,
    availableTickets: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253361-bee8a81f40fc?q=80&w=1280&auto=format&fit=crop",
    isFeatured: false
  },
  {
    title: "E-Sport Championship Final 2025",
    description:
      "Trận chung kết giải đấu thể thao điện tử lớn nhất khu vực. Chứng kiến những pha xử lý đỉnh cao từ dàn tuyển thủ chuyên nghiệp.",
    date: new Date("2025-11-20"),
    location: "Nhà thi đấu Phú Thọ, TP.HCM",
    totalTickets: 2000,
    availableTickets: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1280&auto=format&fit=crop",
    isFeatured: false
  },
  {
    title: "Street Art & Food Festival",
    description:
      "Lễ hội văn hóa đường phố kết hợp ẩm thực đa dạng. Khám phá các workshop nghệ thuật và thưởng thức đồ ăn từ khắp nơi trên thế giới.",
    date: new Date("2025-09-30"),
    location: "Phố đi bộ Nguyễn Huệ",
    totalTickets: 1500,
    availableTickets: 1500,
    imageUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1280&auto=format&fit=crop",
    isFeatured: false
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
