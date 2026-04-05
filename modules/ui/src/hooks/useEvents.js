import { useState, useEffect } from 'react';
import api from '../services/api';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Gọi GET /api/events
        const response = await api.get('/events');
        setEvents(response.data);
        setError(null);
      } catch (err) {
        // Xử lý lỗi an toàn
        setError(
          err.response?.data?.message || 'Lỗi kết nối. Không thể tải danh sách sự kiện!'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};