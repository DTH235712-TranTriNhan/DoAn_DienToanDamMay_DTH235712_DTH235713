import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import useTicketDetails from '../hooks/useTicketDetails.js';
import useMyTickets from '../hooks/useMyTickets.js';
import { useBookTicket } from '../hooks/useBookTicket.js';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { THEME_COLORS, TYPOGRAPHY, SHADOWS, BOOKING_UI_CONFIG } from '../constants/uiConstants.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const TicketDetailsPage = () => {
  const { t, lang } = useLanguage();
  const { ticketId, eventId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { ticket, event, loading: ticketLoading, error, refresh } = useTicketDetails(ticketId, eventId);
  const { cancelTicket } = useMyTickets(); 
  const { bookTicket, status: bookingStatus, error: bookingError, reset: resetBooking } = useBookTicket(); 
  
  const [activeTab, setActiveTab] = useState('info');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Chỉ yêu cầu đăng nhập nếu đang truy cập vào đường dẫn "Vé của tôi" (ticketId)
    if (!authLoading && !isAuthenticated && ticketId) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, ticketId]);

  const handleCancel = async () => {
    setConfirmCancelOpen(false);
    try {
      await cancelTicket(ticketId);
      refresh(); 
    } catch (err) {
      setAlertMessage(t("details_error_cancel"));
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await bookTicket(event._id);
      setAlertMessage(t("details_success_book"));
    } catch (err) {
      setAlertMessage(t("details_error_book"));
    }
  };

  if (authLoading || ticketLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans tracking-widest" style={{ fontFamily: TYPOGRAPHY.BODY }}>
        <div className="text-secondary animate-pulse text-lg border border-secondary/50 px-8 py-4 rounded backdrop-blur-md shadow-neon-secondary">
          {t("tickets_querying")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" style={{ fontFamily: TYPOGRAPHY.BODY }}>
        <div className="max-w-md w-full border border-red-500 bg-red-500/10 p-8 rounded-lg text-center backdrop-blur-md">
          <h2 className="text-2xl font-black text-red-500 mb-4 uppercase">{t("auth_error_title")}</h2>
          <p className="text-foreground/80 mb-8">{error}</p>
          <button 
            onClick={() => navigate(ticketId ? '/my-tickets' : '/')}
            className="px-6 py-2 border border-secondary text-secondary font-bold uppercase tracking-widest hover:bg-secondary hover:text-black transition-all rounded"
          >
            {ticketId ? t("tickets_back") : t("nav_home")}
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isTicketMode = !!ticketId;
  
  const breadcrumbItems = isTicketMode 
    ? [
        { label: t("nav_myTickets").toUpperCase(), path: '/my-tickets' },
        { label: (event.title || t("card_id")).toUpperCase() }
      ]
    : [
        { label: (event.title || t("events_title")).toUpperCase() }
      ];
  const eventDate = event.date ? new Date(event.date).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : t("card_tba");

  const formattedPrice = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency: 'VND'
  }).format(event.price || 0);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/600x400/090014/00FFFF?text=IMAGE+NOT+FOUND";
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans" style={{ fontFamily: TYPOGRAPHY.BODY }}>
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        {/* Background Blur Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
          style={{ backgroundImage: `url(${event.imageUrl || 'https://via.placeholder.com/1200x600'})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className="relative max-w-7xl mx-auto h-full px-4 flex flex-col md:flex-row items-end pb-8 gap-8">
          <div className="absolute top-6 left-4 z-30 md:top-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          {/* Main Event Image */}
          <div className="hidden md:block w-72 h-96 flex-shrink-0 border-4 border-slate-800 rounded-lg shadow-2xl overflow-hidden translate-y-20 bg-slate-900">
             <img 
               src={event.imageUrl || 'https://via.placeholder.com/400x600'} 
               alt={event.title} 
               onError={handleImageError}
               className="w-full h-full object-cover" 
             />
          </div>
          
          <div className="flex-grow pb-4 md:pb-0">
            <button 
              onClick={() => navigate(isTicketMode ? '/my-tickets' : '/')}
              className="mb-4 flex items-center gap-2 text-secondary text-sm font-bold uppercase tracking-widest hover:text-secondary/80 transition-colors"
            >
              ← {isTicketMode ? t("tickets_back").toUpperCase() : t("details_nav_back").toUpperCase()}
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded backdrop-blur-sm bg-background/50 ${
                  (!isTicketMode || ticket?.status === 'confirmed') ? "text-green-400 border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]" :
                  ticket?.status === 'pending' ? "text-yellow-400 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]" :
                  "text-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
               }`}>
                  {isTicketMode ? t(`tickets_status_${ticket?.status || 'pending'}`).toUpperCase() : t("details_status_live")}
               </span>
               <span className="text-foreground/40 text-xs font-mono uppercase tracking-widest">
                {isTicketMode ? `${t("tickets_id")}: ${String(ticket?._id).slice(-8).toUpperCase()}` : `${t("details_event_id")}: ${String(event._id).slice(-8).toUpperCase()}`}
               </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] whitespace-normal break-words line-clamp-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm md:text-md text-foreground/80 font-medium">
               <div className="flex items-center gap-2">
                 <span className="text-secondary">📅</span> {eventDate}
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-secondary">📍</span> {event.location}
               </div>
            </div>
          </div>
          
          {/* QR Code Visual */}
          <div className="hidden lg:block w-48 h-48 bg-white p-3 rounded-lg border-4 border-secondary/50 shadow-neon-secondary relative group">
             <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-full h-full border-[6px] border-background relative overflow-hidden flex items-center justify-center bg-zinc-800">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_red] animate-[ping_2s_infinite]"></div>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-zinc-400 to-black"></div>
                <span className="text-white font-mono font-black text-[10px] break-all z-20 text-center tracking-tighter bg-black/70 p-1 rounded">
                   {String(ticket?._id || event._id || 'SCANNER').toUpperCase()}
                </span>
                <div className="w-6 h-6 border-4 border-white absolute top-1 left-1"></div>
                <div className="w-6 h-6 border-4 border-white absolute top-1 right-1"></div>
                <div className="w-6 h-6 border-4 border-white absolute bottom-1 left-1"></div>
             </div>
             <p className="text-[8px] text-center mt-2 text-background font-bold uppercase tracking-widest">
              {isTicketMode ? 'E-Ticket Verified' : 'Scan for preview'}
             </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Tabs */}
          <div className="w-full lg:w-3/4">
            <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar">
              {[
                { id: 'info', name: t("details_schedule") },
                { id: 'event-about', name: t("details_about") },
                { id: 'rules', name: t("details_rules") },
                { id: 'organizer', name: t("details_organizer") }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
                    activeTab === tab.id ? 'text-secondary' : 'text-foreground/50 hover:text-foreground/80'
                  }`}
                >
                  {tab.name}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary shadow-neon-secondary"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'info' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="p-6 border border-border bg-card/40 rounded-lg backdrop-blur-md">
                    <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                      <span className="w-2 h-6 bg-secondary block"></span>
                      {t("details_schedule")}
                    </h3>
                    <div className="space-y-4">
                       <div className="flex items-start gap-4 p-4 border-l-2 border-secondary/30 bg-white/5">
                          <div className="bg-secondary/20 px-3 py-1 text-secondary font-mono text-xs font-bold rounded">07:00</div>
                          <div>
                            <p className="text-foreground font-bold">{lang === 'vi' ? 'Mở cửa đón khách & Check-in' : 'Doors Open & Check-in'}</p>
                            <p className="text-foreground/40 text-xs">{lang === 'vi' ? 'Vui lòng xuất trình mã QR này tại cổng soát vé.' : 'Please present this QR code at the gate.'}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 p-4 border-l-2 border-border bg-transparent">
                          <div className="bg-card px-3 py-1 text-foreground/40 font-mono text-xs font-bold rounded">08:00</div>
                          <div>
                            <p className="text-foreground font-bold">{lang === 'vi' ? 'Khai mạc chương trình' : 'Opening Ceremony'}</p>
                            <p className="text-foreground/40 text-xs">{lang === 'vi' ? 'Phát biểu từ ban tổ chức và giới thiệu đối tác khách mời.' : 'Opening speech and guest introductions.'}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-border bg-card/40 rounded-lg backdrop-blur-md">
                    <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                      <span className="w-2 h-6 bg-purple-500 block"></span>
                      {t("details_location_matrix")}
                    </h3>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-secondary/30 shadow-neon-secondary bg-background">
                       <iframe 
                         title="Map Location"
                         width="100%" 
                         height="100%" 
                         frameBorder="0" 
                         style={{ border: 0 }} 
                         src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                         allowFullScreen
                       ></iframe>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'event-about' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed">
                    <h3 className="text-xl font-bold text-white uppercase mb-4">{t("details_about")}</h3>
                    <p>
                      {event.description || t("events_no_all")}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 border border-yellow-500/30 bg-yellow-500/5 rounded-lg flex gap-4">
                      <span className="text-2xl">⚠️</span>
                      <div className="text-sm">
                         <p className="text-yellow-400 font-bold uppercase mb-2">{t("details_rules")}</p>
                         <ul className="list-disc list-inside space-y-2 text-foreground/80">
                           <li>{lang === 'vi' ? 'Vé chỉ có giá trị cho một (01) lần vào cửa.' : 'Ticket valid for one (01) entry only.'}</li>
                           <li>{lang === 'vi' ? 'Không mang theo vũ khí, chất cháy nổ.' : 'No weapons or explosives allowed.'}</li>
                           <li>{lang === 'vi' ? 'Chương trình không áp dụng hoàn tiền.' : 'No refunds after confirmation.'}</li>
                           <li>{lang === 'vi' ? 'Trẻ em dưới 12 tuổi cần người giám hộ.' : 'Children under 12 need a guardian.'}</li>
                         </ul>
                      </div>
                   </div>
                   <div className="p-6 border border-red-500/30 bg-red-500/5 rounded-lg">
                      <p className="text-red-400 font-bold uppercase mb-2">{t("details_security")}</p>
                      <p className="text-foreground/40 text-xs italic opacity-70">
                         {lang === 'vi' ? 'Tuyệt đối không chia sẻ ảnh chụp QR Code này.' : 'Do not share your QR Code online.'}
                      </p>
                   </div>
                </div>
              )}

              {activeTab === 'organizer' && (
                <div className="space-y-8 animate-fadeIn">
                   <div className="flex flex-col md:flex-row gap-8 items-center bg-card/40 p-10 rounded-xl border border-border">
                      <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center text-secondary text-2xl font-black border-2 border-secondary/50 shadow-neon-secondary">
                        OPR
                      </div>
                      <div className="flex-grow text-center md:text-left">
                         <h4 className="text-2xl font-black text-white uppercase mb-2">{t("details_organizer")}</h4>
                         <p className="text-foreground/40 mb-4 font-mono text-sm tracking-widest uppercase">Cyber_Agency_V1.0</p>
                         <p className="text-foreground/80 max-w-xl">Hệ thống phân phối vé ứng dụng công nghệ điện toán đám mây và Microservices.</p>
                      </div>
                      <button className="px-6 py-2 border border-border text-foreground/40 text-xs font-bold uppercase rounded hover:bg-white/5 transition-colors whitespace-nowrap">{t("admin_table_status")}</button>
                   </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar / Interaction */}
          <div className="w-full lg:w-1/4 space-y-6">
             <div className="p-6 border border-border bg-card rounded-lg backdrop-blur-md">
                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-6 pb-2 border-b border-border">{t("details_interaction")}</h4>
                
                <div className="mb-6">
                   <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-1">{t("card_price")}</p>
                   <p className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                      {formattedPrice}
                   </p>
                </div>

                <div className="space-y-4">
                   {!isTicketMode ? (
                      <button 
                        onClick={handleBooking}
                        disabled={bookingStatus !== 'idle'}
                        className={`w-full py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all rounded border-2 ${
                           bookingStatus === 'idle' 
                              ? BOOKING_UI_CONFIG.idle.className 
                              : bookingStatus === 'submitting' || bookingStatus === 'queued'
                                 ? BOOKING_UI_CONFIG.submitting.className
                                 : BOOKING_UI_CONFIG.idle.className
                        }`}
                      >
                        {bookingStatus === 'idle' ? t(BOOKING_UI_CONFIG.idle.labelKey) : t("card_requesting")}
                      </button>
                   ) : (
                      <button 
                        onClick={() => window.print()}
                        className="w-full py-3 px-4 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest hover:bg-secondary/10 hover:shadow-neon-secondary transition-all rounded"
                      >
                        {t("details_download_pdf")}
                      </button>
                   )}
                   {event.location && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full block text-center py-3 px-4 border border-border text-foreground/80 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all rounded"
                      >
                        {t("details_google_maps")}
                      </a>
                   )}
                   {isTicketMode && (ticket?.status === 'confirmed' || ticket?.status === 'pending') && (
                      <button 
                        onClick={() => setConfirmCancelOpen(true)}
                        className="w-full py-3 px-4 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all rounded"
                      >
                        {t("tickets_cancel")}
                      </button>
                   )}
                </div>
             </div>
             
             <div className="p-6 border border-border bg-gradient-to-br from-card/60 to-primary/10 rounded-lg backdrop-blur-md">
                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-6">{t("details_support")}</h4>
                <div className="space-y-2 text-xs text-foreground/50">
                   <p>Hotline: <span className="text-white">1900-XXXX</span></p>
                   <p>Email: <span className="text-white">support@cloud_ticket.vn</span></p>
                   <p className="pt-4 text-[10px] text-foreground/30 font-mono">ID_SESSION: CT_{String(Math.random().toString(36).substr(2, 9)).toUpperCase()}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {confirmCancelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl">
          <div className="relative bg-background border-2 border-red-500/50 p-8 max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.4)] rounded flex flex-col items-center text-center overflow-hidden animate-zoomIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <span className="text-red-500 text-3xl font-black">!</span>
            </div>
            <h3 className="text-xl font-black text-red-500 uppercase tracking-widest mb-4">{t("details_confirm_cancel_title")}</h3>
            <p className="text-foreground/80 font-mono text-sm tracking-wide mb-8">
              {t("details_confirm_cancel_msg")}
            </p>
            <div className="flex w-full gap-4">
              <button onClick={() => setConfirmCancelOpen(false)} className="flex-1 py-2 border border-border text-foreground/40 font-bold uppercase text-xs rounded transition-colors hover:bg-white/10">
                {t("details_btn_stay")}
              </button>
              <button onClick={handleCancel} className="flex-1 py-2 bg-red-500/20 border border-red-500 text-red-500 font-black uppercase text-xs rounded transition-all hover:bg-red-500 hover:text-black">
                {t("details_btn_confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative bg-background border-2 border-yellow-500/50 p-8 max-w-sm w-full shadow-2xl rounded text-center">
             <h3 className="text-lg font-black text-yellow-500 uppercase mb-4">{t("details_alert_title")}</h3>
             <p className="text-foreground/80 text-sm mb-6">{alertMessage}</p>
             <button onClick={() => setAlertMessage(null)} className="w-full py-2 bg-yellow-500 text-black font-black uppercase text-xs rounded">{t("details_alert_ok")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage;
