const mongoose = require("mongoose");

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
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Mỗi user chỉ đặt 1 vé cho 1 sự kiện
ticketSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Ticket", ticketSchema);
