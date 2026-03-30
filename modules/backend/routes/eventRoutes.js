const express = require("express");
const router = express.Router();
const Event = require("../models/EventModel");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

module.exports = router;
