import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { THEME_COLORS, TYPOGRAPHY } from "../constants/uiConstants.js";

const EventCard = ({ event }) => {
  const [bookingStatus, setBookingStatus] = useState("idle");

  const formattedDate = useMemo(() => {
    if (!event?.date) return "TBA";
    return new Date(event.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }, [event.date]);

  const available = event.availableTickets || 0;
  const total = event.totalTickets || 1;
  const soldTickets = Math.max(0, total - available);
  const progressPercentage = Math.round((soldTickets / total) * 100);

  const handleBooking = () => {
    if (available === 0 || bookingStatus !== "idle") return;
    setBookingStatus("submitting");
    setTimeout(() => setBookingStatus("queued"), 1500);
    setTimeout(() => setBookingStatus("completed"), 4000);
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
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
            available === 0 ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-secondary/20 border-secondary/50 text-secondary"
          }`}>
            {available === 0 ? "SOLD_OUT" : "LIVE_NOW"}
          </span>
        </div>
      </div>

      <div className="p-6 grow flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 
            className="text-xl font-black text-white leading-tight uppercase tracking-tight line-clamp-2"
            style={{ fontFamily: TYPOGRAPHY.HEADING }}
          >
            {event.title}
          </h3>
          <span className="shrink-0 text-[10px] font-mono p-1 border border-secondary/40 text-secondary bg-secondary/5 truncate max-w-[80px] whitespace-nowrap">
            ID: {event._id?.slice(-6).toUpperCase() || "UNK"}
          </span>
        </div>

        <p 
          className="text-foreground/70 text-sm mb-6 line-clamp-3 leading-relaxed border-l-2 border-secondary/20 pl-3"
          style={{ fontFamily: TYPOGRAPHY.BODY }}
        >
          {event.description}
        </p>

        <div className="space-y-3 text-xs text-secondary/80 mb-8" style={{ fontFamily: TYPOGRAPHY.TECH }}>
          <div className="flex items-center gap-3 font-bold">
            <span className="opacity-70">📅</span> {formattedDate}
          </div>
          <div className="flex items-center gap-3 font-bold truncate">
            <span className="opacity-70">📍</span> {event.location}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-[10px] font-mono mb-2 uppercase tracking-tighter">
            <span className="text-foreground/40">TICKETS_SOLD: {progressPercentage}%</span>
            <span className={available < 50 ? "text-primary animate-pulse" : "text-secondary"}>
              LEFT: {available}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-secondary to-primary shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <motion.button
            whileHover={available > 0 && bookingStatus === "idle" ? { 
              scale: 1.02, 
              boxShadow: `0 0 20px ${THEME_COLORS.PRIMARY_GLOW}` 
            } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={handleBooking}
            disabled={available === 0 || bookingStatus === "completed"}
            className={`w-full py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all border-2 flex items-center justify-center gap-2 ${
              available === 0 
                ? "border-white/10 text-white/20 cursor-not-allowed" 
                : bookingStatus === "completed"
                  ? "border-green-500 text-green-400 bg-green-500/10"
                  : "border-primary text-primary hover:bg-primary/10"
            }`}
            style={{ fontFamily: TYPOGRAPHY.HEADING }}
          >
            {bookingStatus === "idle" && (
              <>{available === 0 ? "STATUS: DEPLETED" : "🎟️ Đặt vé ngay"}</>
            )}
            {bookingStatus === "submitting" && <span className="animate-pulse">REQUESTING...</span>}
            {bookingStatus === "queued" && <span className="animate-bounce">IN_QUEUE...</span>}
            {bookingStatus === "completed" && "SUCCESS_CONFIRMED"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
