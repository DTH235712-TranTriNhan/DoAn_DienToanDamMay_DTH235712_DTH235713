const Event = require("../../models/EventModel");

const getEvents = async (filters = {}) => {
  const events = await Event.find(filters).sort({ date: 1 });
  return events;
};

module.exports = { getEvents };
