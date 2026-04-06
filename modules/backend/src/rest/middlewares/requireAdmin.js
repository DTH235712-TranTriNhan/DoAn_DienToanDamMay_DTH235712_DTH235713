import { AppError } from "../../types/errors/AppError.js";
import UserModel from "../../models/UserModel.js";

/**
 * Middleware requireAdmin - Task 3.2
 * Kiểm tra xem người dùng hiện tại có phải là Admin hay không.
 * Yêu cầu: Middleware này được chạy SAU validateJwt (req.user đã tồn tại).
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export const requireAdmin = async (req, res, next) => {
  // 1. Context logging để dễ dàng theo dõi trên Render Dashboard (chỉ dev)
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Auth] Checking admin permission for userId: ${req.user?.userId || "unknown"}`);
  }

  try {
    // 2. Trích xuất userId từ req.user (được gán bởi validateJwt)
    const { userId } = req.user;

    if (!userId) {
      throw new AppError("Phiên đăng nhập không hợp lệ, không tìm thấy userId", 401);
    }

    // 3. Query trực tiếp MongoDB để lấy thông tin role mới nhất.
    // KHÔNG tin vào role trong JWT để đảm bảo an toàn nếu role bị thay đổi trên Cloud.
    const user = await UserModel.findById(userId).select("role").lean();

    // 4. Kiểm tra user.role.
    if (!user || user.role !== "admin") {
      // Ném lỗi 403 Forbidden theo yêu cầu
      throw new AppError("Bạn không có quyền truy cập", 403);
    }

    // 5. Nếu là admin, gọi next() để đi tiếp
    return next();
  } catch (error) {
    // Chuyển tiếp lỗi sang Global Error Handler (asyncHandler hoặc middleware bắt lỗi)
    return next(error);
  }
};

export default requireAdmin;
