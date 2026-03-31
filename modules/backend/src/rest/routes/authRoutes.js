const { Router } = require("express");
const passport = require("passport");
const asyncHandler = require("../middlewares/asyncHandler");
const { googleCallbackHandler } = require("../handlers/auth/googleCallbackHandler");

const router = Router();

// Bước 1: Redirect user sang Google login page
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Bước 2: Google redirect về, Passport xử lý, rồi gọi handler
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  asyncHandler(googleCallbackHandler)
);

module.exports = router;
