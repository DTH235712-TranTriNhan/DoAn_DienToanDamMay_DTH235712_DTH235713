// ── Base Error ───────────────────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// ── 404 ──────────────────────────────────────────────────────────
class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy tài nguyên") {
    super(message, 404);
  }
}

// ── 409 — Hết vé ────────────────────────────────────────────────
class OutOfTicketsError extends AppError {
  constructor() {
    super("Sự kiện đã hết vé", 409);
  }
}

// ── 409 — Đặt trùng ─────────────────────────────────────────────
class DuplicateRegistrationError extends AppError {
  constructor() {
    super("Bạn đã đặt vé cho sự kiện này rồi", 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  OutOfTicketsError,
  DuplicateRegistrationError
};
