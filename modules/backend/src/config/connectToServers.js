import mongoose from "mongoose";
import redisClient from "../libs/redis.js";

/**
 * Thiết lập kết nối tới MongoDB Atlas và Upstash Redis trước khi Server khởi động.
 * Tuân thủ Modular Design: Một file chỉ chứa một hàm thực thi duy nhất [1].
 */
export const connectToServers = async () => {
  try {
    // 1. Kết nối MongoDB Atlas (Gói M0 Sandbox)
    // Tăng maxPoolSize lên 20 để sẵn sàng cho các đợt Traffic Burst trong Flash Sale [User Query]
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 20
    });

    // Sử dụng Structured Logging kèm context [SYSTEM] để dễ dàng debug trên Cloud [2, 3]
    console.log(`[SYSTEM] MongoDB Connected: ${conn.connection.host}`);

    // 2. Kiểm tra trạng thái Upstash Redis
    // Đảm bảo Redis thực sự sẵn sàng trước khi tiếp tục (tránh lỗi hàng đợi khi server chưa link xong)
    if (redisClient.status !== "ready") {
      await new Promise((resolve, reject) => {
        redisClient.once("ready", resolve);
        redisClient.once("error", reject);
      });
    }
    console.log(`[SYSTEM] Redis Status: ${redisClient.status}`);
  } catch (err) {
    // Luôn sử dụng try/catch để xử lý lỗi kết nối hạ tầng Cloud [1]
    console.error("[SYSTEM] Lỗi kết nối server hạ tầng:", err.message);
    throw err; // Ném lỗi ra để hàm bootstrap trong index.js xử lý dừng server
  }
};
