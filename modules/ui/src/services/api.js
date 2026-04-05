import axios from 'axios';

const api = axios.create({
  // Thay đổi quan trọng: Chỉ cần gọi "/api", Vite sẽ tự động proxy tới Backend
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;