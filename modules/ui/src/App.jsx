import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
// Import component EventsPage thật từ thư mục pages
import EventsPage from './pages/EventsPage';

// --- MOCK COMPONENTS (Giữ lại cho các trang chưa làm ở Phase này) ---
const LoginPage = () => <div className="p-8 text-center text-xl">🔑 Trang đăng nhập (LoginPage)</div>;
const AuthCallback = () => <div className="p-8 text-center text-xl">⏳ Đang xử lý đăng nhập... (Callback)</div>;
const MyTicketsPage = () => <div className="p-8 text-center text-xl">🎟️ Vé của tôi (MyTicketsPage)</div>;
// --------------------------------------------------------------------------------------

function App() {
  // Biến mock để test UI của NavBar.
  // Đổi giá trị này thành một object (VD: { name: 'Thanh Nhật', avatar: '' }) để xem trạng thái đã đăng nhập.
  const mockUser = null; 

  return (
    <BrowserRouter>
      {/* Bao bọc toàn bộ app với một div có nền nhạt để dễ nhìn layout */}
      <div className="min-h-screen bg-gray-50">
        
        {/* Thanh điều hướng luôn ở trên cùng */}
        <NavBar user={mockUser} />
        
        {/* Khu vực chứa nội dung chính thay đổi theo Route */}
        <main className="max-w-7xl mx-auto">
          <Routes>
            {/* Đã sử dụng EventsPage thật ở Route trang chủ */}
            <Route path="/" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}

export default App;