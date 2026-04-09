import { useState, useCallback, useEffect } from 'react';
import api from '../services/api.js';

const useMyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    console.log('[UI] Fetching my tickets...');
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tickets/my');
      console.log('[UI] Fetch my tickets success');
      const ticketData = response.data.data || response.data || [];
      setTickets(Array.isArray(ticketData) ? ticketData : []);
    } catch (err) {
      console.error('[UI] Fetch my tickets error:', err);
      setError(
        err.response?.data?.message ||
          'Không thể tải danh sách vé. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelTicket = useCallback(async (ticketId) => {
    console.log(`[UI] Requesting ticket cancellation for ID: ${ticketId}`);
    
    // Optimistic UI update
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: 'cancelled' } : ticket
      )
    );

    try {
      // Giả thiết backend dùng DELETE route (hoặc PATCH tùy thiết kế schema)
      await api.delete(`/tickets/${ticketId}`);
      console.log(`[UI] Successfully cancelled ticket ${ticketId}`);
    } catch (err) {
      console.error(`[UI] Error cancelling ticket ${ticketId}:`, err);
      // Nếu lỗi, chạy lại dữ liệu gốc từ máy chủ để đồng bộ lại
      fetchTickets();
      throw err; 
    }
  }, [fetchTickets]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refresh: fetchTickets, cancelTicket };
};

export default useMyTickets;
