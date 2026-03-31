const { bookTicket } = require("../services/ticket/bookTicket");

// Hàm processor — BullMQ worker sẽ gọi hàm này cho mỗi job
const ticketWorkerProcessor = async job => {
  const { userId, eventId } = job.data;

  console.log(`[Worker] Processing job ${job.id}: user=${userId} event=${eventId}`);

  const ticket = await bookTicket(userId, eventId);

  console.log(`[Worker] Job ${job.id} completed: ticket=${ticket._id}`);
  return { ticketId: ticket._id.toString() };
};

module.exports = ticketWorkerProcessor;
