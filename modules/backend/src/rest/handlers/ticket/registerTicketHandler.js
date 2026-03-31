const { enqueueTicketJob } = require("../../services/ticket/enqueueTicketJob");

const registerTicketHandler = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.userId;

  const job = await enqueueTicketJob(userId, eventId);

  res.status(202).json({
    success: true,
    message: "Yêu cầu đặt vé đang được xử lý",
    data: { jobId: job.id }
  });
};

module.exports = { registerTicketHandler };
