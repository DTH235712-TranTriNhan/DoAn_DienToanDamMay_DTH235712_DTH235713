import { createEvent } from "../../../services/event/createEvent.js";

/**
 * Handler: Tạo sự kiện mới - Task 3.3
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
export const createEventHandler = async (req, res) => {
  const eventData = req.body;

  // Gọi Service để lưu DB và sync Redis
  const newEvent = await createEvent(eventData);

  // Trả về mã 201 Created theo chuẩn REST API
  res.status(201).json({
    success: true,
    message: "Tạo sự kiện thành công và đã đồng bộ lên Redis",
    data: newEvent
  });
};

export default createEventHandler;
