import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
    // Quay về trang chủ thay vì /login để tránh reload loop nếu đang ở trang chủ
    navigate("/");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      // Backend: { success: true, data: { ...user } }
      setUser(response.data.data || response.data);
    } catch (error) {
      console.error("[AuthContext] Fetch user error:", error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = useCallback(async (newToken) => {
    localStorage.setItem("jwt_token", newToken);
    setToken(newToken);
    // Token update triggers useEffect which calls fetchUser
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
