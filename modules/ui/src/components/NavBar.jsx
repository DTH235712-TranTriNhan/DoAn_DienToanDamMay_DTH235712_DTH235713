/**
 * NavBar.jsx — Module: UI | Flash Sale Project
 * Tích hợp Auth, Hamburger Mobile, Glassmorphism Dropdown
 * Phong cách: Cyberpunk / Vaporwave
 */

import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import LanguageContext from '../context/LanguageContext.jsx';
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from '../constants/uiConstants.js';

// ─── Animation Variants ───────────────────────────────────────────────────────

const mobileMenuVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'tween', duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { type: 'tween', duration: 0.22, ease: 'easeIn' },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.2 },
  }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Logo với hiệu ứng Neon Glow màu SECONDARY */
const NavLogo = () => (
  <Link
    to="/"
    style={{ fontFamily: TYPOGRAPHY.HEADING }}
    className="text-2xl font-black tracking-widest uppercase text-white select-none"
    aria-label="Trang chủ Event Hub"
  >
    <span
      style={{
        textShadow: `0 0 8px ${THEME_COLORS.SECONDARY}, 0 0 20px ${THEME_COLORS.SECONDARY}`,
      }}
    >
      EVENT
    </span>
    <span
      style={{
        color: THEME_COLORS.SECONDARY,
        textShadow: `0 0 12px ${THEME_COLORS.SECONDARY}`,
      }}
    >
      HUB
    </span>
    <span
      style={{
        color: THEME_COLORS.PRIMARY,
        textShadow: `0 0 10px ${THEME_COLORS.PRIMARY}`,
        fontFamily: TYPOGRAPHY.TECH,
      }}
    >
      _
    </span>
  </Link>
);

/** Nút Đăng nhập khi chưa auth */
const LoginButton = ({ label }) => (
  <Link
    to="/login"
    id="nav-login-btn"
    className="group relative -skew-x-12 transform transition-all duration-200 hover:skew-x-0"
    style={{ fontFamily: TYPOGRAPHY.BODY }}
  >
    <span
      className="inline-block skew-x-12 group-hover:skew-x-0 transition-all duration-200 px-5 py-2 text-xs font-bold uppercase tracking-widest border-2"
      style={{
        color: THEME_COLORS.SECONDARY,
        borderColor: THEME_COLORS.SECONDARY,
        boxShadow: `0 0 8px ${THEME_COLORS.SECONDARY_GLOW}`,
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = THEME_COLORS.SECONDARY;
        e.currentTarget.style.color = THEME_COLORS.BLACK;
        e.currentTarget.style.boxShadow = SHADOWS.NEON_SECONDARY;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = THEME_COLORS.SECONDARY;
        e.currentTarget.style.boxShadow = `0 0 8px ${THEME_COLORS.SECONDARY_GLOW}`;
      }}
    >
      {label}
    </span>
  </Link>
);

/** Avatar tròn có viền PRIMARY glow */
const UserAvatar = ({ user, onClick }) => {
  const avatarSrc = user?.avatar;

  return (
    <button
      id="nav-avatar-btn"
      onClick={onClick}
      className="flex items-center gap-3 focus:outline-none group"
      aria-label="Mở menu người dùng"
      aria-haspopup="true"
    >
      {/* Avatar tròn */}
      <span
        className="relative block w-9 h-9 rounded-full overflow-hidden transition-all duration-300"
        style={{
          border: `2px solid ${THEME_COLORS.PRIMARY}`,
          boxShadow: `0 0 10px ${THEME_COLORS.PRIMARY_GLOW}, 0 0 20px ${THEME_COLORS.PRIMARY_GLOW}`,
        }}
      >
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=FF00FF&color=00FFFF&size=128`}
          alt={`Avatar của ${user?.displayName}`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Trường hợp URL từ Google bị lỗi (hết hạn), fallback về UI-Avatar
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=FF00FF&color=00FFFF&size=128`;
          }}
        />
      </span>

      {/* Tên người dùng */}
      <span
        style={{
          fontFamily: TYPOGRAPHY.BODY,
          color: THEME_COLORS.TEXT,
        }}
        className="hidden sm:block text-sm font-semibold max-w-[120px] truncate group-hover:text-white transition-colors"
      >
        {user?.displayName || user?.name}
      </span>

      {/* Chevron indicator */}
      <span
        style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY }}
        className="hidden sm:block text-xs transition-transform group-hover:rotate-180 duration-300"
      >
        ▾
      </span>
    </button>
  );
};

/** Dropdown Glassmorphism khi đã đăng nhập */
const UserDropdown = ({ user, onLogout, t }) => {
  const menuItems = [
    {
      id: 'nav-dropdown-tickets',
      icon: '🎟️',
      labelKey: 'nav.myTickets',
      to: '/my-tickets',
      fallback: 'Vé của tôi',
    },
    // Mục Admin — chỉ hiện khi role === 'admin' (Phase 3)
    ...(user?.role === 'admin'
      ? [
          {
            id: 'nav-dropdown-admin',
            icon: '⚙️',
            labelKey: 'nav.admin',
            to: '/admin/events',
            fallback: 'Quản trị',
          },
        ]
      : []),
  ];

  return (
    <motion.div
      key="user-dropdown"
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="nav-dropdown-menu"
      role="menu"
      aria-label="Menu người dùng"
      className="absolute right-0 top-[calc(100%+12px)] min-w-[220px] rounded-lg overflow-hidden z-50"
      style={{
        background: THEME_COLORS.NAVY_DARK,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
        boxShadow: `${SHADOWS.NEON_PRIMARY}, ${SHADOWS.CARD}`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: `${THEME_COLORS.PRIMARY_GLOW}`,
          background: `linear-gradient(135deg, rgba(255,0,255,0.08), transparent)`,
        }}
      >
        <p
          style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.65rem' }}
          className="uppercase tracking-widest"
        >
          [ USER_SESSION ]
        </p>
        <p
          style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT }}
          className="text-sm font-semibold mt-0.5 truncate"
        >
          {user?.displayName || user?.name}
        </p>
      </div>

      {/* Menu items */}
      <div className="py-2">
        {menuItems.map((item, i) => (
          <motion.div key={item.id} custom={i} variants={itemVariants} initial="hidden" animate="visible">
            <Link
              to={item.to}
              id={item.id}
              role="menuitem"
              className="flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-150 group"
              style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(255,0,255,0.1)`;
                e.currentTarget.style.color = THEME_COLORS.WHITE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = THEME_COLORS.TEXT_MUTED;
              }}
            >
              <span>
                {item.icon}&nbsp;{t(item.labelKey) || item.fallback}
              </span>
              {item.badge && (
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.TECH,
                    color: THEME_COLORS.ACCENT,
                    fontSize: '0.6rem',
                    border: `1px solid ${THEME_COLORS.ACCENT}`,
                  }}
                  className="px-1.5 py-0.5 rounded"
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </motion.div>
        ))}

        {/* Divider */}
        <div
          className="mx-4 my-1"
          style={{ height: '1px', backgroundColor: `${THEME_COLORS.BORDER}` }}
        />

        {/* Đăng xuất */}
        <motion.div custom={menuItems.length} variants={itemVariants} initial="hidden" animate="visible">
          <button
            id="nav-logout-btn"
            role="menuitem"
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm text-left transition-all duration-150"
            style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `rgba(255,0,0,0.1)`;
              e.currentTarget.style.color = '#FF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = THEME_COLORS.TEXT_MUTED;
            }}
          >
            🚪&nbsp;{t('nav.logout') || 'Đăng xuất'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

/** Toggle ngôn ngữ VN/EN */
const LanguageToggle = ({ lang, changeLanguage }) => (
  <div
    className="flex items-center gap-1.5 pl-5 ml-5 border-l"
    style={{
      fontFamily: TYPOGRAPHY.TECH,
      fontSize: '0.7rem',
      borderColor: `${THEME_COLORS.PRIMARY_GLOW}`,
    }}
  >
    {['vi', 'en'].map((l, idx) => (
      <button
        key={l}
        id={`nav-lang-${l}`}
        onClick={() => changeLanguage(l)}
        className="px-2 py-1 transition-all duration-200 rounded-sm uppercase"
        style={
          lang === l
            ? {
                backgroundColor: l === 'vi' ? THEME_COLORS.PRIMARY : THEME_COLORS.SECONDARY,
                color: THEME_COLORS.BLACK,
                fontWeight: 700,
                boxShadow: l === 'vi' ? SHADOWS.NEON_PRIMARY : SHADOWS.NEON_SECONDARY,
              }
            : { color: 'rgba(255,255,255,0.4)' }
        }
      >
        {l === 'vi' ? 'VN' : 'EN'}
      </button>
    ))}
  </div>
);

// ─── Main NavBar Component ─────────────────────────────────────────────────────

const NavBar = () => {
  const { user, logout } = useAuth();
  const { t, lang, changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đóng mobile menu khi resize lên desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleAvatarClick = () => setIsDropdownOpen((prev) => !prev);

  return (
    <>
      {/* ── Thanh NavBar chính ─────────────────────────────────────────────── */}
      <nav
        id="main-navbar"
        aria-label="Thanh điều hướng chính"
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          background: THEME_COLORS.GLASS_BG,
          borderBottom: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
          boxShadow: SHADOWS.NEON_PRIMARY,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <NavLogo />

            {/* ── Desktop Nav ─────────────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {/* Avatar + Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <UserAvatar user={user} onClick={handleAvatarClick} />
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <UserDropdown user={user} onLogout={handleLogout} t={t} />
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <LoginButton label={t('nav.initialize') || 'Đăng nhập'} />
              )}

              {/* Language Toggle */}
              <LanguageToggle lang={lang} changeLanguage={changeLanguage} />
            </div>

            {/* ── Hamburger Button (Mobile) ───────────────────────────────── */}
            <button
              id="nav-hamburger-btn"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-0.5 w-6 rounded-full"
                  style={{ backgroundColor: THEME_COLORS.PRIMARY }}
                  animate={
                    isMobileMenuOpen
                      ? i === 0
                        ? { rotate: 45, y: 8 }
                        : i === 1
                        ? { opacity: 0 }
                        : { rotate: -45, y: -8 }
                      : { rotate: 0, y: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.25 }}
                />
              ))}
            </button>

          </div>
        </div>
      </nav>

      {/* ── Mobile Slide Menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide panel */}
            <motion.aside
              key="mobile-menu"
              id="mobile-nav-panel"
              aria-label="Menu di động"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col pt-20 pb-8 px-6 md:hidden"
              style={{
                background: THEME_COLORS.MOBILE_NAV_BG,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderLeft: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
                boxShadow: `-4px 0 30px ${THEME_COLORS.PRIMARY_GLOW}`,
              }}
            >
              {/* Close button */}
              <button
                id="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-xl"
                style={{ color: THEME_COLORS.PRIMARY, fontFamily: TYPOGRAPHY.TECH }}
                aria-label="Đóng menu"
              >
                ✕
              </button>

              {/* User info (nếu đã đăng nhập) */}
              {user && (
                <div
                  className="flex items-center gap-3 mb-8 pb-6 border-b"
                  style={{ borderColor: THEME_COLORS.PRIMARY_GLOW }}
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=FF00FF&color=00FFFF&size=128`}
                    alt="Avatar"
                    className="w-11 h-11 rounded-full object-cover"
                    style={{
                      border: `2px solid ${THEME_COLORS.PRIMARY}`,
                      boxShadow: SHADOWS.NEON_PRIMARY,
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=FF00FF&color=00FFFF&size=128`;
                    }}
                  />
                  <div>
                    <p
                      style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.WHITE }}
                      className="font-semibold text-sm"
                    >
                      {user?.displayName || user?.name}
                    </p>
                    <p
                      style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.6rem' }}
                      className="uppercase tracking-widest mt-0.5"
                    >
                      {user?.role === 'admin' ? '[ ADMIN ]' : '[ USER ]'}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile menu links */}
              <nav className="flex flex-col gap-2">
                {user ? (
                  <>
                    <MobileNavLink
                      id="mobile-nav-tickets"
                      to="/my-tickets"
                      icon="🎟️"
                      label={t('nav.myTickets') || 'Vé của tôi'}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {user?.role === 'admin' && (
                      <MobileNavLink
                        id="mobile-nav-admin"
                        to="/admin/events"
                        icon="⚙️"
                        label="Quản trị"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    )}
                    <div
                      className="my-2"
                      style={{ height: '1px', backgroundColor: THEME_COLORS.BORDER }}
                    />
                    <button
                      id="mobile-nav-logout"
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded transition-all duration-150 text-left"
                      style={{ fontFamily: TYPOGRAPHY.BODY, color: '#FF6666' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,0,0,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      🚪&nbsp;{t('nav.logout') || 'Đăng xuất'}
                    </button>
                  </>
                ) : (
                  <Link
                    id="mobile-nav-login"
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded font-bold uppercase tracking-widest text-sm text-center justify-center"
                    style={{
                      fontFamily: TYPOGRAPHY.BODY,
                      color: THEME_COLORS.SECONDARY,
                      border: `1px solid ${THEME_COLORS.SECONDARY}`,
                      boxShadow: SHADOWS.NEON_SECONDARY,
                    }}
                  >
                    {t('nav.initialize') || 'Đăng nhập'}
                  </Link>
                )}
              </nav>

              {/* Language toggle (mobile) */}
              <div className="mt-auto">
                <p
                  style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.TEXT_MUTED, fontSize: '0.6rem' }}
                  className="uppercase tracking-widest mb-3"
                >
                  // LANGUAGE_SELECTOR
                </p>
                <LanguageToggle lang={lang} changeLanguage={changeLanguage} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/** Helper: Link item trong mobile menu */
const MobileNavLink = ({ id, to, icon, label, badge, onClick }) => (
  <Link
    id={id}
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 rounded transition-all duration-150"
    style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = `rgba(255,0,255,0.08)`;
      e.currentTarget.style.color = THEME_COLORS.WHITE;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = THEME_COLORS.TEXT_MUTED;
    }}
  >
    <span>
      {icon}&nbsp;{label}
    </span>
    {badge && (
      <span
        style={{
          fontFamily: TYPOGRAPHY.TECH,
          color: THEME_COLORS.ACCENT,
          fontSize: '0.6rem',
          border: `1px solid ${THEME_COLORS.ACCENT}`,
        }}
        className="px-1.5 py-0.5 rounded"
      >
        {badge}
      </span>
    )}
  </Link>
);

export default NavBar;