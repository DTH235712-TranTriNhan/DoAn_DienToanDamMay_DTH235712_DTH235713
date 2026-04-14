import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../../types/constants/rateLimit.js";

/**
 * Rate limiter chung cho tất cả các đầu API
 * Giúp tránh việc server bị treo do quá nhiều request ảo
 */
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS || 15 * 60 * 1000, // Mặc định 15 phút
  max: RATE_LIMIT.MAX_REQUESTS || 100, // Giới hạn số lượng request
  standardHeaders: true, // Trả về header `RateLimit-*` để Frontend biết khi nào bị chặn
  legacyHeaders: false,
  message: {
    success: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút"
  }
});

/**
 * Rate limiter nghiêm ngặt hơn dành riêng cho luồng ĐẶT VÉ
 * Đây là chốt chặn quan trọng để chống Bot săn vé (Scalping Bot)
 */
export const ticketLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS || 15 * 60 * 1000,
  max: RATE_LIMIT.TICKET_MAX || 5, // Giới hạn cực thấp (VD: chỉ cho phép 5 lần/15p)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu đặt vé, vui lòng thử lại sau"
  }
});
