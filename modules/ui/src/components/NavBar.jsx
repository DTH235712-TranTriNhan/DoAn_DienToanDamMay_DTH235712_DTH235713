/**
 * NavBar.jsx — Module: UI | Flash Sale Project
 * Integrated Auth, Mobile Hamburger Menu, and Glassmorphism Dropdowns.
 * Design style: Cyberpunk / Vaporwave (Premium).
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from "../constants/uiConstants.js";
import NotificationBell from "./NotificationBell.jsx";
import TopUpModal from "./TopUpModal.jsx";

// ─── Animation Variants ───────────────────────────────────────────────────────

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 }
  })
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const NavLogo = () => (
  <Link
    to="/"
    id="nav-logo"
    style={{ fontFamily: TYPOGRAPHY.HEADING }}
    className="text-2xl font-black tracking-tighter uppercase text-white select-none relative group"
  >
    <span className="relative z-10">EVENT</span>
    <span className="text-primary relative z-10">HUB</span>
    <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="text-[10px] absolute -bottom-3 left-0 font-mono tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">
      V.3.0_LIVE
    </span>
  </Link>
);

const UserAvatar = ({ user, onClick }) => (
  <button
    id="nav-avatar-btn"
    onClick={onClick}
    className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors group focus:outline-none"
  >
    <div className="relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-primary to-secondary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
      <img
        src={
          user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "U")}&background=FF00FF&color=00FFFF&size=128`
        }
        alt="Avatar"
        className="relative w-9 h-9 rounded-full object-cover border border-white/20"
        referrerPolicy="no-referrer"
        onError={e => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "U")}&background=FF00FF&color=00FFFF&size=128`;
        }}
      />
    </div>
    <div className="hidden sm:block text-left">
      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none">
        Logged_In
      </p>
      <p className="text-xs font-bold text-white truncate max-w-[100px] mt-1">
        {user?.displayName || user?.name}
      </p>
      <p className="text-[10px] font-black text-primary mt-0.5" style={{ fontFamily: TYPOGRAPHY.TECH }}>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND"
        }).format(user?.balance || 0)}
      </p>
    </div>
    <span className="text-primary text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
      ▼
    </span>
  </button>
);

const UserDropdown = ({ user, onLogout, onTopUp, t }) => {
  const menuItems = [
    { id: "nav-tickets", icon: "🎟️", label: t("nav_myTickets"), path: "/my-tickets" },
    ...(user?.role === "admin"
      ? [{ id: "nav-admin", icon: "⚡", label: t("nav_admin"), path: "/admin/events" }]
      : [])
  ];

  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute right-0 top-[calc(100%+15px)] w-56 rounded-lg overflow-hidden z-50 p-1"
      style={{
        background: "rgba(10, 5, 20, 0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
        boxShadow: SHADOWS.NEON_PRIMARY
      }}
    >
      <div className="px-4 py-3 border-b border-white/5 mb-1">
        <p className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] mb-1">
          Authorization_Token
        </p>
        <p className="text-xs font-bold text-white truncate">{user?.email}</p>
      </div>

      <div className="flex flex-col">
        {/* Nút Nạp Tiền — nổi bật với màu secondary (cyan) */}
        <motion.div custom={0} variants={itemVariants}>
          <button
            id="nav-topup-btn"
            onClick={onTopUp}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary/10 transition-all rounded-md group"
            style={{
              fontFamily: TYPOGRAPHY.TECH,
              color: THEME_COLORS.SECONDARY
            }}
          >
            <span className="group-hover:scale-125 transition-transform">💰</span>
            {t("topup_btn_label")}
          </button>
        </motion.div>

        {menuItems.map((item, i) => (
          <motion.div key={item.id} custom={i + 1} variants={itemVariants}>
            <Link
              to={item.path}
              id={item.id}
              className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-primary/10 transition-all rounded-md group"
              style={{ fontFamily: TYPOGRAPHY.TECH }}
            >
              <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
              {item.label}
            </Link>
          </motion.div>
        ))}

        <div className="h-px bg-white/5 my-1 mx-2"></div>

        <motion.div custom={menuItems.length + 1} variants={itemVariants}>
          <button
            id="nav-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-md group"
            style={{ fontFamily: TYPOGRAPHY.TECH }}
          >
            <span className="group-hover:translate-x-1 transition-transform">🚪</span>
            {t("nav_logout")}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const LanguageToggle = ({ lang, toggleLanguage }) => (
  <div
    className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10"
    style={{ fontFamily: TYPOGRAPHY.TECH }}
  >
    {["vi", "en"].map(l => (
      <button
        key={l}
        onClick={() => l !== lang && toggleLanguage()}
        className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all duration-300 ${l === lang ? "bg-primary text-black" : "text-white/30 hover:text-white/60"
          }`}
        style={l === lang ? { boxShadow: SHADOWS.NEON_PRIMARY } : {}}
      >
        {l.toUpperCase()}
      </button>
    ))}
  </div>
);

// ─── Main NavBar Component ───────────────────────────────────────────────────

const NavBar = () => {
  const { user, logout } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    setIsMobileMenu(false);
    logout();
  };

  const handleOpenTopUp = () => {
    setIsOpen(false);
    setIsMobileMenu(false);
    setIsTopUpOpen(true);
  };

  const handleMobileToggle = () => {
    setIsMobileMenu(prev => {
      if (!prev) setIsOpen(false); // Close dropdown when opening mobile menu
      return !prev;
    });
  };

  return (
    <>
      <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5"
      style={{ background: "rgba(5, 2, 10, 0.7)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <NavLogo />

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell — chỉ hiện khi đăng nhập */}
              <NotificationBell />
              <div className="relative" ref={dropdownRef}>
                <UserAvatar user={user} onClick={() => setIsOpen(!isOpen)} />
                <AnimatePresence>
                  {isOpen && <UserDropdown user={user} onLogout={handleLogout} onTopUp={handleOpenTopUp} t={t} />}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              id="login-redirect"
              className="px-6 py-2 bg-transparent border border-secondary text-secondary text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-secondary hover:text-black transition-all duration-300 rounded shadow-[0_0_15px_rgba(0,255,255,0.2)]"
              style={{ fontFamily: TYPOGRAPHY.TECH }}
            >
              {t("nav_login")}
            </Link>
          )}
          <LanguageToggle lang={lang} toggleLanguage={toggleLanguage} />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={handleMobileToggle}
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-end">
            <span
              className={`h-0.5 bg-primary transition-all duration-300 ${isMobileMenu ? "w-6 translate-y-2 rotate-45" : "w-6"}`}
            />
            <span
              className={`h-0.5 bg-primary transition-all duration-300 ${isMobileMenu ? "opacity-0" : "w-4"}`}
            />
            <span
              className={`h-0.5 bg-primary transition-all duration-300 ${isMobileMenu ? "w-6 -translate-y-2.5 -rotate-45" : "w-6"}`}
            />
          </div>
        </button>
      </div>
    </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenu(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 z-100 p-8 flex flex-col border-l border-cyan-500 overflow-y-auto scrollbar-none bg-black/95 backdrop-blur-lg"
              style={{
                boxShadow: "-10px 0 30px rgba(0,0,0,0.8), -2px 0 15px rgba(0, 255, 255, 0.4)"
              }}
            >
              <div className="flex justify-between items-center mb-10 shrink-0">
                <span className="text-primary text-[10px] font-mono tracking-widest">
                  [ NAVIGATION_GRID ]
                </span>
                <button
                  onClick={() => setIsMobileMenu(false)}
                  className="text-white p-2 -mr-2 hover:text-primary transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Profile Section */}
              {user && (
                <div className="mb-10 p-4 border border-white/10 bg-white/5 rounded-xl flex items-center gap-4">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "U")}&background=FF00FF&color=00FFFF&size=128`
                    }
                    alt="Mobile Avatar"
                    className="w-12 h-12 rounded-full border border-primary/50 object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-mono text-primary uppercase tracking-widest mb-1">
                      Auth_User
                    </p>
                    <p
                      className="text-sm font-bold text-white truncate uppercase tracking-tighter"
                      style={{ fontFamily: TYPOGRAPHY.HEADING }}
                    >
                      {user?.displayName || user?.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 relative z-10">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenu(false)}
                  className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-4 py-3 border-b border-white/5 group"
                  style={{ fontFamily: TYPOGRAPHY.TECH }}
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">🏠</span>{" "}
                  {t("nav_home") || "HOME"}
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/my-tickets"
                      onClick={() => setIsMobileMenu(false)}
                      className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-4 py-3 border-b border-white/5 group"
                      style={{ fontFamily: TYPOGRAPHY.TECH }}
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">🎟️</span>{" "}
                      {t("nav_myTickets") || "MY TICKETS"}
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/events"
                        onClick={() => setIsMobileMenu(false)}
                        className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-4 py-3 border-b border-white/5 group"
                        style={{ fontFamily: TYPOGRAPHY.TECH }}
                      >
                        <span className="text-xl group-hover:scale-125 transition-transform">⚡</span>{" "}
                        {t("nav_admin") || "ADMIN_PANEL"}
                      </Link>
                    )}
                    {/* Nút Nạp Tiền — Mobile */}
                    <button
                      id="mobile-topup-btn"
                      onClick={handleOpenTopUp}
                      className="text-lg font-bold uppercase tracking-widest transition-colors flex items-center gap-4 py-3 text-left border-b border-white/5 group"
                      style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.SECONDARY }}
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">💰</span>{" "}
                      {t("topup_btn_label") || "TOP UP"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-lg font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors flex items-center gap-4 py-3 text-left border-b border-white/5 group"
                      style={{ fontFamily: TYPOGRAPHY.TECH }}
                    >
                      <span className="text-xl group-hover:translate-x-1 transition-transform">🚪</span>{" "}
                      {t("nav_logout") || "LOGOUT"}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenu(false)}
                    className="w-full py-5 mt-4 border border-secondary text-center text-secondary font-black uppercase tracking-widest shadow-neon-secondary flex items-center justify-center gap-3 bg-secondary/5"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    <span>➡️</span> {t("nav_login") || "SIGN_IN"}
                  </Link>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-4">
                  LANGUAGE 
                </p>
                <LanguageToggle lang={lang} toggleLanguage={toggleLanguage} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Top-up Modal — render ở cấp NavBar để không bị z-index chặn */}
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </>
  );
};

export default NavBar;
