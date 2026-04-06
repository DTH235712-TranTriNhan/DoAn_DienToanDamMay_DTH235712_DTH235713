import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { THEME_COLORS, TYPOGRAPHY, SHADOWS } from "../constants/uiConstants.js";

/**
 * LoginPage.jsx — Module: UI | Flash Sale Project
 * Trang Đăng nhập phong cách Cyberpunk Terminal với hiệu ứng chữ chạy.
 */
const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const fullText = t("login_terminal") || "";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Terminal typing effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [fullText]);

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/google?origin=${window.location.origin}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 relative">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 z-0 bg-scanline opacity-[0.03] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-background/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        style={{ boxShadow: SHADOWS.CARD }}
      >
        {/* Neon Glow Accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Terminal Section */}
        <div className="mb-10 bg-black/40 p-5 rounded-xl border border-white/5 font-mono text-[11px] h-32 overflow-hidden relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-secondary/60 tracking-widest uppercase">System_Entry_Auth</span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="text-primary/90 leading-relaxed whitespace-pre-wrap">
            {displayText}
            <span className="animate-pulse">_</span>
          </div>
        </div>
        
        <div className="relative z-10 text-center mb-10">
          <h1 
            className="text-4xl font-black text-white tracking-tighter mb-2 uppercase"
            style={{ fontFamily: TYPOGRAPHY.HEADING }}
          >
            Event<span className="text-primary italic">Hub</span>
          </h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest" style={{ fontFamily: TYPOGRAPHY.TECH }}>
            // {t('login_subtitle')}
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-xl transition-all shadow-xl"
            style={{ fontFamily: TYPOGRAPHY.BODY }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="tracking-widest uppercase text-xs">{t('login_btn_google')}</span>
          </motion.button>
        </div>

        {/* Security Footer Details */}
        <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
            <span>{t('login_encryption')}</span>
            <span>{t('login_protocol')}</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black" style={{ fontFamily: TYPOGRAPHY.TECH }}>
              {t('login_secure_protocol')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Decorative Outer Corner */}
      <div className="absolute top-0 right-0 w-64 h-64 border-t-2 border-r-2 border-primary/20 pointer-events-none opacity-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 border-b-2 border-l-2 border-secondary/20 pointer-events-none opacity-20" />
    </div>
  );
};

export default LoginPage;