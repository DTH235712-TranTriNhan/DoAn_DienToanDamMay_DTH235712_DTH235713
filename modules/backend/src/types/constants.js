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

// Redis key prefixes — Dùng để lưu cache và khóa dữ liệu trên Redis
export const REDIS_KEYS = {
  // Key lưu số lượng vé còn lại trong Redis để check cho nhanh
  EVENT_TICKETS: eventId => `event:${eventId}:tickets`,
  // Key chống trùng lặp: Đảm bảo 1 người dùng chỉ được nhấn mua 1 lần cho 1 sự kiện
  IDEMPOTENCY: (userId, eventId) => `idempotency:${userId}:${eventId}`
};

// Cấu hình Rate limit (Giới hạn băng thông)
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 phút
  MAX_REQUESTS: 100, // Tổng request tối đa
  TICKET_MAX: 10 // Số lần thử đặt vé tối đa (chống Bot)
};
