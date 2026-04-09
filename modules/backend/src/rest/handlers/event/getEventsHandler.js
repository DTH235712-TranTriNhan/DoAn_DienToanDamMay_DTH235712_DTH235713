import getEvents from "../../../services/event/getEvents.js";

/**
 * Handler: Lấy danh sách sự kiện
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getEventsHandler = async (req, res) => {
  const events = await getEvents();
  res.status(200).json({ success: true, data: events });
};

export default getEventsHandler;
