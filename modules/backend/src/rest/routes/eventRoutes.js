import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { getEventsHandler } from "../handlers/event/getEventsHandler.js";

const router = Router();

// Route lấy danh sách sự kiện (đã dùng asyncHandler để bắt lỗi tự động)
router.get("/", asyncHandler(getEventsHandler));

export default router;
