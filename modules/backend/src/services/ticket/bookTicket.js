const redisClient = require("../../libs/redis");
const Event = require("../../models/EventModel");
const Ticket = require("../../models/TicketModel");
const { REDIS_KEYS } = require("../../types/constants");
const { OutOfTicketsError } = require("../../types/errors/AppError");

// Logic đặt vé — được gọi bởi worker, không gọi trực tiếp từ handler
const bookTicket = async (userId, eventId) => {
  const key = REDIS_KEYS.EVENT_TICKETS(eventId);

  // Bước 1: DECR atomic trên Redis — nếu < 0 thì hết vé
  const remaining = await redisClient.decr(key);

  if (remaining < 0) {
    // Hoàn lại slot vì đã trừ quá
    await redisClient.incr(key);
    throw new OutOfTicketsError();
  }

  // Bước 2: Ghi ticket vào MongoDB
  const ticket = await Ticket.create({
    event: eventId,
    user: userId,
    status: "confirmed"
  });

  // Bước 3: Sync lại availableTickets trong MongoDB (eventual consistency)
  await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -1 } });

  return ticket;
};

module.exports = { bookTicket };
