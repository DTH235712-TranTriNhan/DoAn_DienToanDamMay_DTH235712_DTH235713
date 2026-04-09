/**
 * EventCard.jsx — Module: UI | Flash Sale Project
 * Displays individual event cards with progress bars and dynamic booking buttons.
 */

import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { THEME_COLORS, TYPOGRAPHY, SHADOWS, BOOKING_UI_CONFIG } from "../constants/uiConstants.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBookTicket } from "../hooks/useBookTicket.js";
import api from "../services/api.js";

const EventCard = ({ event }) => {
  const { 
    bookTicket, 
    status: bookingStatus, 
    error: errorLocal, 
    isIdle,
    isSubmitting,
    isQueued,
    isCompleted,
    isFailed,
    reset
  } = useBookTicket();

  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [localDecrement, setLocalDecrement] = useState(0);
  
  const baseAvailable = event.availableTickets || 0;
  const localAvailable = Math.max(0, baseAvailable - localDecrement);

  const formattedDate = useMemo(() => {
    if (!event?.date) return t("card_tba");
    return new Date(event.date).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }, [event.date, lang, t]);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND"
    }).format(event.price || 0);
  }, [event.price, lang]);

  const available = localAvailable;
  const total = event.totalTickets || 1;
  const soldTickets = Math.max(0, total - available);
  const progressPercentage = Math.round((soldTickets / total) * 100);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/600x400/090014/00FFFF?text=IMAGE+NOT+FOUND";
  };

  // Đồng bộ số lượng vé khi đặt thành công từ hook
  useEffect(() => {
    if (isCompleted) {
      setLocalDecrement(prev => prev + 1);
    }
  }, [isCompleted]);

  // Tự động ẩn thông báo lỗi sau 4 giây bằng cách reset
  useEffect(() => {
    let timer;
    if (isFailed && errorLocal) {
      timer = setTimeout(() => {
        reset();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isFailed, errorLocal, reset]);



  const handleBooking = async () => {
    if (isFailed) {
      reset();
      return;
    }

    if (available === 0 || !isIdle) return;

    // Check authentication
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    console.log(`[UI] Bắt đầu đặt vé cho sự kiện: ${event._id}`);
    bookTicket(event._id);
  };

  // Logic nút bấm dựa trên cấu hình tập trung
  const getButtonConfig = () => {
    if (available === 0 && bookingStatus === "idle") return BOOKING_UI_CONFIG.sold_out;
    const config = { ...(BOOKING_UI_CONFIG[bookingStatus] || BOOKING_UI_CONFIG.idle) };
    
    // Resolve label using t hook
    config.label = t(config.labelKey);

    // Nếu failed, hiển thị lý do rút gọn ngay trên nút
    if (bookingStatus === "failed" && errorLocal) {
      const shortError = errorLocal.length > 15 ? errorLocal.substring(0, 15) + "..." : errorLocal;
      config.label = `❌ ${shortError} - ${t("card_retry")}`;
    }
    
    return config;
  };

  const btnConfig = getButtonConfig();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group rounded-2xl overflow-hidden border border-white/10 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-secondary/50 shadow-2xl flex flex-col h-full"
      style={{ boxShadow: `0 0 30px ${THEME_COLORS.PRIMARY}05` }}
    >
      {/* Event Image */}
      {/* Event Image */}
      <Link to={`/events/${event._id}`} className="relative h-48 overflow-hidden block">
        <img
          src={event.imageUrl || "https://placehold.co/600x400/090014/FF00FF?text=Event+Image"}
          alt={event.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 right-4 z-20">
          <div className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                available === 0
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-secondary/20 border-secondary/50 text-secondary"
              }`}
            >
              {available === 0 ? t("card_sold_out") : t("status_live")}
            </span>
            {event.isHot && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/20 border border-primary/50 text-primary animate-pulse text-center">
                🔥 {t("card_hot_badge")}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-6 grow flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4 gap-2">
          <Link to={`/events/${event._id}`} className="block hover:text-secondary transition-colors overflow-hidden">
            <h3
              className="text-xl font-black text-white leading-tight uppercase tracking-tight whitespace-normal break-words line-clamp-2"
              style={{ fontFamily: TYPOGRAPHY.HEADING }}
            >
              {event.title}
            </h3>
          </Link>
          <span className="shrink-0 text-[10px] font-mono p-1 border border-secondary/40 text-secondary bg-secondary/5 self-start">
            {t("card_id")}: {String(event._id).slice(-4).toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">{t("card_price")}:</span>
          <span className="text-lg font-black text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
            {formattedPrice}
          </span>
        </div>

        <p
          className="text-foreground/70 text-sm mb-6 line-clamp-2 leading-relaxed border-l-2 border-secondary/20 pl-3"
          style={{ fontFamily: TYPOGRAPHY.BODY }}
        >
          {event.description}
        </p>

        <div
          className="space-y-2 text-xs text-secondary/80 mb-6"
          style={{ fontFamily: TYPOGRAPHY.TECH }}
        >
          <div className="flex items-center gap-2">
            <span className="opacity-70">📅</span> {formattedDate}
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="opacity-70">📍</span> {event.location}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-[10px] font-mono mb-2 uppercase">
            <span className="text-foreground/40">
              {t("card_tickets_sold")} {progressPercentage}%
            </span>
            <span className={available < 50 ? "text-primary animate-pulse" : "text-secondary"}>
              {t("card_left")} {available}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-linear-to-r from-secondary to-primary shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto relative z-10">
          <div className="flex items-center gap-2 w-full">
            <motion.button
              whileHover={available > 0 && bookingStatus === "idle" ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              disabled={available === 0 || bookingStatus === "completed" || bookingStatus === "queued" || bookingStatus === "submitting"}
              className={`w-full grow py-3.5 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 flex items-center justify-center gap-2 border-2 ${btnConfig.className}`}
              style={{ fontFamily: TYPOGRAPHY.HEADING }}
            >
              {btnConfig.label}
            </motion.button>
          </div>
        </div>

        {/* Custom Notification Error System (Full Card Overlay) */}
        {isFailed && errorLocal && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md border-l-4 border-pink-600 p-6 overflow-hidden"
          >
            {/* Cyberpunk Scanning Line */}
            <motion.div
              animate={{ y: [-100, 400] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-pink-500/50 shadow-[0_0_15px_#ec4899] z-0"
            />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
               <h4 className="text-pink-600 font-black text-lg font-mono uppercase tracking-widest drop-shadow-[0_0_8px_rgba(219,39,119,0.5)]">
                 [{t("details_booking_failed")}]
               </h4>
               <p className="text-pink-300 text-xs font-mono uppercase">
                 {errorLocal}
               </p>
               <p className="text-pink-400/80 text-[10px] font-mono leading-relaxed mt-2 uppercase tracking-wider max-w-[85%]">
                 {t("details_msg_failed_hint")}
               </p>

               <button
                  onClick={reset}
                  className="mt-6 px-6 py-2 border-2 border-pink-600 text-pink-500 bg-transparent hover:bg-pink-600 hover:text-white text-[12px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.8)]"
                  style={{ fontFamily: TYPOGRAPHY.HEADING }}
                >
                  {t("card_retry")}
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
