const mongoose = require("mongoose");
const redisClient = require("../libs/redis");

const connectToServers = async () => {
  // 1. Kết nối MongoDB — tăng pool size cho traffic burst
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 20
  });
  console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);

  // 2. Đợi Redis thực sự ready (không chỉ log status)
  if (redisClient.status !== "ready") {
    await new Promise((resolve, reject) => {
      redisClient.once("ready", resolve);
      redisClient.once("error", reject);
    });
  }
  console.log(`[Redis] Status: ${redisClient.status}`);
};

module.exports = { connectToServers };
