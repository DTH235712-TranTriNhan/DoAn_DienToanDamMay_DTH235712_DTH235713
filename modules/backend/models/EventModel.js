const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, default: "Online" },
    totalTickets: { type: Number, required: true },
    availableTickets: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
