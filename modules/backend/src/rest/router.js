// src/rest/router.js  ─  Single source of truth cho tất cả routes
const { Router } = require("express");
const router = Router();

// Health check (không thuộc business domain nào)
const redisClient = require("../libs/redis");
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: require("mongoose").connection.readyState === 1 ? "connected" : "disconnected",
    redis: redisClient.status === "ready" ? "connected" : "connecting"
  });
});

// Domain routes
// router.use("/events", require("./routes/eventRoutes"));
// router.use("/auth", require("./routes/authRoutes")); // GĐ 3 – placeholder
// router.use("/tickets", require("./routes/ticketRoutes")); // GĐ 4–5 – placeholder

module.exports = router;
