/**
 * EventsPage.jsx — Module: UI | Flash Sale Project
 * Home page displaying the event list (Banner + Grid).
 */

import EventBanner from "../components/EventBanner.jsx";
import { useState, useMemo } from "react";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Music", "Technology", "Esports", "Workshop", "Sports", "Theatre", "Other"];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || 
        event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

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
      {/* Dynamic Banner for Hot Events (BANNERDON*/}
      <EventBanner events={events} />

      <div id="event-grid-header" className="mb-12 border-l-4 border-secondary pl-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="absolute -left-[4px] top-0 bottom-0 w-[4px] bg-secondary shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
            {t("events_all_title")}
          </h1>
          <p className="text-secondary/60 mt-4 font-mono font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            {t("events_stable")} // {t("events_version")}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary/50 group-focus-within:text-secondary transition-colors">🔍</span>
          </div>
          <input
            type="text"
            placeholder={t("filter_search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 transition-all font-mono"
          />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-secondary/30 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
        </div>
      </div>

      {/* Category Filter (DAN)*/}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
              selectedCategory === cat
                ? "bg-secondary text-black border-secondary shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                : "bg-white/5 text-white/40 border-white/10 hover:border-white/30 hover:text-white"
            }`}
            style={{ fontFamily: TYPOGRAPHY.TECH }}
          >
            {cat === "All" ? t("filter_all") : t(`category_${cat.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center">
          <span className="text-6xl mb-6 opacity-20">📭</span>
          <p className="text-white/30 font-mono text-sm tracking-widest uppercase mb-8">
            {searchTerm || selectedCategory !== "All" ? t("events_no_all") : t("events_no_all")}
          </p>
          {user?.role === ROLES.ADMIN && !searchTerm && selectedCategory === "All" && (
            <Link 
              to="/admin/events" 
              className="px-8 py-3 bg-primary text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
              style={{ fontFamily: TYPOGRAPHY.TECH }}
            >
              {t("events_create_first")}
            </Link>
          )}
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="px-6 py-2 border border-secondary text-secondary font-mono text-[10px] uppercase tracking-widest hover:bg-secondary/10 transition-all"
            >
              [ RESET_FILTERS ]
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
