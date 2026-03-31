import React, { useState, useEffect } from "react";
// import axios from 'axios'; // Tạm thời ẩn axios đi chờ Backend

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập gọi API mất 1 giây
  useEffect(() => {
    setTimeout(() => {
      // Dữ liệu giả bám sát file seed.js trong Tài liệu kỹ thuật
      setEvents([
        {
          _id: "1",
          title: "Concert Anh Trai Say Hi 2025",
          description: "Sự kiện âm nhạc hoành tráng nhất năm 2025 quy tụ dàn sao khủng.",
          date: "25/12/2025",
          location: "Sân vận động Quân khu 7, TP.HCM",
          availableTickets: 800,
          totalTickets: 1000
        },
        {
          _id: "2",
          title: "Tech Conference 2026",
          description: "Hội nghị công nghệ đỉnh cao, cập nhật xu hướng Cloud, AI và Monorepo.",
          date: "10/05/2026",
          location: "Trung tâm Hội nghị Quốc gia",
          availableTickets: 120,
          totalTickets: 500
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          🎉 Nền Tảng Săn Vé Sự Kiện
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl font-medium text-gray-500 animate-pulse">
              Đang tải dữ liệu sự kiện...
            </p>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-red-500 text-xl font-medium bg-red-50 p-4 rounded-lg">
            Chưa có sự kiện nào hoặc Backend chưa chạy!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      📅 {event.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 mb-6 grow">{event.description}</p>

                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <span className="mr-2">📍</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-green-50 p-2 rounded-lg border border-green-100">
                      <span className="font-medium text-green-700">Tình trạng vé:</span>
                      <span className="font-bold text-green-600">
                        {event.availableTickets} / {event.totalTickets}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <span>🎟️</span>
                    <span>Đặt Vé Ngay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
