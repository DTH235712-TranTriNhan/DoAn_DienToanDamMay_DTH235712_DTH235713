/**
 * NotificationBell.jsx — Module: UI | Flash Sale Project
 * Component chuông thông báo với dropdown, badge đếm chưa đọc,
 * và điều hướng đến /my-tickets khi click vào một thông báo.
 * Design style: Cyberpunk / Vaporwave (Premium) — đồng nhất với NavBar.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { SHADOWS, TYPOGRAPHY, THEME_COLORS } from "../constants/uiConstants.js";

// ─── Bell SVG Icon ─────────────────────────────────────────────────────────────

const BellIcon = ({ hasUnread }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`transition-colors duration-300 ${
      hasUnread ? "text-primary" : "text-white/50 group-hover:text-white"
    }`}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    {hasUnread && (
      <circle cx="18" cy="5" r="3" fill="#FF00FF" stroke="#090014" strokeWidth="1.5" />
    )}
  </svg>
);

// ─── Animation Variants ────────────────────────────────────────────────────────

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: { duration: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.18 },
  }),
};

// ─── Single Notification Item ──────────────────────────────────────────────────

const NotificationItem = ({ notification, index, onClick }) => {
  const isSuccess = notification.type === "success";
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <motion.button
      id={`notif-item-${notification.id}`}
      custom={index}
      variants={itemVariants}
      onClick={() => onClick(notification)}
      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-200 rounded-md group
        ${notification.isRead
          ? "hover:bg-white/5 opacity-60 hover:opacity-100"
          : "hover:bg-primary/10 bg-primary/5"
        }`}
      style={{ fontFamily: TYPOGRAPHY.BODY }}
    >
      {/* Status Dot */}
      <span
        className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full transition-all ${
          notification.isRead
            ? "bg-white/20"
            : isSuccess
            ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]"
            : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]"
        }`}
      />

      <div className="flex-1 min-w-0">
        <p
          className={`text-[11px] leading-relaxed ${
            notification.isRead ? "text-white/50" : "text-white/90 font-medium"
          }`}
        >
          {notification.message}
        </p>
        <p className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-wider">
          {timeAgo}
        </p>
      </div>

      {/* Arrow hint on hover */}
      <span className="text-primary/0 group-hover:text-primary/60 text-xs transition-all duration-200 mt-0.5 flex-shrink-0">
        →
      </span>
    </motion.button>
  );
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTimeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleNotificationClick = useCallback(
    (notification) => {
      markAsRead(notification.id);
      setIsOpen(false);
      navigate("/my-tickets");
    },
    [markAsRead, navigate]
  );

  const handleMarkAllRead = useCallback(
    (e) => {
      e.stopPropagation();
      markAllAsRead();
    },
    [markAllAsRead]
  );

  const handleClearAll = useCallback(
    (e) => {
      e.stopPropagation();
      clearAll();
    },
    [clearAll]
  );

  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={handleBellClick}
        aria-label={t("notif_bell_label") || "Thông báo"}
        className={`relative p-2 rounded-full group transition-all duration-300
          ${isOpen
            ? "bg-primary/15 shadow-[0_0_12px_rgba(255,0,255,0.25)]"
            : "hover:bg-white/5"
          }`}
      >
        <BellIcon hasUnread={unreadCount > 0} />

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              id="notification-badge"
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none"
              style={{
                boxShadow: "0 0 8px rgba(239, 68, 68, 0.7)",
                fontFamily: TYPOGRAPHY.TECH,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notification Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="notification-panel"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-[calc(100%+12px)] w-80 rounded-xl overflow-hidden z-50"
            style={{
              background: "rgba(9, 0, 20, 0.97)",
              backdropFilter: "blur(24px)",
              border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
              boxShadow: `${SHADOWS.NEON_PRIMARY}, 0 20px 60px rgba(0,0,0,0.8)`,
            }}
          >
            {/* Panel Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/5"
              style={{ background: "rgba(255, 0, 255, 0.05)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-mono text-primary uppercase tracking-[0.25em]"
                  style={{ fontFamily: TYPOGRAPHY.TECH }}
                >
                  {t("notif_panel_title") || "THÔNG BÁO"}
                </span>
                {unreadCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[8px] font-black"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {unreadCount} {t("notif_unread") || "chưa đọc"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    id="notif-mark-all-read"
                    onClick={handleMarkAllRead}
                    className="text-[9px] font-mono text-secondary hover:text-white transition-colors uppercase tracking-wider"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t("notif_mark_all_read") || "Đọc tất cả"}
                  </button>
                )}
                {hasNotifications && (
                  <button
                    id="notif-clear-all"
                    onClick={handleClearAll}
                    className="text-[9px] font-mono text-white/30 hover:text-red-400 transition-colors uppercase tracking-wider"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t("notif_clear_all") || "Xóa"}
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {hasNotifications ? (
                <div className="flex flex-col p-1.5 gap-0.5">
                  {notifications.map((notif, i) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      index={i}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/15"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <p
                    className="text-[10px] font-mono text-white/25 uppercase tracking-[0.2em] text-center"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t("notif_empty") || "[ KHÔNG CÓ THÔNG BÁO ]"}
                  </p>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            {hasNotifications && (
              <div
                className="px-4 py-2.5 border-t border-white/5 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/my-tickets");
                }}
              >
                <span
                  className="text-[9px] font-mono text-secondary hover:text-white transition-colors uppercase tracking-[0.2em]"
                  style={{ fontFamily: TYPOGRAPHY.TECH }}
                >
                  {t("notif_view_tickets") || "XEM VÉ CỦA TÔI →"}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
