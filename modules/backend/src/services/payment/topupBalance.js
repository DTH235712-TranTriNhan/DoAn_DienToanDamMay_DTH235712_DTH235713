import mongoose from "mongoose";
import User from "../../models/UserModel.js";
import Transaction from "../../models/TransactionModel.js";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../types/constants/statuses.js";
import { AppError } from "../../types/errors/AppError.js";

/**
 * Service xử lý nạp tiền vào tài khoản người dùng (Top-up).
 * Sử dụng MongoDB ACID Transaction (session) để đảm bảo Atomicity:
 * - Cộng tiền vào User.balance
 * - Tạo bản ghi Transaction type='topup'
 * Cả hai thao tác commit hoặc rollback cùng nhau.
 *
 * @param {string} userId - ID của người dùng muốn nạp tiền
 * @param {number} amount - Số tiền cần nạp (phải > 0, đơn vị VNĐ)
 * @returns {{ newBalance: number, transactionId: string }}
 */
const topupBalance = async (userId, amount) => {
  console.log(`[Top-up] ▶ Bắt đầu xử lý nạp tiền: User=${userId}, Amount=${amount} VNĐ`);

  // ── Bước 1: Mở MongoDB Session để bắt đầu ACID Transaction ────────
  const session = await mongoose.startSession();

  try {
    let newBalance;
    let transactionId;

    await session.withTransaction(async () => {
      // ── Bước 2: Tìm user trong cùng session ─────────────────────────
      const user = await User.findById(userId).session(session);

      if (!user) {
        console.warn(`[Top-up] ❌ Không tìm thấy User ${userId}`);
        throw new AppError("Người dùng không tồn tại", 404);
      }

      // ── Bước 3: Cộng tiền vào balance (atomic trong session) ─────────
      user.balance += amount;
      await user.save({ session });

      newBalance = user.balance;

      console.log(
        `[Top-up] 💳 Đã cộng ${amount} VNĐ cho User ${userId}. Số dư mới: ${newBalance} VNĐ`
      );

      // ── Bước 4: Tạo bản ghi Transaction lịch sử nạp tiền ───────────
      const [transaction] = await Transaction.create(
        [
          {
            user: userId,
            ticket: null, // top-up không liên kết với vé cụ thể
            amount: amount,
            type: TRANSACTION_TYPE.TOPUP,
            status: TRANSACTION_STATUS.SUCCESS
          }
        ],
        { session }
      );

      transactionId = transaction._id;

      console.log(
        `[Top-up] ✅ Tạo bản ghi Transaction thành công. ID: ${transactionId}`
      );
    });

    return { newBalance, transactionId };
  } catch (error) {
    console.error(`[Top-up] 🔥 Transaction rollback do lỗi: ${error.message}`);
    throw error;
  } finally {
    // ── Bước 5: Luôn đóng session dù thành công hay thất bại ─────────
    await session.endSession();
    console.log(`[Top-up] 🔒 Session đã đóng cho User ${userId}`);
  }
};

export default topupBalance;
