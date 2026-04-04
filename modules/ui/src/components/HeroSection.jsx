import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEME_COLORS, TYPOGRAPHY } from "../constants/uiConstants.js";

const HeroSection = ({ events = [], loading }) => {
  const featuredEvents = events.filter(e => e.isFeatured);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredEvents.length]);

  if (loading) return <HeroSkeleton />;
  if (featuredEvents.length === 0) return null;

  const currentEvent = featuredEvents[currentIndex];

  return (
    <section className="relative w-full overflow-hidden mb-12 rounded-3xl border border-white/10 group min-h-[500px] flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent._id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentEvent.imageUrl})`,
              filter: "brightness(0.3) blur(2px)"
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 px-8 md:px-20 py-16 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/50 text-white font-mono text-[10px] uppercase tracking-widest mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          FEATURED_SEQUENCE_DETECTED
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentEvent._id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 
              className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight"
              style={{ fontFamily: TYPOGRAPHY.HEADING }}
            >
              <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                {currentEvent.title}
              </span>
            </h1>
            <p className="text-foreground/80 font-sans text-sm md:text-lg max-w-2xl mb-10 border-l-2 border-secondary/30 pl-4 leading-relaxed line-clamp-3">
              {currentEvent.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 0, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-3"
            style={{ fontFamily: TYPOGRAPHY.HEADING }}
          >
            🎟️ Săn vé ngay
          </motion.button>

          {/* Slider Indicators */}
          {featuredEvents.length > 1 && (
            <div className="flex gap-2">
              {featuredEvents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-12 h-1 transition-all duration-300 ${
                    i === currentIndex ? "bg-secondary w-16" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03] z-10" />
    </section>
  );
};

const HeroSkeleton = () => (
  <div className="w-full h-[500px] bg-white/5 rounded-3xl animate-pulse flex flex-col justify-center px-16 border border-white/5 mb-12">
    <div className="h-6 bg-primary/20 rounded w-1/4 mb-10" />
    <div className="h-20 bg-white/10 rounded w-3/4 mb-6" />
    <div className="h-4 bg-white/5 rounded w-1/2 mb-12" />
    <div className="h-14 bg-primary/20 rounded w-48" />
  </div>
);

export default HeroSection;
