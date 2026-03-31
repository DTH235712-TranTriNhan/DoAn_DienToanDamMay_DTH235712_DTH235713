// Wrap async handler để không cần try/catch trong từng handler
// Mọi error sẽ tự động rơi vào global errorHandler qua next(err)
//
// Cách dùng:
//   const asyncHandler = require("../middlewares/asyncHandler");
//   router.get("/", asyncHandler(async (req, res) => { ... }));

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
