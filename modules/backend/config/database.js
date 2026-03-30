const mongoose = require("mongoose");

/**
 * Hàm: connectDB
 * Chức năng: Kết nối tới MongoDB Atlas bằng Mongoose
 */
const connectDB = async () => {
  try {
    // Không cần require dotenv ở đây nữa
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Error] MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
