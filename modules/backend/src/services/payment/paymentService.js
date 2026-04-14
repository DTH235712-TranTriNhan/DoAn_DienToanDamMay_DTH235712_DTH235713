import User from "../../models/UserModel.js";
import Transaction from "../../models/TransactionModel.js";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../types/constants/statuses.js";
import { InsufficientBalanceError } from "../../types/errors/AppError.js";

/**
 * Service xử lý trừ tiền người dùng (Payment)
 * @param {string} userId - ID của người dùng
 * @param {number} amount - Số tiền cần trừ
 * @param {string} ticketId - ID của vé liên quan
 * @param {object} session - MongoDB Session để đảm bảo Transaction
 */
export const deductBalance = async (userId, amount, ticketId, session) => {
  console.log(`[Payment] 💳 Đang xử lý trừ tiền cho User ${userId}: ${amount} VNĐ`);

  // 1. Tìm user và kiểm tra số dư
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  if (user.balance < amount) {
    console.warn(`[Payment] ❌ User ${userId} không đủ số dư. Hiện có: ${user.balance}, Cần: ${amount}`);
    throw new InsufficientBalanceError();
  }

  // 2. Trừ tiền user
  user.balance -= amount;
  await user.save({ session });

  // 3. Tạo bản ghi giao dịch (Transaction Record)
  const transaction = await Transaction.create(
    [
      {
        user: userId,
        ticket: ticketId,
        amount: amount,
        type: TRANSACTION_TYPE.PAYMENT,
        status: TRANSACTION_STATUS.SUCCESS
      }
    ],
    { session }
  );

  console.log(`[Payment] ✅ Đã trừ tiền thành công cho User ${userId}. Mã giao dịch: ${transaction[0]._id}`);

  return transaction[0];
};

/**
 * Service xử lý hoàn tiền người dùng (Refund)
 * @param {string} userId - ID của người dùng
 * @param {number} amount - Số tiền cần hoàn
 * @param {string} ticketId - ID của vé liên quan
 * @param {object} session - MongoDB Session
 */
export const refundBalance = async (userId, amount, ticketId, session) => {
  console.log(`[Payment] 💰 Đang xử lý hoàn tiền cho User ${userId}: ${amount} VNĐ`);

  // 1. Tìm user
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // 2. Hoàn tiền user
  user.balance += amount;
  await user.save({ session });

  // 3. Tạo bản ghi giao dịch (Refund Transaction Record)
  const transaction = await Transaction.create(
    [
      {
        user: userId,
        ticket: ticketId,
        amount: amount,
        type: TRANSACTION_TYPE.REFUND,
        status: TRANSACTION_STATUS.SUCCESS
      }
    ],
    { session }
  );

  console.log(`[Payment] ✅ Đã hoàn tiền thành công cho User ${userId}. Mã giao dịch: ${transaction[0]._id}`);

  return transaction[0];
};
