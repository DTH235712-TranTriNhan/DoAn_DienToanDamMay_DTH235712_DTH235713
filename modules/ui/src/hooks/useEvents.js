import { useState, useEffect } from 'react';
import api from '../services/api.js';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // GET /api/events
        const response = await api.get('/events');
        
        // Backend pattern: { success: true, data: [...] }
        const eventData = response.data.data || response.data || [];
        setEvents(Array.isArray(eventData) ? eventData : []);
        setError(null);
      } catch (err) {
        console.error('[useEvents] API Error:', err);
        setError(
          err.response?.data?.message || 'CRITICAL_SYSTEM_ERROR: Unable to synchronize with the sequence grid.'
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