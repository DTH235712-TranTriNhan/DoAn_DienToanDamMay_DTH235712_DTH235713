import mongoose from "mongoose";
import Ticket from "../../models/TicketModel.js";
import Event from "../../models/EventModel.js";
import redisClient from "../../libs/redis.js";
import { REDIS_KEYS } from "../../types/constants/redisKeys.js";
import { TICKET_STATUS } from "../../types/constants/statuses.js";

/**
 * Service xử lý hủy vé.
 * Đảm bảo tính nhất quán dữ liệu bằng Mongoose Transaction và Redis.
 */
export const cancelTicketService = async (ticketId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(`[Cancel-Ticket-Fix] ⚙️ Bắt đầu hủy vé ${ticketId} cho user ${userId}`);

    // Bước 1: Tìm vé xem có thuộc về user và không ở trạng thái cancelled không
    const ticket = await Ticket.findOne({
      _id: ticketId,
      user: userId,
      status: { $ne: TICKET_STATUS.CANCELLED }
    }).session(session);

    if (!ticket) {
      throw new Error("Không tìm thấy vé hoặc vé đã bị hủy.");
    }

    const eventId = ticket.event.toString();

    // Bước 2: Đổi trạng thái vé
    ticket.status = TICKET_STATUS.CANCELLED;
    await ticket.save({ session });

    // Bước 3: Hoàn trả lại vé cho sự kiện ($inc: 1)
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { availableTickets: 1 } },
      { returnDocument: "after", session }
    );

    if (!event) {
      throw new Error("Không tìm thấy sự kiện liên kết với vé.");
    }

    // Cam kết Transaction
    await session.commitTransaction();
    console.log(
      `[Cancel-Ticket-Fix] ✅ MongoDB Transaction thành công. Đã hoàn vé cho sự kiện ${eventId}`
    );

    // Bước 4 (Post-commit): Cập nhật Redis
    try {
      // Hoàn lại vé trên Redis
      const redisEventKey = REDIS_KEYS.EVENT_TICKETS(eventId);
      await redisClient.incr(redisEventKey);

      // Xóa Idempotency Key để người dùng có thể đặt lại chính sự kiện này
      const idempotencyKey = REDIS_KEYS.IDEMPOTENCY(userId, eventId);
      await redisClient.del(idempotencyKey);

      console.log(
        `[Cancel-Ticket-Fix] ✅ Cập nhật Redis thành công: INCR ${redisEventKey}, DEL ${idempotencyKey}`
      );
    } catch (redisError) {
      // Lỗi Redis sau khi DB đã commit không làm rớt DB, nhưng cần log lại để theo dõi
      console.error(`[Cancel-Ticket-Fix] ⚠️ Lỗi đồng bộ Redis sau khi commit DB:`, redisError);
    }

    return {
      success: true,
      message: "Hủy vé thành công.",
      ticket
    };
  } catch (error) {
    // Nếu có bất kì lỗi gì, Rollback lại dữ liệu cũ
    await session.abortTransaction();
    console.error(`[Cancel-Ticket-Fix] ❌ Lỗi xử lý giao dịch hủy vé:`, error);
    throw error;
  } finally {
    session.endSession();
  }
};
