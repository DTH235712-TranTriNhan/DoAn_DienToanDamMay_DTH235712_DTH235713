import { cancelTicketService } from "../../../services/ticket/cancelTicket.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

/**
 * Handler hủy vé
 * Route: PATCH /api/tickets/:ticketId/cancel
 */
export const cancelTicketHandler = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const userId = req.user.userId;

  const result = await cancelTicketService(ticketId, userId);
  
  return res.status(200).json({
    success: true,
    data: result.ticket,
    message: result.message
  });
});
