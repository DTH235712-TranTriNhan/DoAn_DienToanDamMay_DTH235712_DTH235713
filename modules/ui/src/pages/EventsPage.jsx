import HeroSection from "../components/HeroSection.jsx";
import EventCard from "../components/EventCard.jsx";
import EventCardSkeleton from "../components/EventCardSkeleton.jsx";
import useEvents from "../hooks/useEvents.js";
import { TYPOGRAPHY } from "../constants/uiConstants.js";

const EventsPage = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <HeroSection loading={true} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 border border-primary/50 bg-black/80 backdrop-blur-xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-6xl block mb-6 animate-pulse">📡</span>
          <h2 className="text-2xl font-black text-primary mb-4 tracking-tighter uppercase" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
            &gt; SYSTEM_SYNC_ERROR
          </h2>
          <p className="text-foreground/60 font-mono text-xs border border-primary/20 p-4 bg-primary/5 mb-8">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-secondary text-secondary font-mono text-xs uppercase tracking-widest hover:bg-secondary/10 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          >
            [ REBOOT_PROTOCOL ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Dynamic Hero Slider */}
      <HeroSection events={events} />

      <div className="mb-12 border-l-4 border-secondary pl-6 relative">
        <div className="absolute -left-[6px] top-0 bottom-0 w-[8px] bg-secondary shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase items-center flex gap-4" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
          LIVE_SEQUENCE_GRID
        </h1>
        <p className="text-secondary/60 mt-4 font-mono font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
          CONNECTION_STABLE // VERSION_2.0_REFRESH
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event._id || event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
