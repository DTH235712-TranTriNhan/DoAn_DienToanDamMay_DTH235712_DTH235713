import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import MyTicketsPage from "./pages/MyTicketsPage";

function App() {
  const mockUser = null;

  return (
    <BrowserRouter>
      {/* Bọc toàn bộ App bằng không gian Vaporwave */}
      <div className="min-h-screen relative bg-background text-foreground overflow-hidden">
        {/* Floating Sun (Mặt trời mờ ảo phía sau) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] blur-[100px] bg-sun-glow opacity-30 z-0 pointer-events-none"></div>

        {/* Scanline Overlay (Hiệu ứng dòng quét CRT an toàn hơn) */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-scanline bg-size-[100%_4px]"></div>

        {/* Perspective Grid Floor (Lưới không gian bên dưới) */}
        <div
          className="absolute bottom-0 w-full h-[50vh] z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(transparent 95%, #FF00FF 95%), linear-gradient(90deg, transparent 95%, #FF00FF 95%)",
            backgroundSize: "40px 40px",
            transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(2.5)",
            maskImage: "linear-gradient(to top, black, transparent)"
          }}
        ></div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar user={mockUser} />
          <main className="max-w-7xl mx-auto w-full grow px-4 transition-all duration-500">
            <Routes>
              <Route path="/" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
