/**
 * EventCard.jsx — Module: UI | Flash Sale Project
 * Displays individual event cards with progress bars and dynamic booking buttons.
 */

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { THEME_COLORS, TYPOGRAPHY, SHADOWS } from "../constants/uiConstants.js";
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
  const { user } = useAuth();
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

  const available = localAvailable;
  const total = event.totalTickets || 1;
  const soldTickets = Math.max(0, total - available);
  const progressPercentage = Math.round((soldTickets / total) * 100);

  // Đồng bộ số lượng vé khi đặt thành công từ hook
  useEffect(() => {
    if (isCompleted) {
      setLocalDecrement(prev => prev + 1);
    }
  }, [isCompleted]);

  const handleBooking = async () => {
    if (isFailed) {
      reset();
      return;
    }

    if (available === 0 || !isIdle) return;

    // Check authentication
    if (!user) {
      // Logic redirect đã có trong hook nhưng ở đây vẫn giữ t để hiện thông báo UI
      // thực tế hook sẽ gọi window.location.href = "/login"
      bookTicket(event._id); 
      return;
    }

    bookTicket(event._id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group rounded-2xl overflow-hidden border border-white/10 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-secondary/50 shadow-2xl flex flex-col h-full"
      style={{ boxShadow: `0 0 30px ${THEME_COLORS.PRIMARY}05` }}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl || "https://placehold.co/600x400/090014/FF00FF?text=Event+Image"}
          alt={event.title}
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
              {available === 0 ? t("card_sold_out") : "LIVE"}
            </span>
            {event.isHot && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/20 border border-primary/50 text-primary animate-pulse text-center">
                🔥 {t("card_hot_badge")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 grow flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3
            className="text-xl font-black text-white leading-tight uppercase tracking-tight truncate"
            style={{ fontFamily: TYPOGRAPHY.HEADING }}
          >
            {event.title}
          </h3>
          <span className="shrink-0 text-[10px] font-mono p-1 border border-secondary/40 text-secondary bg-secondary/5">
            {t("card_id")}: {event._id?.slice(-4).toUpperCase()}
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
        <div className="mt-auto">
          <motion.button
            whileHover={available > 0 && bookingStatus === "idle" ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={handleBooking}
            disabled={available === 0 || bookingStatus === "completed" || bookingStatus === "queued" || bookingStatus === "submitting"}
            className={`w-full py-3.5 font-black uppercase tracking-[0.2em] text-[10px] transition-all border-2 flex items-center justify-center gap-2 ${
              available === 0
                ? "border-white/10 text-white/20 cursor-not-allowed"
                : isCompleted
                  ? "border-green-500 text-green-400 bg-green-500/10"
                  : isQueued
                    ? "border-primary text-primary animate-pulse" // Task 4.3: animate-pulse when queued
                    : "border-primary text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(255,0,255,0.2)]"
            }`}
            style={{ fontFamily: TYPOGRAPHY.HEADING }}
          >
            {bookingStatus === "idle" && (
              <>{available === 0 ? t("card_sold_out") : `🎟️ ${t("card_book_now")}`}</>
            )}
            {bookingStatus === "submitting" && <span>{t("card_requesting")}</span>}
            {isQueued && (
              <span className="uppercase">{t("card_in_queue")}</span>
            )}
            {isCompleted && t("card_success")}
            {isFailed && t("card_retry")}
          </motion.button>

          {bookingStatus === "failed" && (
            <button
              onClick={reset}
              className="w-full mt-2 py-2 text-[10px] font-mono text-secondary hover:text-white transition-colors"
            >
              [ {t("card_retry")} ]
            </button>
          )}

          {errorLocal && (
            <p className="mt-3 text-[9px] text-red-500 font-mono text-center uppercase tracking-tighter">
              ⚠️ {errorLocal}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
