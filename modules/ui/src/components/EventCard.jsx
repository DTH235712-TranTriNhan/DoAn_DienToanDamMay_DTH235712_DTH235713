import React from 'react';

const EventCard = ({ event }) => {
  const { title, description, date, location, availableTickets, totalTickets } = event;

  // Format ngày thành DD/MM/YYYY
  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Tính phần trăm vé đã bán/còn lại cho thanh Progress
  const ticketPercent = totalTickets > 0 
    ? (availableTickets / totalTickets) * 100 
    : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-[0_0_15px_rgba(255,0,255,0.15)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 flex flex-col h-full group">
      {/* Thông tin sự kiện */}
      <div className="mb-4">
        <h3 className="text-2xl font-heading font-bold text-primary group-hover:text-secondary transition-colors truncate mb-3">
          {title}
        </h3>
        <p className="text-sm text-foreground/80 line-clamp-3 mb-4 flex-grow font-mono">
          {description}
        </p>
        <div className="space-y-2 text-sm text-foreground font-mono">
          <p className="flex items-center gap-2">
            <span className="text-accent text-lg">📅</span> {formattedDate}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-accent text-lg">📍</span> {location}
          </p>
        </div>
      </div>

      {/* Box Đặt vé & Progress */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex justify-between text-xs font-mono mb-2">
          <span>Vé: {availableTickets} / {totalTickets}</span>
          <span className="text-secondary">{Math.round(ticketPercent)}%</span>
        </div>
        
        {/* Thanh Progress */}
        <div className="w-full bg-background rounded-full h-2 mb-5 border border-border overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent via-primary to-secondary h-full rounded-full transition-all duration-700"
            style={{ width: `${ticketPercent}%` }}
          ></div>
        </div>

        {/* Nút Call-to-action */}
        <button 
          className="w-full py-2 bg-transparent border-2 border-secondary text-secondary font-bold font-heading rounded hover:bg-secondary hover:text-background transition-colors uppercase tracking-[0.2em] text-sm"
          disabled={availableTickets === 0}
        >
          {availableTickets === 0 ? 'Đã Hết Vé' : 'Đặt Vé Ngay'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;