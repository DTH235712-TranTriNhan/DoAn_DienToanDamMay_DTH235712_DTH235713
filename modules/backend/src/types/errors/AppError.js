// Tất cả lỗi nghiệp vụ đều kế thừa từ AppError với isOperational = true [1]
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Đánh dấu đây là lỗi đã được dự báo [1]

    Error.captureStackTrace(this, this.constructor);
  }
}

// ── 404 — Không tìm thấy ──────────────────────────────────────────
export class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy tài nguyên") {
    super(message, 404);
  }
}

// ── 409 — Hết vé (Dùng cho luồng Flash Sale) ──────────────────────
// Khi Redis DECR < 0, Worker sẽ ném lỗi này [2, 3]
export class OutOfTicketsError extends AppError {
  constructor(message = "Sự kiện đã hết vé") {
    super(message, 409);
  }
}

// ── 409 — Đặt trùng (Chống spam/Idempotency) ───────────────────────
// Khi kiểm tra Redis SET NX thấy key đã tồn tại [2, 4]
export class DuplicateRegistrationError extends AppError {
  constructor(message = "Bạn đã đặt vé cho sự kiện này rồi") {
    super(message, 409);
  }
}

// ── 402 — Không đủ tiền (Payment Error) ──────────────────────────
export class InsufficientBalanceError extends AppError {
  constructor(message = "Số dư không đủ để thực hiện giao dịch") {
    super(message, 402);
  }
}

// ── 403 — Không được phép hủy (Policy Error) ─────────────────────
export class CancellationNotAllowedError extends AppError {
  constructor(message = "Không được phép hủy vé tại thời điểm này") {
    super(message, 403);
  }
}
