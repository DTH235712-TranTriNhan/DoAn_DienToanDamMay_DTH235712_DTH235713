import { bookTicket } from "../services/ticket/bookTicket.js"; // Nhớ thêm đuôi .js

/**
 * Hàm processor — BullMQ worker sẽ gọi hàm này cho mỗi job.
 * Đây là nơi thực hiện logic nghiệp vụ nặng nhất: Lưu vào MongoDB.
 */
const ticketWorkerProcessor = async job => {
  const { userId, eventId } = job.data;

  console.log(`[Worker] ⚙️ Đang xử lý Job ${job.id}: User ${userId} đặt vé Event ${eventId}`);

  try {
    // Gọi service xử lý đặt vé
    const ticket = await bookTicket(userId, eventId);

    console.log(`[Worker] ✅ Job ${job.id} hoàn thành: Mã vé ${ticket._id}`);

    return { ticketId: ticket._id.toString() };
  } catch (error) {
    console.error(`[Worker] ❌ Job ${job.id} thất bại:`, error.message);
    throw error; // Quăng lỗi để BullMQ biết và có thể thử lại (retry) nếu cần
  }
};

export default ticketWorkerProcessor;
