import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

/**
 * useEvents — Hook lấy danh sách sự kiện từ API
 * Trả về { events, loading, error, refetch }
 * Hàm refetch() cho phép reload dữ liệu không cần reload trang,
 * tiết kiệm Quota Upstash Redis.
 */
const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // GET /api/events
      const response = await api.get('/events');

      // Backend pattern: { success: true, data: [...] }
      const eventData = response.data.data || response.data || [];
      setEvents(Array.isArray(eventData) ? eventData : []);
    } catch (err) {
      console.error('[useEvents] API Error:', err);
      setError(
        err.response?.data?.message ||
          'CRITICAL_SYSTEM_ERROR: Unable to synchronize with the sequence grid.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
};

export default useEvents;