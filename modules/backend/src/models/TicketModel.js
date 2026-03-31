import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Chuyển status về confirmed/cancelled cho chuyên nghiệp
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

/**
 * RẤT QUAN TRỌNG: Compound Index
 * Đảm bảo 1 user chỉ được đặt duy nhất 1 vé cho 1 sự kiện.
 * Nếu cố tình chèn cái thứ 2, MongoDB sẽ báo lỗi "Duplicate Key Error".
 */
ticketSchema.index({ event: 1, user: 1 }, { unique: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
