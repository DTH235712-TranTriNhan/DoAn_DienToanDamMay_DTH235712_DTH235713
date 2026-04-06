import jwt from "jsonwebtoken";

/**
 * Google OAuth callback — nhận user từ Passport, tạo JWT và trả về cho Frontend
 */
export const googleCallbackHandler = async (req, res) => {
  // Tạo mã Token JWT (thời hạn 7 ngày) để Frontend giữ làm "vé thông hành"
  const token = jwt.sign(
    { userId: req.user._id, email: req.user.email },
    process.env.JWT_SECRET, // Strictly use ENV secret
    { expiresIn: "7d" }
  );

  // 1. Xác định URL nguồn (Dynamic Redirect)
  // Ưu tiên dùng 'state' từ OAuth (chứa origin của Frontend)
  const oauthState = req.query.state;
  const isProd = process.env.NODE_ENV === "production";

  let frontendUrl = oauthState || (isProd
    ? process.env.FRONTEND_URL || "http://localhost:5000"
    : "http://localhost:5173");

  // Đảm bảo URL kết thúc không có dấu /
  if (frontendUrl.endsWith("/")) {
    frontendUrl = frontendUrl.slice(0, -1);
  }

  console.log(`[GoogleAuth] Đang điều hướng về: ${frontendUrl}/auth/callback (Môi trường: ${process.env.NODE_ENV})`);

  // Redirect về Frontend kèm theo token trong URL một cách an toàn
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};
