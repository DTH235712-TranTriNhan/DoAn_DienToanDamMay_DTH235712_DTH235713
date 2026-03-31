const { Queue } = require("bullmq");
const redisClient = require("../../libs/redis");
const { checkIdempotency } = require("./checkIdempotency");

const ticketQueue = new Queue("ticketQueue", { connection: redisClient });

const enqueueTicketJob = async (userId, eventId) => {
  // Bước 1: Kiểm tra idempotency (chặn đặt trùng)
  await checkIdempotency(userId, eventId);

  // Bước 2: Đẩy job vào queue — worker sẽ xử lý async
  const job = await ticketQueue.add(
    "book-ticket",
    { userId, eventId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: { age: 3600 }, // Xoá job thành công sau 1h
      removeOnFail: { age: 86400 } // Giữ job fail 24h để debug
    }
  );

  return job;
};

module.exports = { enqueueTicketJob };
