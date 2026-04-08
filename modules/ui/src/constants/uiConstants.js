/**
 * UI Constants for Cyberpunk/Vaporwave Design System
 * All hex colors should be referenced from here.
 */

export const THEME_COLORS = {
  BACKGROUND: "#090014", // Deep space black/purple
  PRIMARY: "#FF00FF", // Neon Pink
  PRIMARY_GLOW: "rgba(255, 0, 255, 0.5)",
  SECONDARY: "#00FFFF", // Neon Cyan
  SECONDARY_GLOW: "rgba(0, 255, 255, 0.5)",
  ACCENT: "#FF9900", // Amber/Orange
  CARD_BG: "rgba(26, 0, 51, 0.7)", // Translucent dark purple
  BORDER: "rgba(45, 27, 78, 0.8)", // Subtle purple border
  TEXT: "#E0E0E0", // Light gray text
  TEXT_MUTED: "#94a3b8", // Muted gray text
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  NAVY_DARK: "rgba(9, 0, 20, 0.85)", // Dark navy for dropdowns
  GLASS_BG: "rgba(9, 0, 20, 0.8)",    // Glassmorphism background for navbar
  MOBILE_NAV_BG: "rgba(9, 0, 20, 0.96)" // Opaque navy for mobile menu
};

export const UI_SIZES = {
  CONTAINER_MAX_WIDTH: "1280px", // max-w-7xl
  NAV_HEIGHT: "64px", // h-16
  HERO_HEIGHT: "500px",
  CARD_RADIUS: "1rem" // rounded-2xl
};

export const SHADOWS = {
  NEON_PRIMARY: "0 0 20px rgba(255, 0, 255, 0.4)",
  NEON_SECONDARY: "0 0 20px rgba(0, 255, 255, 0.4)",
  CARD: "0 8px 32px 0 rgba(0, 0, 0, 0.8)"
};

export const TYPOGRAPHY = {
  HEADING: "'Inter', sans-serif",
  BODY: "'Inter', sans-serif",
  TECH: "'Share Tech Mono', monospace"
};

/**
 * Configuration for Booking Button States
 * Maps status to specific CSS classes and labels as per system requirements.
 */
export const BOOKING_UI_CONFIG = {
  idle: {
    label: "🎟️ Đặt Vé Ngay",
    className: "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]",
  },
  submitting: {
    label: "⏳ Đang gửi...",
    className: "bg-blue-800 text-white/70 cursor-not-allowed opacity-70",
  },
  queued: {
    label: "⏳ Đang xử lý...",
    className: "bg-yellow-500 text-black animate-pulse cursor-not-allowed shadow-[0_0_15px_rgba(234,179,8,0.5)]",
  },
  completed: {
    label: "✅ Đặt vé thành công!",
    className: "bg-green-500 text-white cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.4)]",
  },
  failed: {
    label: "❌ Thất bại - Thử lại",
    className: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  },
  sold_out: {
    label: "Hết vé",
    className: "border-gray-800 text-gray-500 bg-transparent cursor-not-allowed",
  }
};
