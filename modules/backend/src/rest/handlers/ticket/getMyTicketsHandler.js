import Ticket from "../../../models/TicketModel.js";

/**
 * Handler lấy danh sách vé mà người dùng hiện tại đã mua thành công
 */
export const getMyTicketsHandler = async (req, res) => {
  // Tìm các vé thuộc về userId này (userId lấy từ middleware validateJwt)
  const tickets = await Ticket.find({ user: req.user.userId })
    // "Kết nối" với bảng Event để lấy thêm Title, Date, Location của sự kiện đó
    .populate("event", "title date location")
    // Sắp xếp vé mới mua lên đầu (Descending)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: tickets
  });
};
