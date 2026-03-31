/**
 * Wrap async handler để không cần viết try/catch trong từng handler.
 * Mọi error sẽ tự động rơi vào global errorHandler qua next(err).
 * * Cách dùng:
 * import asyncHandler from "../middlewares/asyncHandler.js";
 * router.get("/", asyncHandler(async (req, res) => { ... }));
 */

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
