import express from "express";
import topupHandler from "../handlers/user/topupHandler.js";
import validateJwt from "../middlewares/validateJwt.js";

const router = express.Router();

/**
 * Route: POST /api/users/topup
 * Mô tả: Nạp tiền vào tài khoản (Simulator)
 */
router.post("/topup", validateJwt, topupHandler);

export default router;
