import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../services/api.js';

/**
 * useBookTicket — Hook xử lý đặt vé Flash Sale (Asynchronous Workflow)
 * Tuân thủ đặc tả UC-03 (Gửi yêu cầu) và UC-04 (Kiểm tra trạng thái)
 * 
 * Luồng hoạt động:
 * 1. Submit: POST /api/tickets kèm eventId. Nếu nhận 202, lấy jobId.
 * 2. Polling: GET /api/tickets/status/:jobId mỗi 2s để kiểm tra BullMQ state.
 * 3. Timeout: Tự động dừng sau 30s nếu không có kết quả cuối cùng.
 */
const useBookTicket = () => {
  // Trạng thái: idle -> submitting -> queued -> completed | failed
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Sử dụng useRef quản lý Timers để đảm bảo dọn dẹp (Cleanup) triệt để
  const pollingTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);

  // Hàm dọn dẹp các timers đang chạy
  const cleanup = useCallback(() => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    pollingTimerRef.current = null;
    timeoutTimerRef.current = null;
  }, []);

  // Cleanup Function khi Component Unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const bookTicket = useCallback(async (eventId) => {
    // Reset state về mặc định
    setStatus('submitting');
    setError(null);
    cleanup();

    try {
      /**
       * GIAI ĐOẠN 1 (UC-03): Gửi yêu cầu đặt vé vào hàng đợi
       * api.js đã có baseURL là /api, nên gọi /tickets => /api/tickets
       */
      const response = await api.post('/tickets', { eventId });

      // Nếu nhận 202 Accepted: Job đã vào hàng đợi của BullMQ
      if (response.status === 202) {
        const { jobId } = response.data.data; // Backend pattern: { success, message, data: { jobId } }
        setStatus('queued');

        // Bắt đầu Timeout 30 giây bảo vệ hệ thống
        timeoutTimerRef.current = setTimeout(() => {
          cleanup();
          setStatus('failed');
          setError('Vui lòng thử lại sau - Yêu cầu quá thời gian xử lý.');
        }, 30000);

        /**
         * GIAI ĐOẠN 2 (UC-04): Polling trạng thái mỗi 2 giây
         */
        pollingTimerRef.current = setInterval(async () => {
          try {
            const statusRes = await api.get(`/tickets/status/${jobId}`);
            const { state, failedReason } = statusRes.data.data;

            // Dừng polling khi có kết quả cuối cùng
            if (state === 'completed') {
              cleanup();
              setStatus('completed');
            } else if (state === 'failed') {
              cleanup();
              setStatus('failed');
              setError(failedReason || 'Hết vé hoặc giao dịch thất bại.');
            }
          } catch (pollErr) {
            // Lỗi kỹ thuật khi polling (mất mạng, server bảo trì...)
            cleanup();
            setStatus('failed');
            setError('Lỗi đồng bộ trạng thái vé.');
          }
        }, 2000);
      } else {
        // Xử lý các trường hợp thành công trực tiếp (nếu có)
        setStatus('completed');
      }
    } catch (err) {
      // Xử lý lỗi cụ thể theo yêu cầu (Giai đoạn 1)
      setStatus('failed');
      const statusCode = err.response?.status;

      if (statusCode === 401) {
        setError('Hãy đăng nhập để săn vé Flash Sale.');
      } else if (statusCode === 409) {
        setError('Bạn đã tham gia đặt vé cho sự kiện này rồi.');
      } else if (statusCode === 429) {
        setError('Hệ thống đang quá tải (Rate limit), vui lòng đợi thêm.');
      } else {
        setError(err.response?.data?.message || 'Lỗi kết nối máy chủ.');
      }
    }
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setStatus('idle');
    setError(null);
  }, [cleanup]);

  return { status, error, bookTicket, reset };
};

export default useBookTicket;
