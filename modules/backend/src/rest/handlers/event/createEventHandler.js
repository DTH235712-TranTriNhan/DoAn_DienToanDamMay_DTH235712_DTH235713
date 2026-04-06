import createEvent from "../../../services/event/createEvent.js";

/**
 * Handler: Tạo sự kiện mới - Task 3.3
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
const createEventHandler = async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    totalTickets,
    imageUrl,
    isHot
  } = req.body;

  // Gọi Service để lưu DB và sync Redis
  const newEvent = await createEvent({
    title,
    description,
    date,
    location,
    totalTickets,
    imageUrl,
    isHot
  });

  // Trả về mã 201 Created theo chuẩn REST API
  res.status(201).json({
    success: true,
    message: "Tạo sự kiện thành công và đã đồng bộ lên Redis",
    data: newEvent
  });
};

export default createEventHandler;
