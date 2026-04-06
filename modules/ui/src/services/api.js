import axios from 'axios';

const api = axios.create({
  // Sử dụng proxy của Vite, không cần hardcode http://localhost:5000 nữa
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor dán token vào header mỗi khi gọi API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;