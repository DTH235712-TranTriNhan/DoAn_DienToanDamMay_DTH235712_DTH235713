/**
 * JOB_STATUS — Trạng thái của công việc trong hàng đợi xử lý vé.
 * Giúp Frontend biết được vé đang được xử lý, thành công hay thất bại.
 */
export const JOB_STATUS = {
  PENDING: "pending",     // Đang chờ trong hàng đợi
  COMPLETED: "completed", // Xử lý thành công
  FAILED: "failed"        // Xử lý thất bại (VD: Hết vé)
};
