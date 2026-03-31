const jwt = require("jsonwebtoken");

// Google OAuth callback — nhận user từ Passport, trả JWT về cho Frontend
const googleCallbackHandler = async (req, res) => {
  const token = jwt.sign({ userId: req.user._id, email: req.user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  // Redirect về Frontend kèm token (Frontend sẽ lưu vào localStorage)
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

module.exports = { googleCallbackHandler };
