import { bookTicket } from "../services/ticket/bookTicket.js"; // Nhớ thêm đuôi .js
import { UnrecoverableError } from "bullmq";

/**
 * Hàm processor — BullMQ worker sẽ gọi hàm này cho mỗi job.
 * Đây là nơi thực hiện logic nghiệp vụ nặng nhất: Lưu vào MongoDB.
 */
const ticketWorkerProcessor = async job => {
  const { userId, eventId } = job.data;
  console.log(`[Worker] ⚙️ Đang xử lý Job ${job.id}: User ${userId} đặt vé Event ${eventId}`);

  try {
    const ticket = await bookTicket(userId, eventId);
    console.log(`[Worker] ✅ Job ${job.id} hoàn thành: Mã vé ${ticket._id}`);
    return { ticketId: ticket._id.toString() };
  } catch (error) {
    // Duplicate key = đã đặt rồi → KHÔNG retry
    if (error.code === 11000 || error.message?.includes("E11000")) {
      console.warn(`[Worker] ⚠️ Job ${job.id} — Vé đã tồn tại, bỏ qua retry`);
      throw new UnrecoverableError("Bạn đã đặt vé cho sự kiện này rồi");
    }

    // Không đủ tiền → KHÔNG retry
    if (error.statusCode === 402 || error.name === "InsufficientBalanceError") {
      console.warn(`[Worker] ⚠️ Job ${job.id} — Số dư không đủ, bỏ qua retry`);
      throw new UnrecoverableError("Số dư không đủ. Vui lòng nạp thêm tiền.");
    }
    console.error(`[Worker] ❌ Job ${job.id} thất bại:`, error.message);
    throw error;
  }
};
export default ticketWorkerProcessor;
