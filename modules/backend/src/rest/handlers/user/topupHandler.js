import User from "../../../models/UserModel.js";
import { AppError } from "../../../types/errors/AppError.js";

/**
 * Handler mô phỏng nạp tiền (Top-up)
 * URL: POST /api/users/topup
 */
const topupHandler = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id; // Lấy từ authMiddleware

    if (!amount || amount <= 0) {
      throw new AppError("Số tiền nạp không hợp lệ", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    console.log(`[Payment] 💰 User ${userId} đã nạp thành công ${amount} VNĐ`);

    res.status(200).json({
      success: true,
      message: "Nạp tiền thành công",
      data: {
        balance: user.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

export default topupHandler;
