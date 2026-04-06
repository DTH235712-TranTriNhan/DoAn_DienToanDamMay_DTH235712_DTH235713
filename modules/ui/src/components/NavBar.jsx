import { Link } from 'react-router-dom';
import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext.jsx';

const NavBar = ({ user }) => {
  const { t, lang, changeLanguage } = useContext(LanguageContext);

  return (
    <nav className="bg-card backdrop-blur-md border-b-2 border-primary shadow-[0_0_15px_rgba(255,0,255,0.4)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Vaporwave Style */}
          <div className="shrink-0">
            <Link to="/" className="font-heading text-2xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
              EVENT<span className="text-secondary">HUB</span>_
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/my-tickets" className="text-secondary hover:text-white hover:drop-shadow-[0_0_8px_#00FFFF] transition-all font-sans uppercase tracking-widest text-xs font-bold">
                  &gt; {t("nav.myTickets")}
                </Link>
                
                <div className="flex items-center space-x-3 border-l-2 border-border pl-6">
                  <div className="p-1 border border-secondary shadow-[0_0_5px_#00FFFF]">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=FF00FF&color=00FFFF`}
                      alt="Avatar"
                      className="w-8 h-8 filter contrast-125 grayscale-20"
                    />
                  </div>
                  <span className="text-xs font-sans font-bold text-primary uppercase animate-pulse">{user.name}</span>
                </div>

                <button className="text-foreground hover:text-primary transition-colors uppercase tracking-widest text-xs font-sans font-bold">
                  [ {t("nav.logout")} ]
                </button>
              </>
            ) : (
              /* Outrun Skewed Button */
              <Link
                to="/login"
                className="group relative -skew-x-12 transform border-2 border-secondary bg-transparent px-6 py-2 transition-all duration-200 hover:skew-x-0 hover:bg-secondary hover:shadow-[0_0_20px_#00FFFF]"
              >
                <span className="inline-block skew-x-12 transform font-sans text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-black transition-all">
                  {t("nav.initialize")}
                </span>
              </Link>
            )}

            {/* Language Toggle */}
            <div className="flex items-center space-x-2 border-l-2 border-primary/30 pl-6 ml-6 font-mono text-xs">
              <button
                onClick={() => changeLanguage("vi")}
                className={`transition-all px-2 py-1 ${lang === "vi" ? "bg-primary text-black font-bold shadow-[0_0_10px_#00FFFF]" : "text-white/50 hover:text-white"}`}
              >
                VN
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => changeLanguage("en")}
                className={`transition-all px-2 py-1 ${lang === "en" ? "bg-secondary text-white font-bold shadow-[0_0_10px_#FF00FF]" : "text-white/50 hover:text-white"}`}
              >
                EN
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default NavBar;