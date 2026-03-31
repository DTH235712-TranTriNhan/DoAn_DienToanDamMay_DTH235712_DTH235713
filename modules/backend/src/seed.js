const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const { Redis } = require("ioredis");
const Event = require("./models/EventModel");
const { REDIS_KEYS } = require("./types/constants");

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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[Seed] MongoDB Connected");

    const redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    });
    await new Promise(resolve => redis.once("ready", resolve));
    console.log("[Seed] Redis Connected");

    // Xoá dữ liệu cũ
    await Event.deleteMany({});
    console.log("[Seed] Cleared old events");

    // Tạo events mới
    const events = await Event.insertMany(SEED_EVENTS);
    console.log(`[Seed] Inserted ${events.length} events`);

    // Sync ticket count vào Redis (cho DECR atomic khi đặt vé)
    for (const event of events) {
      const key = REDIS_KEYS.EVENT_TICKETS(event._id.toString());
      await redis.set(key, event.availableTickets);
      console.log(`[Seed] Redis SET ${key} = ${event.availableTickets}`);
    }

    console.log("[Seed] Done!");
    await redis.quit();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Seed] Error:", err);
    process.exit(1);
  }
};

seed();
