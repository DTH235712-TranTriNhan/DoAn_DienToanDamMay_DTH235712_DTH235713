import Event from "../../models/EventModel.js";

/**
 * Service: Lấy danh sách sự kiện
 *
 * @param {Object} filters - Bộ lọc tìm kiếm
 * @returns {Promise<Array>} - Danh sách sự kiện
 */
const getEvents = async (filters = {}) => {
  // Tìm tất cả sự kiện và sắp xếp theo ngày gần nhất
  const events = await Event.find(filters).sort({ date: 1 }).lean();
  return events.map(e => ({
    ...e,
    soldTickets: e.totalTickets - e.availableTickets
  }));
};

export default getEvents;
