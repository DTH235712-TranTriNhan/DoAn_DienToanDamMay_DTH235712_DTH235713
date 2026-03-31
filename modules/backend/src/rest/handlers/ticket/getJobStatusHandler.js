import { Queue } from "bullmq";
// CHÚ Ý: Đảm bảo file redis.js trong thư mục libs đã dùng export default
import redisClient from "../../../libs/redis.js";

// Khởi tạo Queue để truy vấn trạng thái Job
const ticketQueue = new Queue("ticketQueue", { connection: redisClient });

/**
 * Handler kiểm tra trạng thái của tiến trình đặt vé (Job)
 * Vì đặt vé là xử lý bất đồng bộ (Async), Frontend sẽ gọi API này liên tục (Polling)
 * để biết kết quả cuối cùng là Thành công hay Thất bại.
 */
export const getJobStatusHandler = async (req, res) => {
  const { jobId } = req.params;

  // Lấy thông tin Job từ Redis thông qua BullMQ
  const job = await ticketQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy phiên giao dịch (Job) này"
    });
  }

  // Lấy trạng thái hiện tại: 'active', 'waiting', 'completed', 'failed', 'delayed'
  const state = await job.getState();

  res.status(200).json({
    success: true,
    data: {
      jobId: job.id,
      state, // Trạng thái để Frontend hiển thị Loading hoặc Thông báo
      result: job.returnvalue || null, // Kết quả nếu thành công (thông tin vé)
      failedReason: job.failedReason || null // Lý do nếu thất bại (hết vé, lỗi hệ thống...)
    }
  });
};
