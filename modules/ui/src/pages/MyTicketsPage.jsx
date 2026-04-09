import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import useMyTickets from '../hooks/useMyTickets.js';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { THEME_COLORS, TYPOGRAPHY, SHADOWS } from '../constants/uiConstants.js';

const MyTicketsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { tickets, loading: ticketsLoading, error, refresh, cancelTicket } = useMyTickets();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [confirmCancelTicketId, setConfirmCancelTicketId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleCancelClick = (ticketId) => {
    setConfirmCancelTicketId(ticketId);
  };

  const confirmCancel = async () => {
    if (!confirmCancelTicketId) return;
    const ticketId = confirmCancelTicketId;
    setConfirmCancelTicketId(null);
    try {
      await cancelTicket(ticketId);
    } catch (err) {
      setAlertMessage("Đã xảy ra lỗi khi hủy vé. Vui lòng thử lại sau.");
    }
  };

  if (authLoading || (ticketsLoading && tickets.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans tracking-widest" style={{ fontFamily: TYPOGRAPHY.BODY }}>
        <div className="text-secondary animate-pulse text-lg border border-secondary/50 px-8 py-4 rounded backdrop-blur-md shadow-neon-secondary">
          ĐANG TẢI DỮ LIỆU...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 relative" style={{ fontFamily: TYPOGRAPHY.BODY }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'MY TICKETS' }]} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary tracking-[0.1em] uppercase drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            Vé của tôi
          </h1>
          <button 
            onClick={refresh}
            className="px-5 py-2 border border-secondary/50 text-secondary text-sm font-bold tracking-widest uppercase hover:bg-secondary/10 hover:shadow-neon-secondary transition-all rounded backdrop-blur-md cursor-pointer"
          >
            Làm mới
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-500 bg-red-500/10 text-red-500 text-sm font-bold tracking-wider rounded backdrop-blur-md shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="py-24 px-6 border border-secondary/30 bg-card/40 backdrop-blur-md rounded-lg flex flex-col items-center justify-center shadow-card text-center">
            <h2 className="text-2xl font-bold text-secondary mb-8 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
              Bạn chưa có vé nào. Hãy săn vé ngay!
            </h2>
            <Link 
              to="/" 
              className="px-8 py-3 bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-black font-black uppercase tracking-widest transition-all rounded shadow-neon-secondary hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]"
            >
              Về trang chủ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const eventDate = ticket.event?.date 
                ? new Date(ticket.event.date).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'Đang cập nhật';
              
              let statusBadgeClasses = "";
              let statusText = ticket.status;

              if (ticket.status === 'confirmed') {
                statusBadgeClasses = "text-green-400 border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]";
              } else if (ticket.status === 'pending') {
                statusBadgeClasses = "text-yellow-400 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]";
              } else if (ticket.status === 'cancelled') {
                statusBadgeClasses = "text-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
              } else {
                statusBadgeClasses = "text-slate-400 border-slate-400";
              }

              return (
                <div 
                  key={ticket._id} 
                  className={`relative p-6 border ${ticket.status === 'cancelled' ? 'border-red-900/50 bg-background opacity-70' : 'border-border bg-card transition-colors hover:border-secondary/50 shadow-card'} backdrop-blur-md rounded-lg group overflow-hidden flex flex-col`}
                >
                  {ticket.status !== 'cancelled' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  
                  <div className="mb-4 pr-24 flex-grow">
                    <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wide truncate">
                      {ticket.event?.title || 'Sự kiện không xác định'}
                    </h3>
                  </div>

                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded backdrop-blur-sm bg-slate-950/50 ${statusBadgeClasses}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-foreground font-mono mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-secondary text-lg">📅</span>
                      <span>{eventDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-secondary text-lg">📍</span>
                      <span className="truncate" title={ticket.event?.location || 'Đang cập nhật'}>
                        {ticket.event?.location || 'Đang cập nhật'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-2 justify-end items-center">
                    <button 
                      onClick={() => navigate(`/my-tickets/${ticket._id}`)}
                      className="px-3 py-1.5 border border-primary/50 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-primary/10 hover:shadow-neon-primary transition-all rounded cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    {ticket.event?.location && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.event.location)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-secondary/50 text-secondary text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-secondary/10 hover:shadow-neon-secondary transition-all rounded"
                      >
                        Xem địa điểm
                      </a>
                    )}
                    {(ticket.status === 'confirmed' || ticket.status === 'pending') && (
                      <button 
                        onClick={() => handleCancelClick(ticket._id)}
                        className="px-3 py-1.5 border border-red-500/50 text-red-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all rounded cursor-pointer"
                      >
                        Hủy vé
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>



      {/* Cyberpunk Confirm Modal */}
      {confirmCancelTicketId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative bg-background border-2 border-red-500/50 p-6 sm:p-8 max-w-sm w-full shadow-[0_0_40px_rgba(239,68,68,0.3)] rounded flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-900"></div>
            
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <span className="text-red-500 text-3xl font-black drop-shadow-[0_0_8px_rgba(239,68,68,1)]">!</span>
            </div>
            
            <h3 className="text-xl font-black text-red-500 uppercase tracking-widest mb-4">Cảnh Báo</h3>
            <p className="text-slate-300 font-mono text-sm tracking-wide mb-8">
              Bạn có chắc chắn muốn hủy vé này không? Hành động này <span className="text-red-400 font-bold">không thể hoàn tác</span>.
            </p>
            
            <div className="flex w-full gap-4">
              <button 
                onClick={() => setConfirmCancelTicketId(null)}
                className="flex-1 px-4 py-2 border border-border text-foreground/50 font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 font-black uppercase tracking-widest hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all rounded cursor-pointer"
              >
                Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cyberpunk Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative bg-background border-2 border-yellow-500/50 p-6 sm:p-8 max-w-sm w-full shadow-[0_0_40px_rgba(250,204,21,0.3)] rounded flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-900"></div>
            
            <h3 className="text-xl font-black text-yellow-500 uppercase tracking-widest mb-4 mt-2">Thông Cáo Hệ Thống</h3>
            <p className="text-slate-300 font-mono text-sm tracking-wide mb-8">
              {alertMessage}
            </p>
            
            <button 
              onClick={() => setAlertMessage(null)}
              className="w-full px-4 py-2 border border-yellow-500 text-yellow-500 font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all rounded cursor-pointer"
            >
              Xác Nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
