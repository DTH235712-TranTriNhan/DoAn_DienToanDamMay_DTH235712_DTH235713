import axios from "axios";

// Cấu hình bài test
const URL = "https://doan-dientoandammay-dth235712-dth235713.onrender.com/api/tickets";
const TOKEN = "fb8f7a9d2c1e4b3a5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s@"; // Lấy từ localStorage sau khi đăng nhập trên Web
const EVENT_ID = "69dc9b0d73383c2e49628582";
const TOTAL_REQUESTS = 10000;

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
