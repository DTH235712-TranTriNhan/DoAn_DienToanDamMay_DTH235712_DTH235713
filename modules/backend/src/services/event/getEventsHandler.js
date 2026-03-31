const { getEvents } = require("../../services/event/getEvents");

const getEventsHandler = async (req, res) => {
  try {
    const events = await getEvents(); // Gọi service với plain data
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error("[Handler] getEvents error:", err);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

module.exports = { getEventsHandler };
