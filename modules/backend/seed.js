const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Event = require("./models/EventModel"); // Đảm bảo bạn đã tạo file Event.js trong thư mục models

const seedData = [
  {
    title: "Concert Anh Trai Say Hi 2025",
    description: "Đêm nhạc hội tụ các anh trai cực hot tại TP.HCM.",
    date: new Date("2025-12-25"),
    location: "Sân vận động Quân khu 7",
    totalTickets: 1000,
    availableTickets: 1000
  },
  {
    title: "Tech Conference 2026",
    description: "Hội thảo công nghệ Điện toán đám mây.",
    date: new Date("2026-05-10"),
    location: "Trung tâm Hội nghị Quốc gia",
    totalTickets: 500,
    availableTickets: 500
  }
];

const seedDB = async () => {
  try {
    // Kết nối tới MongoDB bằng chuỗi trong file .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[Seed] Dang ket noi MongoDB...");

    await Event.deleteMany({});
    await Event.insertMany(seedData);

    console.log("✅ [Seed] Da tao du lieu mau thanh cong!");
    process.exit();
  } catch (err) {
    console.error("❌ [Seed Error]", err);
    process.exit(1);
  }
};

seedDB();
