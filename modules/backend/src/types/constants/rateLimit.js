/**
 * RATE_LIMIT — Cấu hình giới hạn tần suất truy cập API.
 * Giúp bảo vệ hệ thống trước việc tấn công tràn băng thông (DDoS) và Bot.
 */
export const RATE_LIMIT = {
  // Cấu hình chung cho toàn ứng dụng
  WINDOW_MS: 15 * 60 * 1000, // Khoảng thời gian: 15 phút
  MAX_REQUESTS: 1000, // Tổng số request tối đa được phép trong windowMs

  // Giới hạn đặc thù cho việc ĐẶT VÉ (Chống Bot săn vé)
  TICKET_MAX: 10 // Một user chỉ được đặt vé tối đa 10 lần trong 15p
};
