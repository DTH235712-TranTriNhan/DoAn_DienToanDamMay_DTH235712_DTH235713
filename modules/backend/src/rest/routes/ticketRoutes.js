const { Router } = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const validateJwt = require("../middlewares/validateJwt");
const { ticketLimiter } = require("../middlewares/rateLimiter");
const { registerTicketHandler } = require("../handlers/ticket/registerTicketHandler");
const { getJobStatusHandler } = require("../handlers/ticket/getJobStatusHandler");
const { getMyTicketsHandler } = require("../handlers/ticket/getMyTicketsHandler");

const router = Router();

// Tất cả ticket routes đều cần đăng nhập
router.use(validateJwt);

// POST /api/tickets — đặt vé (rate limit strict)
router.post("/", ticketLimiter, asyncHandler(registerTicketHandler));

// GET /api/tickets/status/:jobId — kiểm tra trạng thái job đặt vé
router.get("/status/:jobId", asyncHandler(getJobStatusHandler));

// GET /api/tickets/my — lấy danh sách vé của user
router.get("/my", asyncHandler(getMyTicketsHandler));

module.exports = router;
