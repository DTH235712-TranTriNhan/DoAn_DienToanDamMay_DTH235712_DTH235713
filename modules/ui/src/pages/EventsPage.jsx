/**
 * EventsPage.jsx — Module: UI | Flash Sale Project
 * Home page displaying the event list (Banner + Grid).
 */

import EventBanner from "../components/EventBanner.jsx";
import EventCard from "../components/EventCard.jsx";
import EventCardSkeleton from "../components/EventCardSkeleton.jsx";
import useEvents from "../hooks/useEvents.js";
import { TYPOGRAPHY, THEME_COLORS } from "../constants/uiConstants.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { ROLES } from "../constants/roles.js";

const EventsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { events, loading, error, refetch } = useEvents();

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <EventBanner loading={true} />
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
      <div className="max-w-xl mx-auto mt-20 p-10 border border-primary/50 bg-black/80 backdrop-blur-xl text-center relative rounded-lg">
        <div className="relative z-10">
          <span className="text-5xl block mb-6 animate-pulse">📡</span>
          <h2 className="text-xl font-black text-primary mb-4 uppercase" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
            {t("events_error_sync")}
          </h2>
          <p className="text-foreground/60 font-mono text-[10px] border border-primary/20 p-4 bg-primary/5 mb-8">
            {error}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-2 border border-secondary text-secondary font-mono text-xs uppercase tracking-widest hover:bg-secondary/10 transition-all"
          >
            [ {t("events_reboot")} ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Dynamic Banner for Hot Events */}
      <EventBanner events={events} />

      <div id="event-grid-header" className="mb-12 border-l-4 border-secondary pl-6 relative">
        <div className="absolute -left-[4px] top-0 bottom-0 w-[4px] bg-secondary shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
          {t("events_all_title")}
        </h1>
        <p className="text-secondary/60 mt-4 font-mono font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
          {t("events_stable")} // {t("events_version")}
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center">
          <span className="text-6xl mb-6 opacity-20">📭</span>
          <p className="text-white/30 font-mono text-sm tracking-widest uppercase mb-8">
            {t("events_no_all")}
          </p>
          {user?.role === ROLES.ADMIN && (
            <Link 
              to="/admin/events" 
              className="px-8 py-3 bg-primary text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
              style={{ fontFamily: TYPOGRAPHY.TECH }}
            >
              {t("events_create_first")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
