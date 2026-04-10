import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Redis } from "ioredis";

// Models
import Event from "./models/EventModel.js";
import Ticket from "./models/TicketModel.js";
import Transaction from "./models/TransactionModel.js";
import User from "./models/UserModel.js";

// Constants
import { REDIS_KEYS } from "./types/constants/redisKeys.js";
import { TICKET_STATUS, TRANSACTION_STATUS } from "./types/constants/statuses.js";
import { USER_ROLES } from "./types/constants/userRoles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load cấu hình từ file .env ở thư mục gốc của module backend
dotenv.config({ path: path.join(__dirname, "../.env") });

const TEST_USER_ID = "67890abcdef1234567890abc";

const EVENTS_DATA = [
  {
    title: "Neon Night Concert",
    description: "Đêm nhạc đỉnh cao với ánh sáng neon và âm thanh Cyberpunk sống động.",
    date: new Date("2026-06-15"),
    location: "Sân vận động Quân khu 7",
    totalTickets: 500,
    price: 1500000,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1280&auto=format&fit=crop",
    isHot: true
  },
  {
    title: "AI Cloud Summit 2026",
    description: "Hội nghị thượng đỉnh về Cloud Native và trí tuệ nhân tạo tương lai.",
    date: new Date("2026-08-20"),
    location: "Trung tâm Hội nghị Quốc gia",
    totalTickets: 200,
    price: 500000,
    imageUrl: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?q=80&w=1280&auto=format&fit=crop",
    isHot: true
  },
  {
    title: "Esports Championship AGU",
    description: "Giải đấu thể thao điện tử quy mô lớn với các đội tuyển hàng đầu.",
    date: new Date("2026-07-10"),
    location: "Nhà thi đấu Phú Thọ",
    totalTickets: 300,
    price: 300000,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1280&auto=format&fit=crop",
    isHot: false
  },
  {
    title: "Node.js Mastery Workshop",
    description: "Workshop chuyên sâu về tối ưu hóa Backend và kiến trúc microservices.",
    date: new Date("2026-05-05"),
    location: "Vinhomes Central Park",
    totalTickets: 100,
    price: 750000,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1280&auto=format&fit=crop",
    isHot: false
  },
  {
    title: "Cyber Security Hackathon",
    description: "Cuộc thi bảo mật mạng dành cho các chuyên gia và học sinh sinh viên.",
    date: new Date("2026-09-12"),
    location: "Đại học Bách Khoa TP.HCM",
    totalTickets: 150,
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1280&auto=format&fit=crop",
    isHot: false
  },
  {
    title: "VR/AR Creative Studio",
    description: "Trải nghiệm thế giới ảo VR và thực tế tăng cường AR tiên tiến nhất.",
    date: new Date("2026-10-30"),
    location: "Bitexco Financial Tower",
    totalTickets: 120,
    price: 450000,
    imageUrl: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1280&auto=format&fit=crop",
    isHot: false
  },
  {
    title: "Deep House Session @ CyberBar",
    description: "Thư giãn cùng dòng nhạc Deep House trong không gian Bar mang đậm chất tương lai.",
    date: new Date("2026-11-20"),
    location: "CyberBar Rooftop",
    totalTickets: 400,
    price: 800000,
    imageUrl: "https://images.unsplash.com/photo-1514525253361-bee8a81f40fc?q=80&w=1280&auto=format&fit=crop",
    isHot: true
  },
  {
    title: "Blockchain Future Forum",
    description: "Diễn đàn về ứng dụng Web3 và tương lai của tiền mã hóa toàn cầu.",
    date: new Date("2026-12-05"),
    location: "Landmark 81",
    totalTickets: 250,
    price: 600000,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1280&auto=format&fit=crop",
    isHot: false
  }
];

const seed = async () => {
  let redis;
  try {
    console.log("[Seed-System] 🚀 Bắt đầu quá trình chuẩn bị dữ liệu báo cáo...");

    // 1. Kết nối DB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[Seed-System] ✅ MongoDB đã kết nối");

    // 2. Kết nối Redis
    const isLocal = (process.env.REDIS_URL || "").includes("127.0.0.1");
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: !isLocal && (process.env.REDIS_URL || "").startsWith("rediss://") ? {} : undefined
    });
    
    // Đợi Redis sẵn sàng
    await new Promise((resolve) => redis.once('ready', resolve));
    console.log("[Seed-System] ✅ Redis đã kết nối");

    // 3. Clean Slate
    console.log("[Seed-System] 🗑️ Đang dọn dẹp hệ thống (Clean Slate)...");
    await Promise.all([
      Event.deleteMany({}),
      Ticket.deleteMany({}),
      Transaction.deleteMany({}),
      User.deleteMany({})
    ]);
    await redis.flushall();
    console.log("[Seed-System] ✅ Đã xóa sạch dữ liệu cũ và reset Redis counter");

    // 4. Tạo User mẫu (Tester)
    console.log(`[Seed-System] 👤 Đang tạo User Tester với ID: ${TEST_USER_ID}`);
    const tester = await User.create({
      _id: new mongoose.Types.ObjectId(TEST_USER_ID),
      googleId: "google_tester_12345",
      email: "tester@agu.edu.vn",
      displayName: "Demo Tester AGU",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tester",
      role: USER_ROLES.USER
    });

    // 5. Tạo 8 Sự kiện mẫu
    console.log("[Seed-System] 📅 Đang tạo 8 sự kiện mẫu...");
    // Khởi tạo availableTickets bằng totalTickets trước khi điều chỉnh theo vé đã sở hữu
    const eventsToInsert = EVENTS_DATA.map(e => ({
      ...e,
      availableTickets: e.totalTickets
    }));
    const events = await Event.insertMany(eventsToInsert);

    // 6. Tạo 5 vé sẵn có cho User thuộc 5 sự kiện đầu tiên để trình diễn
    console.log("[Seed-System] ⚡ Đang tạo 5 vé mẫu cho Tester (Trình diễn 'Vé của tôi')...");
    for (let i = 0; i < 5; i++) {
        const event = events[i];
        
        // Tạo vé
        const ticket = await Ticket.create({
            user: tester._id,
            event: event._id,
            status: TICKET_STATUS.CONFIRMED
        });

        // Tạo transaction tương ứng
        await Transaction.create({
            user: tester._id,
            ticket: ticket._id,
            amount: event.price,
            status: TRANSACTION_STATUS.SUCCESS
        });

        // Cập nhật tính nhất quán: Giảm availableTickets trong MongoDB cho sự kiện này
        event.availableTickets -= 1;
        await event.save();
    }

    // 7. Đồng bộ số lượng vé vào Redis (Người gác cổng cho Flash Sale)
    console.log("[Seed-System] 🛡️ Đang đồng bộ số lượng vé khả dụng vào Redis...");
    for (const event of events) {
      const key = REDIS_KEYS.EVENT_TICKETS(event._id.toString());
      await redis.set(key, event.availableTickets);
      
      // Đồng bộ cả key USER_BOUGHT để UI ghi nhận 'Đã sở hữu' mà không cần query DB
      const hasTicket = events.indexOf(event) < 5;
      if (hasTicket) {
          const boughtKey = REDIS_KEYS.USER_BOUGHT(tester._id.toString(), event._id.toString());
          await redis.set(boughtKey, "1");
      }
      
      console.log(`[Seed-System] ✅ Redis SET ${key} = ${event.availableTickets}${hasTicket ? " (Đã sở hữu)" : ""}`);
    }

    console.log(`\n[Seed-System] ✅ HOÀN TẤT: Đã tạo 8 sự kiện, 1 Tester User và 5 vé mẫu.`);
    console.log(`[Seed-System] 📊 Dữ liệu đã sẵn sàng để trình diễn đồ án.`);

  } catch (err) {
    console.error(`[Seed-System] ❌ LỖI TRONG QUÁ TRÌNH SEED:`, err);
    process.exit(1);
  } finally {
    try {
      if (redis) {
        await redis.disconnect();
      }
      await mongoose.disconnect();
      console.log("[Seed-System] 👋 Đã đóng các kết nối. Script hoàn tất.");
    } catch (closeErr) {
      // Bỏ qua lỗi khi đóng kết nối nếu có
    }
  }
};

seed();
