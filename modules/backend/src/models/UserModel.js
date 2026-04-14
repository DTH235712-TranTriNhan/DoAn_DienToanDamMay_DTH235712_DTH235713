import mongoose from "mongoose";
import { USER_ROLES, USER_ROLE_VALUES } from "../types/constants/userRoles.js";

const userSchema = new mongoose.Schema(
  {
    // Lưu ID từ Google để nhận diện người dùng khi họ login qua OAuth 2.0
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    avatar: { type: String },
    balance: { type: Number, default: 5000000 },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.USER
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
