import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

/**
 * Custom Hook useBookTicket
 * Xử lý UC-03: Đặt vé Flash Sale (Asynchronous Booking)
 * Xử lý UC-04: Kiểm tra trạng thái đặt vé (Polling Job Status)
 */
export const useBookTicket = () => {
  const [status, setStatus] = useState("idle"); // idle, submitting, queued, completed, failed
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
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
   * Sử dụng đệ quy setTimeout thay cho setInterval để tránh overlap requests
   */
  const checkJobStatus = useCallback(async (jobId) => {
    try {
      console.log(`[Polling] Đang kiểm tra trạng thái cho jobId: ${jobId}`);
      const response = await api.get(`/tickets/status/${jobId}`);
      console.log("[Polling] Dữ liệu phản hồi:", response.data);

      // Bóc tách state và failedReason từ response.data.data theo chuẩn Envelope JSON
      const { state, failedReason: reason } = response.data.data || {};
      console.log(`[Polling] Trạng thái Job: ${state}`);

      if (state === "completed") {
        clearTimers();
        setStatus("completed");
        setError(null);
        console.log("[Polling] Đặt vé thành công!");
      } else if (state === "failed") {
        clearTimers();
        setStatus("failed");
        setError(reason || "Đặt vé thất bại. Vui lòng thử lại sau.");
        console.log(`[Polling] Đặt vé thất bại: ${reason}`);
      } else {
        // Nếu still active/waiting thì tiếp tục polling sau 2 giây
        pollingRef.current = setTimeout(() => checkJobStatus(jobId), 5000);
      }
    } catch (err) {
      console.error("Polling error:", err);
      const statusCode = err.response?.status;
      
      if (statusCode === 401) {
        clearTimers();
        setStatus("failed");
        setError("Vui lòng đăng nhập để thực hiện đặt vé.");
        navigate("/login");
      } else if (statusCode === 404) {
        // Job có thể đã hết hạn hoặc bị xóa trên Redis
        clearTimers();
        setStatus("failed");
        setError("Không tìm thấy thông tin đặt vé.");
      } else {
        // Đối với các lỗi mạng khác, vẫn thử lại polling ở chu kỳ sau
        pollingRef.current = setTimeout(() => checkJobStatus(jobId), 5000);
      }
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
      console.log(`[Booking] Đang gửi yêu cầu đặt vé cho eventId: ${eventId}`);
      const response = await api.post("/tickets", { eventId });
      console.log("[Booking] Dữ liệu phản hồi:", response.data);

      // Nếu nhận 202 Accepted: Job đã được đưa vào hàng đợi thành công
      if (response.status === 202) {
        // Bóc tách jobId từ response.data.data (Envelope JSON)
        const { jobId } = response.data.data || {};
        console.log("[Booking] Đã nhận jobId:", jobId);
        
        if (!jobId) {
          throw new Error("Không nhận được jobId từ server");
        }

        setStatus("queued");

        // Thiết lập Timeout 30 giây: Nếu quá lâu không có kết quả thì dừng polling
        timeoutRef.current = setTimeout(() => {
          clearTimers();
          setStatus("failed");
          setError("Hệ thống bận"); // Chuẩn hóa message theo yêu cầu
          console.warn("[Booking] Quá thời gian chờ (30s)");
        }, 30000);

        // Bắt đầu Polling sau 5 giây
        pollingRef.current = setTimeout(() => checkJobStatus(jobId), 5000);
      }
    } catch (err) {
      setStatus("failed");
      const statusCode = err.response?.status;
      
      // Xử lý các mã lỗi đặc thù theo yêu cầu nghiệp vụ
      if (statusCode === 401) {
        setError("Vui lòng đăng nhập để thực hiện đặt vé.");
        navigate("/login");
      } else if (statusCode === 409) {
        setError("Bạn đã đặt vé rồi"); // Chuẩn hóa message
      } else if (statusCode === 429) {
        setError("Vượt Rate limit (Yêu cầu user chờ)"); // Chuẩn hóa message
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
    reset: useCallback(() => {
      clearTimers();
      setStatus("idle");
      setError(null);
    }, [clearTimers])
  };
};

export default useBookTicket;
