const { Router } = require("express");
const { getEventsHandler } = require("../../handlers/event/getEventsHandler");

const router = Router();
router.get("/", getEventsHandler);

module.exports = router;
