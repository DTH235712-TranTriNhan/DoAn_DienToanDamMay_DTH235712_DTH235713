import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import useEvents from "../hooks/useEvents";
import { THEME_COLORS } from "../constants/uiConstants";

const EventsPage = () => {
  const { events, loading, error } = useEvents();

  // Trạng thái 1: Loading
  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 border-l-4 border-secondary pl-6">
          <div className="h-10 bg-secondary/10 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-4 bg-secondary/5 rounded w-1/2 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Trạng thái 2: Lỗi API
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 border-2 border-primary bg-[#1a103c]/90 text-center relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/5 blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="text-5xl block mb-6 animate-[bounce_2s_infinite]">⚠️</span>
          <h2 className="text-2xl font-heading font-black text-primary mb-4 tracking-widest uppercase">
            &gt; SYSTEM_ERROR_DETECTED
          </h2>
          <p className="text-foreground/80 font-mono text-sm border border-primary/20 p-4 bg-black/40">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "transparent",
              borderColor: THEME_COLORS.SECONDARY,
              color: THEME_COLORS.SECONDARY
            }}
            className="mt-8 px-6 py-2 border font-mono text-xs uppercase tracking-[0.2em] transition-all hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
          >
            [ REBOOT_INTERFACE ]
          </button>
        </div>
      </div>
    );
  }

  // Trạng thái 3: Empty (Không có dữ liệu)
  if (!events || events.length === 0) {
    return (
      <div className="text-center mt-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <span className="text-6xl block mb-8 grayscale opacity-50">📭</span>
          <h2 className="text-3xl font-heading font-black text-secondary/60 mb-4 tracking-widest uppercase">
            &gt; ZERO_SEQUENCES_FOUND_IN_GRID
          </h2>
          <p className="text-foreground/40 font-mono text-sm">
            PLEASE_STANDY_BY_FOR_NEXT_TRANSMISSION...
          </p>
        </div>
      </div>
    );
  }

  // Trạng thái 4: Render Grid thành công
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 border-l-4 border-secondary pl-6 relative">
        {/* Neon accent */}
        <div className="absolute -left-[6px] top-0 bottom-0 w-[8px] bg-secondary shadow-[0_0_15px_#00FFFF]"></div>

        <h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-widest uppercase items-center flex gap-4">
          LIVE_STREAMS
          <div className="flex gap-1 h-3">
            <div className="w-2 h-full bg-primary animate-[pulse_1s_infinite]"></div>
            <div className="w-2 h-full bg-primary animate-[pulse_1s_infinite_200ms]"></div>
            <div className="w-2 h-full bg-primary animate-[pulse_1s_infinite_400ms]"></div>
          </div>
        </h1>
        <p className="text-secondary/60 mt-4 font-mono uppercase text-xs tracking-widest flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          ACCESSING_EVENTS_FEED_SUCCESSFUL
        </p>
      </div>

      {/* Grid: 1 cột (mobile), 2 cột (tablet), 3 cột (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <EventCard key={event._id || event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
