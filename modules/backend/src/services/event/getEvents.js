import Event from "../../models/EventModel.js"; // Nhớ kiểm tra tên file Model có đúng EventModel.js không nhé

export const getEvents = async (filters = {}) => {
  // Tìm tất cả sự kiện và sắp xếp theo ngày gần nhất
  const events = await Event.find(filters).sort({ date: 1 });
  return events;
};
