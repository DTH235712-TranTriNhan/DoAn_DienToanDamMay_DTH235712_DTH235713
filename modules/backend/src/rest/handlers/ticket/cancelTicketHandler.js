import { cancelTicketService } from "../../../services/ticket/cancelTicket.js";

/**
 * Handler hủy vé
 * Route: PATCH /api/tickets/:ticketId/cancel
 */
export const cancelTicketHandler = async (req, res) => {
  const { ticketId } = req.params;
  const userId = req.user.userId;

  try {
    const result = await cancelTicketService(ticketId, userId);
    
    return res.status(200).json({
      success: true,
      data: result.ticket,
      message: result.message
    });
  } catch (error) {
    if (error.message === "Không tìm thấy vé hoặc vé đã bị hủy.") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi hủy vé. Vui lòng thử lại sau."
    });
  }
};
