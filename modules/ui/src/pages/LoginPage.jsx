import { useState, useEffect, useContext } from "react";
import { THEME_COLORS } from "../constants/uiConstants";
import LanguageContext from "../context/LanguageContext.jsx";

const LoginPage = () => {
  const { t } = useContext(LanguageContext);
  const [text, setText] = useState("");
  const fullText = t("login.terminal");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="py-20 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-lg relative">
        {/* Terminal Header */}
        <div className="bg-[#1a103c]/90 border-2 border-primary/50 shadow-[0_0_20px_rgba(255,0,255,0.2)] rounded-t-lg overflow-hidden">
          <div className="bg-primary/20 border-b border-primary/30 px-4 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/60"></div>
              <div className="w-3 h-3 rounded-full bg-secondary/60"></div>
              <div className="w-3 h-3 rounded-full bg-accent/60"></div>
            </div>
            <span className="font-mono text-[10px] text-primary/80 tracking-widest uppercase">
              {t("login.secureLogin")}
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-8 font-mono text-sm min-h-[160px] whitespace-pre-wrap leading-relaxed shadow-inner">
            <span className="text-secondary drop-shadow-[0_0_5px_#00FFFF]">{text}</span>
            <span className="inline-block w-2 h-4 bg-secondary ml-1 animate-pulse align-middle"></span>
          </div>
        </div>

        {/* Login Action Area */}
        <div className="bg-black/40 border-x-2 border-b-2 border-primary/50 rounded-b-lg p-8 flex flex-col items-center">
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "transparent",
              borderColor: THEME_COLORS.PRIMARY,
              boxShadow: `0 0 15px ${THEME_COLORS.PRIMARY}40`
            }}
            className="group relative px-8 py-4 border-2 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_#FF00FF] hover:bg-primary/10 w-full"
          >
            {/* Hover fill effect */}
            <div className="absolute inset-0 w-0 bg-primary/20 transition-all duration-500 group-hover:w-full"></div>

            <div className="relative flex items-center justify-center gap-3">
              {/* Fake Google Icon (Simplified) */}
              <svg className="w-5 h-5 group-hover:animate-spin" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-heading font-black text-primary tracking-[0.2em] uppercase text-base drop-shadow-[0_0_5px_#FF00FF]">
                {t("login.button")}
              </span>
            </div>
          </button>

          <div className="mt-6 flex justify-between w-full text-[10px] uppercase tracking-widest text-primary/40 font-mono">
            <span>&gt; {t("login.encryption")}</span>
            <span>&gt; {t("login.protocol")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
