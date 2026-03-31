const { Router } = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { getEventsHandler } = require("../handlers/event/getEventsHandler");

const router = Router();

router.get("/", asyncHandler(getEventsHandler));

module.exports = router;
