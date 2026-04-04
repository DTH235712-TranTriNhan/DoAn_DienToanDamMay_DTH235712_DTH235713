import { THEME_COLORS, UI_SIZES } from "../constants/uiConstants";

const HeroSection = ({ featuredEvent, loading }) => {
  if (loading) return <HeroSkeleton />;

  if (!featuredEvent) return null;

  return (
    <section className="relative w-full overflow-hidden mb-12 rounded-3xl border border-white/10 group">
      {/* Background with Blur & Glow */}
      <div 
        className="absolute inset-0 z-0 scale-105 transition-transform duration-1000 group-hover:scale-110"
        style={{
          backgroundImage: `url(${featuredEvent.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          filter: "brightness(0.4) blur(4px)"
        }}
      ></div>

      {/* Decorative Neon Border Animation (Desktop Only for Performance) */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary to-transparent animate-[pan-right_3s_linear_infinite]"></div>
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-linear-to-r from-transparent via-secondary to-transparent animate-[pan-left_3s_linear_infinite]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 min-h-[400px] md:min-h-[450px] flex flex-col justify-center px-6 md:px-16 py-12 backdrop-blur-[2px]">
        {/* Featured Tag */}
        <div className="self-start px-3 py-1 bg-primary/20 border border-primary/50 text-white font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          FEATURED_SEQUENCE_DETECTION: ON
        </div>

        <h1 className="text-4xl md:text-7xl font-heading font-black text-white mb-6 uppercase tracking-tighter leading-tight max-w-4xl">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            {featuredEvent.title}
          </span>
        </h1>

        <p className="text-foreground/80 font-sans text-sm md:text-lg max-w-2xl mb-8 border-l-2 border-secondary/30 pl-4 leading-relaxed hidden sm:block">
          {featuredEvent.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          <button 
            className="px-8 py-4 bg-primary text-white font-heading font-bold uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)] transition-all active:scale-95 flex items-center gap-3 relative overflow-hidden"
          >
            <span className="relative z-10">🚀 Săn vé ngay</span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          </button>

          <div className="flex gap-8 text-xs md:text-sm font-mono text-secondary items-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest mb-1">DATE_COORD</span>
              <span className="font-bold">{new Date(featuredEvent.date).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-6">
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest mb-1">LOC_BASE</span>
              <span className="font-bold truncate max-w-[120px] md:max-w-none">{featuredEvent.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Overlay for Cyberpunk look */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03] z-10"></div>
    </section>
  );
};

const HeroSkeleton = () => (
  <div className="w-full h-[400px] md:h-[450px] bg-white/5 rounded-3xl animate-pulse flex flex-col justify-center px-16 border border-white/5 mb-12">
    <div className="h-6 bg-primary/20 rounded w-1/4 mb-8"></div>
    <div className="h-16 bg-white/10 rounded w-2/3 mb-6"></div>
    <div className="h-4 bg-white/5 rounded w-1/2 mb-10"></div>
    <div className="h-12 bg-primary/20 rounded w-48"></div>
  </div>
);

export default HeroSection;
