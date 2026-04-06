import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateJwt from "../middlewares/validateJwt.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import { getEventsHandler } from "../handlers/event/getEventsHandler.js";
import { createEventHandler } from "../handlers/event/createEventHandler.js";
import { updateEventHandler } from "../handlers/event/updateEventHandler.js";

const router = Router();

// Route công khai: Lấy danh sách sự kiện
router.get("/", asyncHandler(getEventsHandler));

/**
 * CÁC ROUTE CỦA ADMIN (Task 3.2 & 3.3)
 * Cần validateJwt để xác định người dùng và requireAdmin để kiểm tra quyền hạn
 */
router.post("/", validateJwt, requireAdmin, asyncHandler(createEventHandler));

router.put("/:id", validateJwt, requireAdmin, asyncHandler(updateEventHandler));

export default router;
