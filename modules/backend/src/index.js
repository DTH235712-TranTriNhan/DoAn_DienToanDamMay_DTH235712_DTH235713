import "./loadEnv.js";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import "./config/googleOAuth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Import các module nội bộ (BẮT BUỘC phải có đuôi .js) ──────────
import { connectToServers } from "./config/connectToServers.js";
import mainRouter from "./rest/router.js";
import errorHandler from "./rest/middlewares/errorHandler.js";
import { NotFoundError } from "./types/errors/AppError.js";

const app = express();

// ── Middleware Stack ─────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // 1. Cho phép hiển thị ảnh từ các nguồn đã biết
        "img-src": [
          "'self'",
          "data:",
          "https://lh3.googleusercontent.com", // Google Avatar
          "https://images.unsplash.com", // Ảnh sự kiện
          "https://maps.google.com", // Google Maps tiles
          "https://placehold.co"
        ],
        // 2. QUAN TRỌNG: Cho phép nhúng iframe từ Google Maps
        "frame-src": ["'self'", "https://www.google.com", "https://maps.google.com"],
        // 3. Cho phép tải các script từ Google (nếu dùng API thay vì iframe)
        "script-src": ["'self'", "https://maps.googleapis.com"]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(passport.initialize());

// ── Tối ưu Morgan Logging ─────────────────────────────────────────

// 1. Gắn Context prefix cho các route
morgan.token("context", req => {
  const url = req.originalUrl || req.url || "";
  return url.startsWith("/api") ? "API" : "System";
});

// 2. Lọc bỏ nhiễu (Skip Noise) - Tối ưu cho độ sạch tối đa
const skipLog = (req, res) => {
  const url = req.originalUrl || req.url || "";

  // BẮT BUỘC luôn in log cho các nghiệp vụ Flash Sale lõi (Đặt vé & Hủy vé)
  if ((req.method === "POST" || req.method === "PATCH") && url.includes("/api/tickets")) {
    return false; // Không skip
  }

  // Luôn in log cho mọi yêu cầu có mã trạng thái >= 400 (Lỗi hệ thống/nghiệp vụ)
  if (res.statusCode >= 400) return false;

  // Luôn skip mã 304
  if (res.statusCode === 304) return true;

  // Bỏ qua (skip) tất cả các request đến các file tĩnh
  if (url.includes("/assets/") || url.match(/\.(css|js|png|jpg|jpeg|ico|svg|woff2?|ico|map)$/i)) {
    return true;
  }

  // Bỏ qua log cho các route polling và điều hướng thành công (GET 200/302)
  if (res.statusCode < 400) {
    const noisyRoutes = [
      "/api/auth/me",
      "/api/events",
      "/api/tickets/my",
      "/api/tickets/status",
      "/api/health",
      "/auth/google"
    ];

    if (url === "/" || noisyRoutes.some(route => url.includes(route))) {
      return true;
    }
  }

  return false;
};

// 3. Cấu hình định dạng môi trường (Tinh gọn)
const devFormat = (tokens, req, res) => {
  return `[${tokens.context(req, res)}] ${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} - ${tokens["response-time"](req, res)} ms`;
};

const prodFormat = (tokens, req, res) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    context: tokens.context(req, res),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    responseTimeMs: Number(tokens["response-time"](req, res)),
    clientIp: req.headers["x-forwarded-for"] || req.socket.remoteAddress
  });
};

// Tự động dùng format tinh gọn khi chạy Local (không có biến RENDER của đám mây)
const isCloud = process.env.RENDER === "true";
app.use(morgan(isCloud ? prodFormat : devFormat, { skip: skipLog }));

// ── Routes ───────────────────────────────────────────────────────
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/api", mainRouter);

// ── SPA Static Serve (production) ────────────────────────────────
if (process.env.NODE_ENV === "production" || process.env.SERVE_UI === "true") {
  const frontendPath = path.join(__dirname, "../../ui/dist");
  app.use(express.static(frontendPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ── 404 Handler ──────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} không tồn tại`));
});

// ── Global Error Handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ────────────────────────────────────────────────────
const bootstrap = async () => {
  try {
    await connectToServers();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`\n[SYSTEM] 🚀 Hệ thống đăng ký vé sự kiện đã sẵn sàng!`);

      if (process.env.NODE_ENV === "production" || process.env.SERVE_UI === "true") {
        console.log(`[SYSTEM] 🔗 Giao diện Web:  http://localhost:${PORT}`);
      }

      console.log(`[SYSTEM] 🔗 API Endpoint:   http://localhost:${PORT}/api`);
      console.log(`[SYSTEM] 🔗 Health Check:   http://localhost:${PORT}/api/health`);

      if (process.env.NODE_ENV !== "production" && process.env.SERVE_UI !== "true") {
        console.log(`[SYSTEM] 🔗 Giao diện Dev:  http://localhost:5173 (Vite)`);
      }

      console.log(`\n[SYSTEM] 💡 Mẹo: Nhấn Ctrl + Click vào đường dẫn trên để mở trang web.\n`);
    });
  } catch (err) {
    console.error("[SYSTEM] ❌ Không thể khởi động server:", err);
    process.exit(1);
  }
};

bootstrap();
