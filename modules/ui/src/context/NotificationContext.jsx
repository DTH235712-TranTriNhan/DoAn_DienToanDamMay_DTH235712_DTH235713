/**
 * NotificationContext.jsx — Module: UI | Flash Sale Project
 * Quản lý danh sách thông báo toàn cục, tự động persist vào localStorage.
 * Thiết kế: Modular Context theo chuẩn dự án.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "flashsale_notifications";
const MAX_NOTIFICATIONS = 50; // Giới hạn tối đa để tránh localStorage overflow

// ─── Helper ───────────────────────────────────────────────────────────────────

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // Ignore storage quota errors
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => loadFromStorage());

  // Persist mỗi khi danh sách thay đổi
  useEffect(() => {
    saveToStorage(notifications);
  }, [notifications]);

  /**
   * Thêm một thông báo mới vào đầu danh sách.
   * @param {string} message - Nội dung thông báo
   * @param {"success"|"info"|"error"} type - Loại thông báo
   */
  const addNotification = useCallback((message, type = "success") => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      // Giữ tối đa MAX_NOTIFICATIONS bản ghi
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
  }, []);

  /**
   * Đánh dấu một thông báo là đã đọc theo id.
   */
  const markAsRead = useCallback((notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  }, []);

  /**
   * Đánh dấu tất cả thông báo là đã đọc.
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  /**
   * Xóa tất cả thông báo.
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
