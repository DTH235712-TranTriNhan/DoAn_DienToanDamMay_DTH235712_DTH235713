import { useState, useEffect } from 'react';
import api from '../services/api';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Gọi GET /api/events
        const response = await api.get('/events');
        // Vì Backend trả về { success: true, data: [...] }
        const eventData = response.data.data || response.data || [];
        setEvents(Array.isArray(eventData) ? eventData : []);
        setError(null);
      } catch (err) {
        // Bắt lỗi từ server hoặc lỗi mạng
        setError(
          err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách sự kiện. Vui lòng thử lại sau.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export default useEvents;