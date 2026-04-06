import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js"; // Đảm bảo đúng chuẩn ESM có đuôi .js

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm đăng xuất: Xóa sạch dấu vết xác thực
  const logout = useCallback(() => {
    console.log("[Auth] Đang thực hiện đăng xuất...");
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
    // Điều hướng về trang chủ để tránh lỗi vòng lặp tại các route bảo vệ
    navigate("/", { replace: true });
  }, [navigate]);

  // Hàm lấy thông tin User: Xử lý Race Condition và Envelope dữ liệu
  const fetchUser = useCallback(async () => {
    // 1. Luôn set loading là true khi bắt đầu để các component chờ dữ liệu
    setLoading(true);
    try {
      const response = await api.get("/auth/me");

      // 2. Trích xuất đúng cấu trúc Envelope { success: true, data: user }
      // Việc lấy đúng response.data.data giúp dứt điểm lỗi không hiển thị Avatar
      if (response.data && response.data.data) {
        console.log("[Auth] Đã lấy profile thành công:", response.data.data.displayName);
        setUser(response.data.data); // LUÔN trích xuất từ .data.data của Envelope
      } else {
        throw new Error("Dữ liệu người dùng trả về không khớp cấu trúc Envelope");
      }
    } catch (error) {
      console.error(
        "[Auth] Lỗi lấy thông tin người dùng:",
        error.response?.data?.message || error.message
      );
      // Nếu token hết hạn (401), dọn dẹp state ngay lập tức
      if (error.response?.status === 401) {
        logout();
      } else {
        setUser(null);
      }
    } finally {
      // 3. Đảm bảo loading luôn tắt để ứng dụng hiển thị giao diện
      setLoading(false);
    }
  }, [logout]);

  // Tự động kiểm tra session khi người dùng F5 trang
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // Hàm đăng nhập: Đồng bộ hóa localStorage và profile
  const login = useCallback(
    async newToken => {
      console.log("[Auth] Tiếp nhận Token mới, đang đồng bộ hóa...");
      // 4. Cập nhật localStorage ngay lập tức để các request sau đính kèm JWT
      localStorage.setItem("jwt_token", newToken);
      setToken(newToken);

      // 5. Quan trọng: Phải chờ lấy xong profile mới kết thúc hàm login
      // Giúp AuthCallbackPage dứt điểm lỗi redirect về /login một cách sai lầm
      await fetchUser();
    },
    [fetchUser]
  );

  // 6. Tối ưu hiệu năng: Dùng useMemo để tránh việc Provider re-render vô tận
  // (Fix lỗi log API /me trả mã 304 liên tục mà bạn đã gặp)
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin" // Tiện ích cho Task 3.2 và 3.4
    }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
