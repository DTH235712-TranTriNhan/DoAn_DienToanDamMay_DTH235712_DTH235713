import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import NavBar from "./components/NavBar.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.jsx";
import MyTicketsPage from "./pages/MyTicketsPage.jsx";
import AdminEventsPage from "./pages/AdminEventsPage.jsx";
import Footer from "./components/Footer.jsx";

// Component con để sử dụng hook useAuth bên trong AuthProvider
const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-secondary font-mono animate-pulse tracking-[0.3em]">
          INITIALIZING_SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-hidden">
      {/* Floating Sun */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] blur-[100px] bg-sun-glow opacity-30 z-0 pointer-events-none"></div>

      {/* Scanline Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-scanline bg-size-[100%_4px]"></div>

      {/* Perspective Grid Floor */}
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
        {/* NavBar tự lấy user từ useAuth() — không cần prop */}
        <NavBar />
        <main className="max-w-7xl mx-auto w-full grow px-4 transition-all duration-500">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            {/* Route quản trị — AdminEventsPage tự redirect nếu không phải admin */}
            <Route path="/admin/events" element={<AdminEventsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
