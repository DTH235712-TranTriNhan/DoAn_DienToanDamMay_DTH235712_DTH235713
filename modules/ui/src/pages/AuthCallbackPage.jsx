/**
 * AuthCallbackPage.jsx — Module: UI | Flash Sale Project
 * Handles JWT reception and synchronization from Google OAuth via URL parameters.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { THEME_COLORS, TYPOGRAPHY } from "../constants/uiConstants.js";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        try {
          await login(token);
          // Redirect to home page
          navigate("/", { replace: true });
        } catch (err) {
          setError(err.message || t('auth_error_token_fail'));
        }
      } else {
        setError(t('auth_error_no_token'));
      }
    };

    handleLogin();
  }, [navigate, login, t]);

  // UI for error states
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md w-full bg-red-950/20 backdrop-blur-xl p-10 rounded-lg border border-red-500/30">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-black text-red-500 mb-4 uppercase" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
            {t('auth_error_title')}
          </h2>
          <p className="text-slate-400 font-mono text-xs mb-8 p-3 bg-black/40 rounded border border-white/5">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-red-600 text-white font-bold rounded uppercase tracking-widest text-[10px]"
            style={{ fontFamily: TYPOGRAPHY.TECH }}
          >
            {t('auth_error_btn')}
          </button>
        </div>
      </div>
    );
  }

  // UI for processing state (Cyberpunk Loading)
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="relative mb-12">
        {/* Animated Rings */}
        <div className="w-24 h-24 border-2 border-primary/20 rounded-full animate-ping absolute inset-0"></div>
        <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <span className="text-2xl animate-pulse">🛰️</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-4" style={{ fontFamily: TYPOGRAPHY.HEADING }}>
        {t('auth_processing')}
      </h2>
      <p className="max-w-xs mx-auto text-secondary/60 font-mono text-[10px] tracking-widest uppercase leading-relaxed">
        {t('auth_subtext')}
      </p>
      
      {/* Decorative lines */}
      <div className="mt-8 flex gap-2">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full animate-shimmer" style={{ animationDelay: `${i*0.1}s` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
