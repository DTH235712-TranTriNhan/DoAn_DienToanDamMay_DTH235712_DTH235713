import axios from "axios";

// Cấu hình bài test
const URL = "https://doan-dientoandammay-dth235712-dth235713.onrender.com/api/tickets";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ5NTIwZmUzMzAzYzAzMWI3N2NhZWUiLCJlbWFpbCI6Im5oYW5fZHRoMjM1NzEyQHN0dWRlbnQuYWd1LmVkdS52biIsImlhdCI6MTc3NTg0OTk5OSwiZXhwIjoxNzc2NDU0Nzk5fQ.CcftlRi2dF_2TdY6F7iCCQ63kUV5Iph0tdNrRUOkmjg"; // Lấy từ localStorage sau khi đăng nhập trên Web
const EVENT_ID = "69dc9b0d73383c2e49628582";
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
