import { useState, useCallback, useRef, useEffect } from "react";
import api from "../services/api";

/**
 * Custom Hook useBookTicket
 * Xử lý UC-03: Đặt vé Flash Sale (Asynchronous Booking)
 * Xử lý UC-04: Kiểm tra trạng thái đặt vé (Polling Job Status)
 */
export const useBookTicket = () => {
  const [status, setStatus] = useState("idle"); // idle, submitting, queued, completed, failed
  const [error, setError] = useState(null);
  
  // Sử dụng useRef để quản lý Timer tránh rò rỉ bộ nhớ (Memory Leak)
  const pollingRef = useRef(null);
  const timeoutRef = useRef(null);

  // Hàm dọn dẹp các Timer
  const clearTimers = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    pollingRef.current = null;
    timeoutRef.current = null;
  }, []);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  /**
   * Stage 2: Polling Job Status (UC-04)
   * Kiểm tra trạng thái của Job từ BullMQ mỗi 2 giây
   */
  const checkJobStatus = useCallback(async (jobId) => {
    try {
      const response = await api.get(`/tickets/status/${jobId}`);
      const { state, reason } = response.data;

      if (state === "completed") {
        clearTimers();
        setStatus("completed");
        setError(null);
      } else if (state === "failed") {
        clearTimers();
        setStatus("failed");
        setError(reason || "Đặt vé thất bại. Vui lòng thử lại sau.");
      }
      // Nếu still active/waiting thì tiếp tục polling ở interval tiếp theo
    } catch (err) {
      // Nếu lỗi 404 hoặc lỗi mạng khi polling, có thể coi như thất bại sau vài lần thử
      console.error("Polling error:", err);
    }
  }, [clearTimers]);

  /**
   * Stage 1: Submit Booking (UC-03)
   * Gửi yêu cầu đặt vé vào hàng đợi Redis thông qua BullMQ
   */
  const bookTicket = useCallback(async (eventId) => {
    // Reset trạng thái trước khi bắt đầu
    clearTimers();
    setStatus("submitting");
    setError(null);

    try {
      // Gửi POST /api/tickets kèm eventId
      const response = await api.post("/tickets", { eventId });

      // Nếu nhận 202 Accepted: Job đã được đưa vào hàng đợi thành công
      if (response.status === 202) {
        const { jobId } = response.data;
        setStatus("queued");

        // Thiết lập Timeout 30 giây: Nếu quá lâu không có kết quả thì dừng polling
        timeoutRef.current = setTimeout(() => {
          clearTimers();
          setStatus("failed");
          setError("Yêu cầu quá thời hạn (Timeout). Vui lòng thử lại sau.");
          console.warn("Booking Timeout after 30s");
        }, 30000);

        // Bắt đầu Polling mỗi 2 giây để kiểm tra kết quả xử lý của Worker
        pollingRef.current = setInterval(() => {
          checkJobStatus(jobId);
        }, 2000);
      }
    } catch (err) {
      setStatus("failed");
      const statusCode = err.response?.status;
      
      // Xử lý các mã lỗi đặc thù theo yêu cầu nghiệp vụ
      if (statusCode === 401) {
        setError("Vui lòng đăng nhập để thực hiện đặt vé.");
      } else if (statusCode === 409) {
        setError("Bạn đã đặt vé cho sự kiện này rồi (Idempotency).");
      } else if (statusCode === 429) {
        setError("Hệ thống đang bận do quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.");
      } else {
        setError(err.response?.data?.message || "Đã có lỗi xảy ra khi gửi yêu cầu.");
      }
      
      console.error("Booking submission error:", err);
    }
  }, [checkJobStatus, clearTimers]);

  return {
    bookTicket,
    status,
    error,
    isIdle: status === "idle",
    isSubmitting: status === "submitting",
    isQueued: status === "queued",
    isCompleted: status === "completed",
    isFailed: status === "failed",
    reset: () => {
      clearTimers();
      setStatus("idle");
      setError(null);
    }
  };
};

export default useBookTicket;
