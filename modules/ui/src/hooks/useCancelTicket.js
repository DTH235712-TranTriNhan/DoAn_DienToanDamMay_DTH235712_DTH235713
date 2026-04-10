import { useState, useCallback } from "react";
import api from "../services/api.js";

/**
 * Custom Hook useCancelTicket
 * Quản lý việc gọi API hủy vé và dispatch sự kiện để đồng bộ UI
 */
export const useCancelTicket = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);

  const cancelTicket = useCallback(async (ticketId) => {
    setIsCancelling(true);
    setError(null);
    try {
      console.log(`[Cancel-Ticket-Fix] Đang gọi API hủy vé ID: ${ticketId}`);
      const response = await api.patch(`/tickets/${ticketId}/cancel`);
      
      console.log(`[Cancel-Ticket-Fix] Hủy vé thành công, bắn Event TICKET_DATA_UPDATED`);
      // Bắn sự kiện Global để MyTicketsPage hoặc bất kỳ component nào cũng tự động cập nhật mà không cần truyền props/callbacks
      const APP_EVENTS = { TICKET_DATA_UPDATED: "APP_EVENTS.TICKET_DATA_UPDATED" };
      window.dispatchEvent(new CustomEvent(APP_EVENTS.TICKET_DATA_UPDATED));
      
      return response.data;
    } catch (err) {
      console.error(`[Cancel-Ticket-Fix] Lỗi khi hủy vé:`, err);
      const errorMessage =
        err.response?.data?.message || "Không thể hủy vé, vui lòng thử lại sau.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  }, []);

  return { cancelTicket, isCancelling, error };
};

export default useCancelTicket;
