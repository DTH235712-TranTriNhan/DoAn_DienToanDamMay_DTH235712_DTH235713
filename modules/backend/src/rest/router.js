import { Router } from "express";
import mongoose from "mongoose";
import redisClient from "../libs/redis.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

const router = Router();

// ── Middleware Hệ thống ──────────────────────────────────────────
// Áp dụng Rate limit (100 req/15p) cho toàn bộ API để chống DDoS [3]
router.use(generalLimiter);

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Chào mừng bạn đến với API Hệ thống đăng ký vé sự kiện (Đồ án ĐTĐM)",
    version: "1.0.0",
    docs: "/api/health"
  });
});

// ── Health Check ─────────────────────────────────────────────────
// Endpoint kiểm tra trạng thái kết nối hạ tầng Cloud [4]
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    redis: redisClient.status === "ready" ? "connected" : "connecting"
  });
});

// ── Domain Routes (Các cổng nghiệp vụ) ─────────────────────────────
// Quản lý sự kiện (Task 1.4, 3.3)
router.use("/events", eventRoutes);

// Xác thực Google OAuth 2.0 (Bật theo Task 2.2) [1]
router.use("/auth", authRoutes);

// Đặt vé Flash Sale & Polling (Bật theo Task 4.1) [2]
router.use("/tickets", ticketRoutes);

export default router;
