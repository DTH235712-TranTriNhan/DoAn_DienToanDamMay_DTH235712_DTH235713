import ticketQueue from "../../../queues/ticketQueue.js";

/**
 * Handler kiểm tra trạng thái của tiến trình đặt vé (Job)
 * Vì đặt vé là xử lý bất đồng bộ (Async), Frontend sẽ gọi API này liên tục (Polling)
 * để biết kết quả cuối cùng là Thành công hay Thất bại.
 */
export const getJobStatusHandler = async (req, res) => {
  const { jobId } = req.params;

  // Lấy thông tin Job từ Redis thông qua BullMQ
  const job = await ticketQueue.getJob(jobId);

  // Disable caching for polling endpoint
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

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
