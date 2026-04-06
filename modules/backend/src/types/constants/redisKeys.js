/**
 * REDIS_KEYS — Định nghĩa các Key dùng để lưu trữ và truy vấn trên Redis.
 * Giúp đồng bộ hóa dữ liệu giữa SQL và Cache một cách thống nhất.
 */
export const REDIS_KEYS = {
  // Key lưu trữ số lượng vé còn lại của một sự kiện
  EVENT_TICKETS: (eventId) => `event:${eventId}:tickets`,
  
  // Key lưu trữ danh sách các user đã mua vé thành công (để hiển thị My Tickets)
  USER_BOUGHT: (userId, eventId) => `user:${userId}:event:${eventId}:bought`,
  
  // Key dùng để kiểm tra tính Idempotency (chống trùng lặp request đặt vé)
  IDEMPOTENCY: (userId, eventId) => `idempotency:${userId}:${eventId}`
};
