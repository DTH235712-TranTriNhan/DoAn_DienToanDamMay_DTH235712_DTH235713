import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEME_COLORS, TYPOGRAPHY, SHADOWS } from "../constants/uiConstants.js";
import { useLanguage } from "../context/LanguageContext.jsx";

/**
 * EventBanner.jsx — Module: UI | Flash Sale Project
 * Component Banner động hiển thị các sự kiện nổi bật (isHot: true).
 * Tối ưu: i18n toàn diện, Hiệu ứng Cyberpunk Premium, Framer Motion mượt mà.
 */
const EventBanner = ({ events = [], loading = false }) => {
  const { t, lang } = useLanguage();

  const hotEvents = events.filter(event => event.isHot);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (hotEvents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % hotEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hotEvents.length]);

  if (loading) return <BannerSkeleton />;

  if (hotEvents.length === 0) return null;

  const currentEvent = hotEvents[currentIndex];

  return (
    <div className="relative h-[350px] md:h-[480px] w-full overflow-hidden rounded-3xl mb-12 border border-white/10 shadow-2xl group">
      {/* Scanline Overlay Effect - Tăng tính Cyberpunk */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
        style={{
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%"
        }}
      />

      {/* Progress Bar (Timer) - Neon Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-30">
        <motion.div
          key={`progress-${currentIndex}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full"
          style={{
            backgroundColor: THEME_COLORS.PRIMARY,
            boxShadow: SHADOWS.NEON_PRIMARY
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent._id || currentEvent.id}
          initial={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          {/* Background Image với hiệu ứng Ken Burns */}
          <img
            src={
              currentEvent.imageUrl || "https://placehold.co/1200x600/090014/FF00FF?text=Hot+Event"
            }
            alt={currentEvent.title}
            className="w-full h-full object-cover transition-transform duration-10000 ease-linear group-hover:scale-110"
          />

          {/* Overlay gradient đa tầng để làm nổi bật nội dung */}
          <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="max-w-xl"
            >
              {/* Badge Hot - i18n optimized */}
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="px-3 py-1 bg-primary text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-sm shadow-neon-primary animate-pulse"
                  style={{ fontFamily: TYPOGRAPHY.TECH, boxShadow: SHADOWS.NEON_PRIMARY }}
                >
                  🔥 [ {t("events_hot_title")} ]
                </span>
                <div className="h-px w-24 bg-linear-to-r from-primary/50 to-transparent" />
              </div>

              {/* Title - Orbitron Heading */}
              <h2
                className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] uppercase tracking-tighter"
                style={{
                  fontFamily: TYPOGRAPHY.HEADING,
                  textShadow: `0 0 40px ${THEME_COLORS.PRIMARY_GLOW}, 2px 2px 0px ${THEME_COLORS.SECONDARY}`
                }}
              >
                {currentEvent.title}
              </h2>

              {/* Description - i18n & Body Font */}
              <p
                className="text-white/80 text-sm md:text-base mb-10 line-clamp-2 md:line-clamp-3 border-l-4 border-primary pl-6 backdrop-blur-md bg-white/5 py-3 pr-6 rounded-r-xl"
                style={{ fontFamily: TYPOGRAPHY.BODY }}
              >
                {currentEvent.description}
              </p>

              {/* Action Area - i18n & Tech Font */}
              <div className="flex flex-wrap items-center gap-8">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: SHADOWS.NEON_SECONDARY }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-secondary text-black font-black uppercase text-xs tracking-[0.3em] shadow-neon-secondary transition-all"
                  style={{ fontFamily: TYPOGRAPHY.TECH, boxShadow: SHADOWS.NEON_SECONDARY }}
                >
                  {t("card_book_now")}
                </motion.button>

                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex flex-col">
                    <span
                      className="text-[10px] uppercase font-black text-secondary/60 tracking-[0.2em]"
                      style={{ fontFamily: TYPOGRAPHY.TECH }}
                    >
                      {t("card_location")}
                    </span>
                    <span className="text-sm font-bold truncate max-w-[180px]">
                      {currentEvent.location}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="flex flex-col">
                    <span
                      className="text-[10px] uppercase font-black text-secondary/60 tracking-[0.2em]"
                      style={{ fontFamily: TYPOGRAPHY.TECH }}
                    >
                      {t("card_date")}
                    </span>
                    <span className="text-sm font-bold">
                      {new Date(currentEvent.date).toLocaleDateString(
                        lang === "vi" ? "vi-VN" : "en-US",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators - Neon Style */}
      {hotEvents.length > 1 && (
        <div className="absolute bottom-10 right-16 flex gap-4 z-20">
          {hotEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group py-2 outline-none"
            >
              <div
                className={`h-2 transition-all duration-500 rounded-full ${
                  index === currentIndex
                    ? "w-12 bg-primary shadow-neon-primary"
                    : "w-4 bg-white/30 group-hover:bg-white/60"
                }`}
                style={index === currentIndex ? { boxShadow: SHADOWS.NEON_PRIMARY } : {}}
              />
            </button>
          ))}
        </div>
      )}

      {/* Trang trí góc Cyberpunk - Nâng cấp chi tiết kỹ thuật */}
      <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-60px] right-[-60px] w-[120px] h-[120px] border-2 border-primary/40 rotate-45" />
        <div className="absolute top-2 right-10 text-[8px] font-mono text-primary/40 tracking-widest vertical-text uppercase">
          HOT_EVENT_STREAM_V3.0
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute bottom-[-40px] left-[-40px] w-[80px] h-[80px] border border-secondary/40 -rotate-45" />
      </div>
    </div>
  );
};

const BannerSkeleton = () => (
  <div className="w-full h-[350px] md:h-[480px] bg-white/5 rounded-3xl animate-pulse flex flex-col justify-center px-16 border border-white/5 mb-12 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent" />
    <div className="h-6 bg-primary/20 rounded w-1/4 mb-10" />
    <div className="h-20 bg-white/10 rounded w-3/4 mb-6" />
    <div className="h-4 bg-white/5 rounded w-1/2 mb-12" />
    <div className="h-14 bg-primary/20 rounded w-48" />
  </div>
);

export default EventBanner;
