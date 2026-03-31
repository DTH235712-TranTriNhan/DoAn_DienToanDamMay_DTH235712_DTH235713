const { Queue } = require("bullmq");
const redisClient = require("../../../libs/redis");

const ticketQueue = new Queue("ticketQueue", { connection: redisClient });

const getJobStatusHandler = async (req, res) => {
  const { jobId } = req.params;
  const job = await ticketQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy job"
    });
  }

  const state = await job.getState();

  res.status(200).json({
    success: true,
    data: {
      jobId: job.id,
      state,
      result: job.returnvalue || null,
      failedReason: job.failedReason || null
    }
  });
};

module.exports = { getJobStatusHandler };
