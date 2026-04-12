import deleteEvent from "../../../services/event/deleteEvent.js";

/**
 * Handler: Xóa sự kiện
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
const deleteEventHandler = async (req, res) => {
  const { id } = req.params;

  // Gọi Service để xóa MongoDB và sync Redis
  await deleteEvent(id);

  res.status(200).json({
    success: true,
    message: "Xóa sự kiện thành công"
  });
};

export default deleteEventHandler;
