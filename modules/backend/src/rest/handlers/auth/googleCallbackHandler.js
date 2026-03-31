import jwt from "jsonwebtoken";

/**
 * Google OAuth callback — nhận user từ Passport, tạo JWT và trả về cho Frontend
 */
export const googleCallbackHandler = async (req, res) => {
  // Tạo mã Token JWT (thời hạn 7 ngày) để Frontend giữ làm "vé thông hành"
  const token = jwt.sign(
    { userId: req.user._id, email: req.user.email },
    process.env.JWT_SECRET || "bi_mat_quan_su_123", // Fallback secret nếu chưa có .env
    { expiresIn: "7d" }
  );

  // Redirect về Frontend kèm theo token trong URL
  // Frontend (Nhật làm) sẽ bắt cái token này từ URL để lưu vào localStorage
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};
