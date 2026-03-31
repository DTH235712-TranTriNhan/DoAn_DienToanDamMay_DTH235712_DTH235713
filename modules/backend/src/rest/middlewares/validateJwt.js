const jwt = require("jsonwebtoken");
const { AppError } = require("../../types/errors/AppError");

// Middleware xác thực JWT từ header Authorization: Bearer <token>
const validateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line no-param-reassign -- Express convention: attach user to req
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Phiên đăng nhập đã hết hạn", 401));
    }
    return next(new AppError("Token không hợp lệ", 401));
  }
};

module.exports = validateJwt;
