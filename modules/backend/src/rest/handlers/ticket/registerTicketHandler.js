import { enqueueTicketJob } from "../../../services/ticket/enqueueTicketJob.js";

/**
 * Handler Đăng ký mua vé (Flash Sale)
 * * Luồng hoạt động:
 * 1. Nhận eventId từ body và userId từ Token (đã qua middleware validateJwt).
 * 2. Đẩy yêu cầu vào hàng đợi BullMQ (Redis) thông qua service enqueueTicketJob.
 * 3. Trả về ngay lập tức mã jobId để Frontend đi "thăm dò" (Polling) kết quả.
 */
export const registerTicketHandler = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.userId;

  // Đẩy vào hàng đợi để xử lý bất đồng bộ, tránh nghẽn Database
  const job = await enqueueTicketJob(userId, eventId);

  // Status 202: Đã nhận yêu cầu nhưng chưa xử lý xong (Chuẩn kiến trúc Async)
  res.status(202).json({
    success: true,
    message: "Yêu cầu đặt vé của bạn đã được đưa vào hàng đợi xử lý",
    data: {
      jobId: job.id
    }
  });
};
