import asyncHandler from "../../middlewares/asyncHandler.js";
import topupBalance from "../../../services/payment/topupBalance.js";
import { AppError } from "../../../types/errors/AppError.js";

/**
 * Handler: Nạp tiền vào tài khoản (Top-up Simulator)
 * URL:  POST /api/users/topup
 * Auth: Bắt buộc (validateJwt)
 * Body: { amount: number }
 * Res:  { success: true, message: string, data: { balance: number } }
 */
const topupHandler = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  // JWT payload dùng { userId, email } — xem googleCallbackHandler.js
  const userId = req.user.userId;

  console.log(`[Top-up] 📥 Nhận yêu cầu nạp tiền: User=${userId}, Amount=${amount}`);

  // ── Validation ────────────────────────────────────────────────────
  if (amount === undefined || amount === null) {
    throw new AppError("Thiếu trường 'amount' trong request body", 400);
  }

  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new AppError("Số tiền nạp phải là số dương hợp lệ", 400);
  }

  // ── Gọi Service (ACID Transaction) ───────────────────────────────
  const { newBalance, transactionId } = await topupBalance(userId, parsedAmount);

  console.log(
    `[Top-up] ✅ Hoàn thành: User=${userId}, NewBalance=${newBalance}, TxID=${transactionId}`
  );

  // ── Trả về số dư mới cho Frontend ────────────────────────────────
  res.status(200).json({
    success: true,
    message: "Nạp tiền thành công",
    data: {
      balance: newBalance,
      transactionId: transactionId
    }
  });
});

export default topupHandler;
