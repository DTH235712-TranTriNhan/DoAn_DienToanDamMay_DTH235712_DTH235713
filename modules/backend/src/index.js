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
    contentSecurityPolicy: process.env.SERVE_UI === "true" ? undefined : false
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
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

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
      console.log(`\n🚀 [Server] Hệ thống đăng ký vé sự kiện đã sẵn sàng!`);

      if (process.env.NODE_ENV === "production" || process.env.SERVE_UI === "true") {
        console.log(`🔗 Giao diện Web:  http://localhost:${PORT}`);
      }

      console.log(`🔗 API Endpoint:   http://localhost:${PORT}/api`);
      console.log(`🔗 Health Check:   http://localhost:${PORT}/api/health`);

      if (process.env.NODE_ENV !== "production" && process.env.SERVE_UI !== "true") {
        console.log(`🔗 Giao diện Dev:  http://localhost:5173 (Vite)`);
      }

      console.log(`\n💡 Mẹo: Nhấn Ctrl + Click vào đường dẫn trên để mở trang web.\n`);
    });
  } catch (err) {
    console.error("[Bootstrap] Không thể khởi động server:", err);
    process.exit(1);
  }
};

bootstrap();
