/**
 * MyTicketsPage.jsx — Module: UI | Flash Sale Project
 * Page displaying the tickets owned by the current user.
 */

import { useEffect, useState } from "react";
import { THEME_COLORS, TYPOGRAPHY } from "../constants/uiConstants.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const MyTicketsPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await api.get("/tickets/my");
        setTickets(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || t("card_error_sync"));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user, t]);

  return (
    <div className="py-20 flex flex-col items-center px-4 max-w-4xl mx-auto w-full">
      <div className="relative p-1 border-2 border-secondary/50 bg-card/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.1)] w-full rounded-sm overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary"></div>

        <div className="bg-secondary/10 px-6 py-5 border-b border-secondary/30 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-xl text-secondary tracking-[0.2em] uppercase font-black" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
              {t("tickets_title")}
            </h2>
            <span className="text-[9px] text-white/40 font-mono">USER_ID: {user?._id?.toUpperCase()}</span>
          </div>
          <div className="flex gap-1.5">
            <div className={`h-2 w-2 rounded-full ${loading ? 'bg-primary animate-pulse' : 'bg-secondary'}`}></div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-bold text-foreground/70 text-sm animate-pulse uppercase tracking-[0.4em]" style={{ fontFamily: TYPOGRAPHY.TECH }}>
                &gt; {t("tickets_querying")}
              </p>
            </div>
          ) : error ? (
            <div className="py-10 text-center border border-red-500/20 bg-red-500/5 rounded">
              <p className="text-red-500 text-xs font-mono uppercase">{error}</p>
            </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-6">
              {tickets.map((ticket, index) => (
                <div 
                  key={ticket._id} 
                  className="group relative border border-white/5 bg-white/5 p-5 transition-all hover:bg-secondary/5 hover:border-secondary/30"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 font-bold rounded">#{index + 1}</span>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
                          {ticket.event?.title || "EVENT_UNKNOWN"}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-[10px] text-white/50 font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                           📅 {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US') : "TBA"}
                        </span>
                        <span className="flex items-center gap-1.5 max-w-[200px] truncate">
                           📍 {ticket.event?.location || "TBA"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <div className="text-right">
                        <p className="text-[8px] text-secondary/60 font-black tracking-widest uppercase mb-1">TICKET_HASH</p>
                        <p className="text-[10px] text-white/40 font-mono break-all">{ticket._id}</p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
               <div className="w-full h-px bg-linear-to-r from-transparent via-secondary/20 to-transparent my-8"></div>
               <p className="text-secondary/50 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: TYPOGRAPHY.BODY }}>
                {t("tickets_empty")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;
