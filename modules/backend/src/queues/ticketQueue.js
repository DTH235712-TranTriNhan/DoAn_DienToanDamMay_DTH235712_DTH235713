import { Queue } from "bullmq";
import redisClient from "../libs/redis.js"; // Bắt buộc có đuôi .js
import { QUEUES } from "../types/constants/queues.js";

/**
 * Khởi tạo hàng đợi "ticketQueue".
 * Đây là nơi lưu trữ các yêu cầu đặt vé tạm thời trong Redis
 * trước khi Worker nhặt ra để xử lý vào MongoDB.
 */
const ticketQueue = new Queue(QUEUES.TICKET, {
  connection: redisClient
});

export default ticketQueue;
