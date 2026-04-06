import { TYPOGRAPHY } from "../constants/uiConstants.js";

const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
          <span>EventHub © 2026 — Đồ án Điện toán đám mây SEE910</span>
          <a
            href="#"
            className="hover:text-primary transition-colors border-b border-transparent hover:border-primary"
          >
            GitHub_Repository
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-white/10" />
          <span className="text-[9px] font-mono text-secondary/40 uppercase tracking-widest">
            Powered by MongoDB Atlas + Upstash Redis
          </span>
          <div className="h-px w-8 bg-white/10" />
        </div>

        <div className="mt-2 text-[8px] font-mono text-primary/30 uppercase tracking-[0.4em]">
          [ SYSTEM_STATUS: OPERATIONAL // PORT_8080 ]
        </div>
      </div>
    </footer>
  );
};

export default Footer;
