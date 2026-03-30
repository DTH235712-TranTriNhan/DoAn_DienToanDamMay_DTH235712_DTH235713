const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

// 1. Nạp biến môi trường
require("dotenv").config({ path: path.join(__dirname, ".env") });

// --- THÊM DÒNG NÀY (Khai báo Route) ---
const eventRoutes = require("./routes/eventRoutes");
// --------------------------------------

const connectDB = require("./config/database");
const redisClient = require("./config/redis");

const app = express();

// 2. Middleware bảo mật & tiện ích
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(morgan("dev"));

// 3. Kết nối Cơ sở dữ liệu
connectDB();

// --- THÊM DÒNG NÀY (Sử dụng Route) ---
// Dòng này phải nằm SAU app.use(express.json()) và TRƯỚC app.listen
app.use("/api/events", eventRoutes);
// --------------------------------------

// 4. Route kiểm tra trạng thái hệ thống
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    redis: redisClient.status === "ready" ? "connected" : "connecting"
  });
});

// 5. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Dang chay tai cong: ${PORT}`);
  console.log(`[Status] Bam Ctrl + Click vao day de kiem tra: http://localhost:${PORT}/health`);
});
