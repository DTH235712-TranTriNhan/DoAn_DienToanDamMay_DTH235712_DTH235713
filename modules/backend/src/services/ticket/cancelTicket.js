import mongoose from "mongoose";
import Ticket from "../../models/TicketModel.js";
import Event from "../../models/EventModel.js";
import Transaction from "../../models/TransactionModel.js";
import redisClient from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";
import { TICKET_STATUS, TRANSACTION_STATUS } from "../../types/constants/statuses.js";
import { refundBalance } from "../payment/paymentService.js";
import { CancellationNotAllowedError } from "../../types/errors/AppError.js";

/**
 * Service xử lý hủy vé kèm theo chính sách hoàn tiền.
 * Quy tắc:
 * 1. Trước 1h kể từ khi đặt: Hoàn 100%
 * 2. Sau 1 ngày kể từ khi đặt: Hoàn 50%
 * 3. Còn ít hơn 3 ngày tới buổi chiếu: KHÔNG cho hủy/hoàn tiền.
 */
export const cancelTicketService = async (ticketId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(`[Cancel-Ticket] ⚙️ Đang xử lý hủy vé ${ticketId}`);

    // 1. Tìm vé và nạp thông tin Event để check ngày
    const ticket = await Ticket.findOne({ _id: ticketId, user: userId })
      .populate("event")
      .session(session);

    if (!ticket) throw new Error("Không tìm thấy vé");
    if (ticket.status === TICKET_STATUS.CANCELLED) {
      throw new Error("Vé này đã được hủy trước đó");
    }

    const event = ticket.event;
    const now = new Date();

    // 🚀 BƯỚC 1: Kiểm tra quy tắc 3 ngày (Điều kiện tiên quyết)
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    if (event.date - now < threeDaysInMs) {
      console.warn(`[Cancel-Ticket] ❌ Không cho hủy: Sự kiện diễn ra vào ${event.date}. Chỉ còn ${Math.round((event.date - now) / (1000 * 60 * 60 * 24))} ngày.`);
      throw new CancellationNotAllowedError("Sự kiện sắp diễn ra (còn ít hơn 3 ngày), không thể hủy vé.");
    }

    // 🚀 BƯỚC 2: Tính toán tỷ lệ hoàn tiền
    const timeSinceBooking = now - ticket.createdAt;
    const oneHourInMs = 1 * 60 * 60 * 1000;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    let refundPercentage = 1.0; // Mặc định 100%
    let policyNote = "Hoàn tiền 100% (trong vòng 24h)";

    if (timeSinceBooking < oneHourInMs) {
      refundPercentage = 1.0;
      policyNote = "Hoàn tiền 100% (trong vòng 1h đầu)";
    } else if (timeSinceBooking > oneDayInMs) {
      refundPercentage = 0.5;
      policyNote = "Hoàn tiền 50% (sau 1 ngày kể từ khi đặt)";
    }

    // 🚀 BƯỚC 3: Cập nhật trạng thái vé ATOMIC (Chống double-refund)
    //findOneAndUpdate đảm bảo tính nguyên tử giúp tránh race condition khi nhiều request cancel cùng lúc
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId, user: userId, status: { $ne: TICKET_STATUS.CANCELLED } },
      { $set: { status: TICKET_STATUS.CANCELLED, cancelledAt: now } },
      { session, new: true }
    );

    if (!updatedTicket) {
      throw new Error("Phát hiện yêu cầu hủy trùng lặp hoặc vé không hợp lệ");
    }

    // 🚀 BƯỚC 4: Tìm giao dịch gốc để lấy số tiền đã thanh toán
    const originalPayment = await Transaction.findOne({
      ticket: ticketId,
      user: userId,
      status: TRANSACTION_STATUS.SUCCESS
    }).session(session);

    if (!originalPayment) {
      throw new Error("Không tìm thấy giao dịch thanh toán gốc để hoàn tiền");
    }

    const refundAmount = originalPayment.amount * refundPercentage;

    // 🚀 BƯỚC 5: Thực hiện hoàn tiền qua Payment Service
    if (refundAmount > 0) {
      await refundBalance(userId, refundAmount, ticketId, session);
    }

    // 🚀 BƯỚC 6: Cập nhật lại số lượng vé trong DB
    await Event.findByIdAndUpdate(
      event._id,
      { $inc: { availableTickets: 1 } },
      { session }
    );

    // ✅ COMMIT TRANSACTION
    await session.commitTransaction();
    console.log(`[Cancel-Ticket] ✅ Hủy vé thành công. Chính sách: ${policyNote}. Hoàn trả: ${refundAmount} VNĐ`);

    // 🔄 BƯỚC 7: Đồng bộ Redis (Gatekeeper) - Trả vé lại pool Flash Sale
    try {
      const redisEventKey = REDIS_KEYS.EVENT_TICKETS(event._id.toString());
      await redisClient.incr(redisEventKey);

      // Xóa Idempotency Key để user có thể săn lại vé nếu muốn
      const idempotencyKey = REDIS_KEYS.IDEMPOTENCY(userId, event._id.toString());
      await redisClient.del(idempotencyKey);
      
      console.log(`[Redis] 🔄 Đã tăng counter cho Event ${event._id} và xóa Idempotency key`);
    } catch (redisErr) {
      console.error("[Redis] ❌ Lỗi đồng bộ sau khi hủy vé:", redisErr.message);
    }

    return {
      success: true,
      message: `Hủy vé thành công. Bạn được hoàn lại ${new Intl.NumberFormat("vi-VN").format(refundAmount)} VNĐ (${policyNote}).`,
      refundAmount,
      policyNote
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
