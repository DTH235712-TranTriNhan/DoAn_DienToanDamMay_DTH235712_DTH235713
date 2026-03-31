import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Lưu ID từ Google để nhận diện người dùng khi họ login qua OAuth 2.0
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    avatar: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
