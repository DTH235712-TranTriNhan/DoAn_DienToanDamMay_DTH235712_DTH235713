const Ticket = require("../../../models/TicketModel");

const getMyTicketsHandler = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.userId })
    .populate("event", "title date location")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: tickets });
};

module.exports = { getMyTicketsHandler };
