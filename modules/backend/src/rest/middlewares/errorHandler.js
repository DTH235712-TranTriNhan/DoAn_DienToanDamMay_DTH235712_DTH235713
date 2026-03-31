/**
 * Middleware xử lý lỗi tập trung (Global Error Handler).
 * Phân loại lỗi: Operational (Nghiệp vụ) vs System (Hệ thống), [1].
 * Tuân thủ Modular Design: Một file chỉ chứa một hàm thực thi duy nhất, [2].
 */
const errorHandler = (err, req, res) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;
  let isOperational = err.isOperational || false;

  // 1. Xử lý lỗi từ Mongoose (Database Layer)
  // Lỗi validate dữ liệu (ví dụ: thiếu trường required) -> 400
  if (err.name === "ValidationError") {
    statusCode = 400;
    isOperational = true;
    // Lấy thông báo lỗi đầu tiên từ object errors của Mongoose
    message = Object.values(err.errors).map(el => el.message);
  }

  // Lỗi CastError (ví dụ: gửi eventId sai định dạng ObjectId) -> 400
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Giá trị không hợp lệ cho trường ${err.path}: ${err.value}`;
    isOperational = true;
  }

  // 2. Logging lỗi dựa trên môi trường và loại lỗi
  if (!isOperational) {
    // Lỗi hệ thống chưa được dự báo (ví dụ: mất kết nối DB đột ngột)
    // Sử dụng tiền tố [FATAL] để dễ dàng filter log trên Cloud (Render), [3].
    console.error(`\n[FATAL] 💥 Lỗi hệ thống: ${err.stack}\n`);
  } else {
    // Lỗi nghiệp vụ (hết vé, đặt trùng...) chỉ log cảnh báo nhẹ, [1].
    console.warn(`[WARN] ⚠️ Lỗi nghiệp vụ: ${message}`);
  }

  // 3. Phản hồi cho Client (luôn trả về JSON), [4].
  res.status(statusCode).json({
    success: false,
    message: isOperational ? message : "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau.",
    // Tuyệt đối không để lộ stack trace trong Production để đảm bảo bảo mật, [1].
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
      errorDetail: err
    })
  });
};

export default errorHandler;
