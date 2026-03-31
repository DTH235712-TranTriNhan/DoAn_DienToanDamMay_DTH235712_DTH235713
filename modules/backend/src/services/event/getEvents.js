const Event = require("../../libs/models/EventModel");

const getEvents = async (filters = {}) => {
  // Trong tương lai: filters có thể là { city, date, available: true }
  const events = await Event.find(filters);
  return events;
};

module.exports = { getEvents };
