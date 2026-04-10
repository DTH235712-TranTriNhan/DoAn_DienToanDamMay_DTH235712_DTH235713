import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../services/api.js';

/**
 * useTicketDetails - Hook để lấy thông tin chi tiết một vé cụ thể.
 * Tận dụng API /tickets/my để lấy danh sách và lọc ra vé tương ứng.
 */
const useTicketDetails = (ticketId, eventId = null) => {
  const [ticket, setTicket] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!ticketId && !eventId) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setLoading(true);
    setError(null);
    try {
      if (ticketId) {
        console.log(`[UI] Fetching details for ticket: ${ticketId}`);
        const response = await api.get('/tickets/my');
        const tickets = response.data.data || response.data || [];
        const foundTicket = tickets.find(t => t._id === ticketId);
        
        if (foundTicket) {
          setTicket(foundTicket);
          setEventData(foundTicket.event);
        } else {
          setError('Không tìm thấy thông tin vé này.');
        }
      } else if (eventId) {
        console.log(`[UI] Fetching details for event: ${eventId}`);
        const response = await api.get('/events');
        const events = response.data.data || response.data || [];
        const foundEvent = events.find(e => e._id === eventId);
        
        if (foundEvent) {
          setEventData(foundEvent);
        } else {
          setError('Không tìm thấy thông tin sự kiện.');
        }
      }
    } catch (err) {
      console.error('[UI] Fetch data error:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối khi tải dữ liệu.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [ticketId, eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ticket, event: eventData, loading, error, refresh: fetchData };
};

export default useTicketDetails;
