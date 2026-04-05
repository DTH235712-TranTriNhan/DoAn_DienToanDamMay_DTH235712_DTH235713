import React from 'react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';

const EventsPage = () => {
  // Bóc tách data từ custom hook
  const { events, loading, error } = useEvents();

  // Trạng thái 1: Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary shadow-[0_0_20px_rgba(0,255,255,0.5)]"></div>
      </div>
    );
  }

  // Trạng thái 2: Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card border border-red-500 p-6 rounded-lg text-center shadow-[0_0_20px_rgba(255,0,0,0.4)]">
          <h2 className="text-2xl font-bold font-heading text-red-500 mb-2">Lỗi Truy Xuất Dữ Liệu</h2>
          <p className="text-foreground font-mono">{error}</p>
        </div>
      </div>
    );
  }

  // Trạng thái 3: Empty (Thành công nhưng mảng rỗng)
  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card border border-border p-8 rounded-xl text-center shadow-[0_0_20px_rgba(255,153,0,0.2)]">
          <p className="text-xl text-accent font-heading">Hệ thống chưa có sự kiện nào.</p>
          <p className="text-foreground/70 mt-2 font-mono">Vui lòng quay lại sau nhé!</p>
        </div>
      </div>
    );
  }

  // Render danh sách (Responsive Grid)
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tiêu đề trang */}
      <h1 className="text-4xl md:text-5xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-secondary mb-12 text-center uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]">
        Sự Kiện Nổi Bật
      </h1>

      {/* Grid Layout 1-2-3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          // Dùng _id (nếu từ MongoDB) hoặc id
          <EventCard key={event._id || event.id} event={event} /> 
        ))}
      </div>
    </div>
  );
};

export default EventsPage;