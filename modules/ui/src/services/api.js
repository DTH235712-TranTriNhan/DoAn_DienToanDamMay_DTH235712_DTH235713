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

// Interceptor xử lý phản hồi lỗi toàn cục (VD: Token hết hạn - 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu API trả về 401 (Unauthorized) -> Token hỏng hoặc hết hạn
    if (error.response?.status === 401) {
      console.warn("Phiên làm việc hết hạn, đang đăng xuất...");
      localStorage.removeItem("jwt_token");
      // Chuyển hướng về login (Sử dụng window.location vì đây không phải React component)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?error=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;