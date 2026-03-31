// Nếu file handler nằm ở: src/rest/handlers/event/
// Và file service nằm ở: src/services/event/
// Thì đường dẫn đúng phải là:
import { getEvents } from "../../../services/event/getEvents.js";

export const getEventsHandler = async (req, res) => {
  const events = await getEvents();
  res.status(200).json({ success: true, data: events });
};
