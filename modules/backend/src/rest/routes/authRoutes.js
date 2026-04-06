import { Router } from "express";
import passport from "passport";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateJwt from "../middlewares/validateJwt.js";
import { googleCallbackHandler } from "../handlers/auth/googleCallbackHandler.js";
import { getMeHandler } from "../handlers/auth/getMeHandler.js";

const router = Router();

// Bước 1: Redirect user sang Google login page
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Bước 2: Google redirect về, Passport xử lý, rồi gọi handler
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        const frontendUrl = process.env.FRONTEND_URL;
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

// Đổi từ module.exports thành export default
export default router;
