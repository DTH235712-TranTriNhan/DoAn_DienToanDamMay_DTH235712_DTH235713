const { getEvents } = require("../../../services/event/getEvents");

const getEventsHandler = async (req, res) => {
  const events = await getEvents();
  res.status(200).json({ success: true, data: events });
};

module.exports = { getEventsHandler };
