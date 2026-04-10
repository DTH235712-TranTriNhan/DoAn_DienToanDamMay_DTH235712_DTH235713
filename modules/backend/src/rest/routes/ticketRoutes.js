import { Router } from "express";
// QUAN TRỌNG: Tất cả import nội bộ phải có đuôi .js
import asyncHandler from "../middlewares/asyncHandler.js";
import validateJwt from "../middlewares/validateJwt.js";
import { ticketLimiter } from "../middlewares/rateLimiter.js";
// Import các handler xử lý logic vé
import { registerTicketHandler } from "../handlers/ticket/registerTicketHandler.js";
import { getJobStatusHandler } from "../handlers/ticket/getJobStatusHandler.js";
import { getMyTicketsHandler } from "../handlers/ticket/getMyTicketsHandler.js";
import { cancelTicketHandler } from "../handlers/ticket/cancelTicketHandler.js";

const router = Router();

/**
 * TẤT CẢ ROUTE VỀ VÉ ĐỀU CẦN ĐĂNG NHẬP
 * Middleware validateJwt sẽ kiểm tra Token trước khi cho đi tiếp
 */
router.use(validateJwt);

/**
 * 1. ĐẶT VÉ (POST /api/tickets)
 * Có ticketLimiter để chặn Bot spam nút mua vé
 */
router.post("/", ticketLimiter, asyncHandler(registerTicketHandler));

/**
 * 2. KIỂM TRA TRẠNG THÁI (GET /api/tickets/status/:jobId)
 * Vì dùng BullMQ (hàng đợi), nên sau khi nhấn mua, FE sẽ dùng ID này để check xem mua xong chưa
 */
router.get("/status/:jobId", asyncHandler(getJobStatusHandler));

/**
 * 3. LẤY DANH SÁCH VÉ ĐÃ MUA (GET /api/tickets/my)
 */
router.get("/my", asyncHandler(getMyTicketsHandler));

/**
 * 4. HỦY VÉ (PATCH /api/tickets/:ticketId/cancel)
 */
router.patch("/:ticketId/cancel", validateJwt, asyncHandler(cancelTicketHandler));

export default router;
