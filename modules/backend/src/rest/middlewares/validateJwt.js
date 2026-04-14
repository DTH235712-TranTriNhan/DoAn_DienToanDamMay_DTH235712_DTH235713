import jwt from "jsonwebtoken";
import { AppError } from "../../types/errors/AppError.js";

/**
 * Middleware xác thực JWT từ header Authorization: Bearer <token>
 * Nếu hợp lệ: Gắn thông tin user vào req.user và cho đi tiếp (next)
 * Nếu không: Đẩy lỗi sang Global Error Handler (asyncHandler bắt được)
 */
const validateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Kiểm tra cấu trúc header (phải có Bearer)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Giải mã token bằng Secret Key trong .env
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const decoded = jwt.verify(token, secret);

    // 3. Gắn thông tin (userId, email) vào request để các Handler phía sau sử dụng
    // eslint-disable-next-line no-param-reassign
    req.user = decoded;

    return next();
  } catch (err) {
    // 4. Xử lý các trường hợp lỗi Token cụ thể
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", 401));
    }
    return next(new AppError("Phiên làm việc không hợp lệ", 401));
  }
};

export default validateJwt;
