import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Luôn nạp file .env khi chạy ở máy local (bỏ điều kiện if !== production)
// Giúp Passport không bị thiếu clientID khi chạy lệnh npm start (NODE_ENV=production)
dotenv.config({ path: path.join(__dirname, "../.env") });
