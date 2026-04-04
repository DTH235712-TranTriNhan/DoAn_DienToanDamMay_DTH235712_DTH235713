/**
 * TẬP TRUNG TẤT CẢ BIẾN HẰNG SỐ CỦA HỆ THỐNG
 * Giúp dễ dàng quản lý và thay đổi cấu hình tại một nơi duy nhất.
 */

// Ticket job statuses dùng trong BullMQ (Hàng đợi xử lý vé)
export const JOB_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed"
};



// Cấu hình Rate limit (Giới hạn băng thông)
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 phút
  MAX_REQUESTS: 100, // Tổng request tối đa
  TICKET_MAX: 10 // Số lần thử đặt vé tối đa (chống Bot)
};
