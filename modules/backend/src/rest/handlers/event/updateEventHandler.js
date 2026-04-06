import { updateEvent } from "../../../services/event/updateEvent.js";

/**
 * Handler: Cập nhật sự kiện - Task 3.3
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
export const updateEventHandler = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Gọi Service để xử lý cập nhật MongoDB và sync Redis (nếu có)
  const updatedEvent = await updateEvent(id, updateData);

  res.status(200).json({
    success: true,
    message: "Cập nhật sự kiện thành công",
    data: updatedEvent
  });
};

export default updateEventHandler;
