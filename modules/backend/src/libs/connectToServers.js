const mongoose = require("mongoose");
const redisClient = require("./redis");

const connectToServers = async () => {
  // 1. Kết nối MongoDB
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);

  // 2. Đảm bảo Redis đã ready (ioredis kết nối ngay khi khởi tạo)
  //    redisClient.status có thể là "connecting" hoặc "ready"
  console.log(`[Redis] Status: ${redisClient.status}`);
};

module.exports = { connectToServers };
