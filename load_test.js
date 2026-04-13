import axios from "axios";

// Cấu hình bài test
const URL = "https://doan-dientoandammay-dth235712-dth235713.onrender.com/api/tickets";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWRjYTg5NzUwMDBmOWU3YTY4Yzk3YTQiLCJlbWFpbCI6Im5oYW5fZHRoMjM1NzEyQHN0dWRlbnQuYWd1LmVkdS52biIsImlhdCI6MTc3NjA2ODc1OSwiZXhwIjoxNzc2NjczNTU5fQ.lT6Ksafo6F22XTz3zQ_r3ucNyknUlyW1yXk79spZOwQ"; // Lấy từ localStorage sau khi đăng nhập trên Web
const EVENT_ID = "69dca13ba29407f07aeef380";
const TOTAL_REQUESTS = 5000;

async function runLoadTest() {
  console.log(`🚀 Đang bắn ${TOTAL_REQUESTS} requests lên Render...`);
  const startTime = Date.now();

  // Gửi đồng thời 10.000 yêu cầu (bất đồng bộ)
  const requests = Array.from({ length: TOTAL_REQUESTS }).map(() =>
    axios
      .post(
        URL,
        { eventId: EVENT_ID },
        {
          headers: { Authorization: `Bearer ${TOKEN}` }
        }
      )
      .catch(err => err.response?.status)
  );

  const results = await Promise.all(requests);
  const duration = (Date.now() - startTime) / 1000;

  console.log(`\n✅ Hoàn tất đợt test trong ${duration} giây.`);
  console.log(`📊 Phản hồi 202 Accepted (Vào hàng chờ):`, results.filter(s => s === 202).length);
}

runLoadTest();
