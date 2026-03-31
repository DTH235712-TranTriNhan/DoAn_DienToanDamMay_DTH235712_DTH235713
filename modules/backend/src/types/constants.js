module.exports = {
  // Ticket job statuses dùng trong BullMQ
  JOB_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed"
  },

  // Redis key prefixes — tập trung 1 chỗ để dễ quản lý
  REDIS_KEYS: {
    EVENT_TICKETS: eventId => `event:${eventId}:tickets`,
    IDEMPOTENCY: (userId, eventId) => `idempotency:${userId}:${eventId}`
  },

  // Rate limit
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 phút
    MAX_REQUESTS: 100, // 100 requests / window
    TICKET_MAX: 10 // 10 lần đặt vé / window (strict hơn)
  }
};
