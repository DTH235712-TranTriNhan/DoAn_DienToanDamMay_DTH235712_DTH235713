import mongoose from "mongoose";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../types/constants/statuses.js";

const transactionSchema = new mongoose.Schema(
  {
    // nullable: null khi là giao dịch top-up (không gắn với vé cụ thể)
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    // Phân loại giao dịch: 'topup' | 'payment' | 'refund'
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      default: TRANSACTION_TYPE.PAYMENT
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING
    }
  },
  { timestamps: true }
);

// Xuất model theo chuẩn ES Modules
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
