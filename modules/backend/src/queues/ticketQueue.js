const { Queue } = require("bullmq");
const redisClient = require("../libs/redis");

const ticketQueue = new Queue("ticketQueue", {
  connection: redisClient
});

module.exports = ticketQueue;
