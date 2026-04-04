export const REDIS_KEYS = {
  EVENT_TICKETS: eventId => `event:${eventId}:tickets`,
  IDEMPOTENCY: (userId, eventId) => `idempotency:${userId}:${eventId}`
};
