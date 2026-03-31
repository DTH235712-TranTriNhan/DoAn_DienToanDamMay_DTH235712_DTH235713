const errorHandler = (err, req, res) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;
  let isOperational = err.isOperational || false;

  // Mongoose validation error → 400
  if (err.name === "ValidationError") {
    statusCode = 400;
    isOperational = true;
  }

  // Mongoose CastError (ObjectId sai format) → 400
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Giá trị không hợp lệ cho trường ${err.path}`;
    isOperational = true;
  }

  // Chỉ log chi tiết khi là lỗi hệ thống (không phải lỗi nghiệp vụ)
  if (!isOperational) {
    console.error("[FATAL]", err);
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? message : "Lỗi hệ thống",
    // Trả stack trace trong development để debug dễ hơn
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};

module.exports = errorHandler;
