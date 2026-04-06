import { Router } from "express";
import passport from "passport";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateJwt from "../middlewares/validateJwt.js";
import { getMeHandler } from "../handlers/auth/getMeHandler.js";
import { googleCallbackHandler } from "../handlers/auth/googleCallbackHandler.js";

const router = Router();

// Bước 1: Redirect user sang Google login page (Hỗ trợ tham số 'state' để quay lại đúng Port/Origin)
router.get("/google", (req, res, next) => {
  const { origin } = req.query; // Nhận URL nguồn từ Frontend (VD: localhost:5173)
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    state: origin || "" // Lưu URL nguồn vào OAuth state một cách an toàn
  })(req, res, next);
});

// Bước 2: Google redirect về, Passport xử lý, rồi gọi handler
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
        return res.redirect(`${frontendUrl || ""}/login?error=google_auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  asyncHandler(googleCallbackHandler)
);

// Lấy thông tin user hiện tại
router.get("/me", validateJwt, asyncHandler(getMeHandler));

export default router;
