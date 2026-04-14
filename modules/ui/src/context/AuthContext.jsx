import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { ROLES } from "../constants/roles.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Logout function: Clears all authentication footprints
  const logout = useCallback(() => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Profile fetch function: Handles Race Condition and Envelope data extraction
  const fetchUser = useCallback(async () => {
    // 1. Set loading true initially so components wait for data
    setLoading(true);
    try {
      const response = await api.get("/auth/me");

      // 2. Extract from Envelope structure { success: true, data: user }
      // Direct extraction ensures Avatar display works correctly
      if (response.data && response.data.data) {
        setUser(response.data.data); // ALWAYS extract from .data.data
      } else {
        throw new Error("User data returned does not match Envelope structure");
      }
    } catch (error) {
      // If token is expired (401), clear state immediately
      if (error.response?.status === 401) {
        logout();
      } else {
        setUser(null);
      }
    } finally {
      // 3. Ensure loading is disabled to unblock UI
      setLoading(false);
    }
  }, [logout]);

  // Auto-check session on page refresh (F5)
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // Login function: Synchronizes localStorage and profile state
  const login = useCallback(
    async newToken => {
      // 4. Update localStorage immediately so subsequent requests attach JWT
      localStorage.setItem("jwt_token", newToken);
      setToken(newToken);

      // 5. CRITICAL: Wait for profile fetch before resolving login
      // Prevents premature redirect to /login in AuthCallbackPage
      await fetchUser();
    },
    [fetchUser]
  );

  // 6. Performance Optimization: Memoize context to prevent infinite re-renders
  // (Fixes the issue where /me returns 304 repeatedly)
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refreshUser: fetchUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === ROLES.ADMIN // Utility for administrative tasks
    }),
    [user, token, loading, login, logout, fetchUser]
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
