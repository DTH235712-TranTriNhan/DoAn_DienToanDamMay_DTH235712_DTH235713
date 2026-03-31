class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Phân biệt lỗi nghiệp vụ vs lỗi hệ thống
  }
}

// src/types/errors/OutOfTicketsError.js
class OutOfTicketsError extends AppError {
  constructor() {
    super("Sự kiện đã hết vé", 409);
  }
}

// src/types/errors/DuplicateRegistrationError.js
class DuplicateRegistrationError extends AppError {
  constructor() {
    super("Bạn đã đặt vé cho sự kiện này rồi", 409);
  }
}
