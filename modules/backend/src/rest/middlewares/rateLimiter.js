const rateLimit = require("express-rate-limit");
const { RATE_LIMIT } = require("../../types/constants");

// Rate limiter chung cho tất cả /api routes
const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true, // Trả header `RateLimit-*`
  legacyHeaders: false,
  message: {
    success: false,
    message: "Quá nhiều request, vui lòng thử lại sau 15 phút"
  }
});

// Rate limiter nghiêm ngặt hơn cho đặt vé (chống bot)
const ticketLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.TICKET_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu đặt vé, vui lòng thử lại sau"
  }
});

module.exports = { generalLimiter, ticketLimiter };
