import { useMemo } from 'react';

const EventCard = ({ event }) => {
  // Format ngày theo chuẩn DD/MM/YYYY
  const formattedDate = useMemo(() => {
    if (!event?.date) return 'Chưa cập nhật ngày';
    return new Date(event.date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, [event.date]);

  // Tính toán % cho thanh Progress (Số vé đã bán / Tổng số vé)
  const available = event.availableTickets || 0;
  const total = event.totalTickets || 1; // Đảm bảo không chia cho 0
  const soldTickets = total - available;
  const progressPercentage = Math.round((soldTickets / total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden">
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600 mb-5">
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Thanh Progress */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
            <span>Đã bán: {progressPercentage}%</span>
            <span>Còn {available} vé</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${available === 0 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Nút Hành động */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button 
          className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
            available === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={available === 0}
        >
          {available === 0 ? 'Đã Hết Vé' : 'Đặt Vé Ngay'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;