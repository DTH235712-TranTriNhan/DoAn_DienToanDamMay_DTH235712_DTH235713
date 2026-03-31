const { Router } = require("express");
const { generalLimiter } = require("./middlewares/rateLimiter");

const router = Router();

// Rate limit toàn bộ /api
router.use(generalLimiter);

// Health check — không thuộc business domain nào
const redisClient = require("../libs/redis");
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: require("mongoose").connection.readyState === 1 ? "connected" : "disconnected",
    redis: redisClient.status === "ready" ? "connected" : "connecting"
  });
});

// Domain routes
router.use("/events", require("./routes/eventRoutes"));
router.use("/auth", require("./routes/authRoutes")); // Bật khi làm GĐ 3
router.use("/tickets", require("./routes/ticketRoutes")); // Bật khi làm GĐ 4-5

module.exports = router;
