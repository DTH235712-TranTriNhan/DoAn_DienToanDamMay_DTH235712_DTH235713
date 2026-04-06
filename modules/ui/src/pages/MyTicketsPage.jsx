/**
 * MyTicketsPage.jsx — Module: UI | Flash Sale Project
 * Page displaying the tickets owned by the current user.
 */

import { THEME_COLORS, TYPOGRAPHY } from "../constants/uiConstants.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const MyTicketsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="py-20 flex flex-col items-center px-4">
      <div className="relative p-1 border-2 border-secondary/50 bg-card/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.1)] max-w-2xl w-full rounded-sm">
        {/* Decorative corner accents */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary"></div>

        <div className="bg-secondary/10 px-6 py-5 border-b border-secondary/30 flex justify-between items-center">
          <h2 className="text-xl text-secondary tracking-[0.2em] uppercase font-black" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
            {t("tickets_title")}
          </h2>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-secondary"></div>
          </div>
        </div>

        <div className="p-12 text-center">
          <p className="font-bold text-foreground/70 text-sm mb-6 animate-pulse uppercase tracking-[0.4em]" style={{ fontFamily: TYPOGRAPHY.TECH }}>
            &gt; {t("tickets_querying")}
          </p>
          <div className="w-full h-px bg-linear-to-r from-transparent via-secondary/40 to-transparent my-8"></div>
          <p className="text-secondary/50 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: TYPOGRAPHY.BODY }}>
            {t("tickets_empty")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;
