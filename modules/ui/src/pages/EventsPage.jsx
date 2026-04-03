import EventCard from '../components/EventCard';
import useEvents from '../hooks/useEvents';

const EventsPage = () => {
  const { events, loading, error } = useEvents();

  // Trạng thái 1: Loading
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải danh sách sự kiện...</p>
      </div>
    );
  }

  // Trạng thái 2: Lỗi API
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 border border-red-100 rounded-xl text-center">
        <span className="text-3xl block mb-2">⚠️</span>
        <h2 className="text-lg font-bold text-red-700 mb-1">Rất tiếc, đã có lỗi xảy ra!</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Trạng thái 3: Empty (Không có dữ liệu)
  if (!events || events.length === 0) {
    return (
      <div className="text-center mt-20">
        <span className="text-5xl block mb-4">📭</span>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Chưa có sự kiện nào</h2>
        <p className="text-gray-500">Hiện tại không có sự kiện nào sắp diễn ra. Vui lòng quay lại sau!</p>
      </div>
    );
  }

  // Trạng thái 4: Render Grid thành công
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Sự kiện nổi bật
        </h1>
        <p className="text-gray-500 mt-2">
          Khám phá và đặt vé cho các sự kiện hấp dẫn nhất sắp diễn ra.
        </p>
      </div>

      {/* Grid: 1 cột (mobile), 2 cột (tablet), 3 cột (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id || event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;