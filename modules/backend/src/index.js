const path = require("path");

// Chỉ load .env file khi chạy local (trên Render/Docker, env vars đã có sẵn)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

const { connectToServers } = require("./config/connectToServers");
const mainRouter = require("./rest/router");
const errorHandler = require("./rest/middlewares/errorHandler");
const { NotFoundError } = require("./types/errors/AppError");

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

// ── Global Error Handler — PHẢI đặt sau tất cả routes ───────────
app.use(errorHandler);

// ── Bootstrap ────────────────────────────────────────────────────
const bootstrap = async () => {
  try {
    await connectToServers();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[Bootstrap] Không thể khởi động server:", err);
    process.exit(1);
  }
};

bootstrap();
