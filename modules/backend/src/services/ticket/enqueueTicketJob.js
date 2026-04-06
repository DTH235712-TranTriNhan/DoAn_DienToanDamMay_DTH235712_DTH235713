import ticketQueue from "../../queues/ticketQueue.js";
import { checkIdempotency } from "./checkIdempotency.js";

/**
 * Service đẩy yêu cầu đặt vé vào hàng đợi xử lý
 * @param {string} userId - ID người dùng đặt vé
 * @param {string} eventId - ID sự kiện muốn đặt
 */
export const enqueueTicketJob = async (userId, eventId) => {
  // Bước 1: Kiểm tra tính Idempotency (Chống nhấn nút mua nhiều lần)
  // Nếu đã nhấn mua rồi, hàm này sẽ ném ra lỗi AppError để Handler bắt
  await checkIdempotency(userId, eventId);

  // Bước 2: Đẩy job vào queue — Worker bên dưới sẽ xử lý thực tế
  const job = await ticketQueue.add(
    "book-ticket",
    { userId, eventId },
    {
      attempts: 3, // Nếu Worker lỗi (VD: DB bận), thử lại tối đa 3 lần
      backoff: {
        type: "exponential",
        delay: 1000 // Lần 1 đợi 1s, lần 2 đợi 2s, lần 3 đợi 4s...
      },
      removeOnComplete: { age: 3600 }, // Xoá job thành công sau 1h để nhẹ Redis
      removeOnFail: { age: 86400 } // Giữ job lỗi 24h để Admin vào check/debug
    }
  );

  return job;
};
