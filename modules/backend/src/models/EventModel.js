import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, default: "Online" },
    totalTickets: { type: Number, required: true },
    // Số vé còn lại - Rất quan trọng cho logic Flash Sale
    availableTickets: { type: Number, required: true },
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400/090014/FF00FF?text=Event+Image"
    },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Dùng export default để các file Service có thể import dễ dàng
const Event = mongoose.model("Event", eventSchema);
export default Event;
