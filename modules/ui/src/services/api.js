import axios from 'axios';

const api = axios.create({
  // Sử dụng proxy của Vite, không cần hardcode http://localhost:5000 nữa
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;