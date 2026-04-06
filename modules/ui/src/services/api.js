import axios from "axios";

const api = axios.create({
  // Sử dụng proxy của Vite, không cần hardcode http://localhost:5000 nữa
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor dán token vào header mỗi khi gọi API
api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor xử lý phản hồi lỗi toàn cục (VD: Token hết hạn - 401)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Chỉ clear localStorage. AuthContext sẽ detect token = null
      // và gọi logout() + navigate() qua React Router (không reload trang)
      localStorage.removeItem("jwt_token");
    }
    return Promise.reject(error);
  }
);

export default api;
