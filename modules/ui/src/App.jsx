import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

// --- VAPORWAVE MOCK COMPONENTS ---
const EventsPage = () => (
  <div className="py-20 relative z-10 flex flex-col items-center">
    {/* Hero Text */}
    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-center mb-8 uppercase leading-tight">
      <span className="bg-sunset-gradient bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,0,255,0.6)]">
        DIGITAL_
      </span>
      <br />
      <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">EVENTS.EXE</span>
    </h1>

    {/* Terminal Card */}
    <div className="w-full max-w-4xl mt-12 border-2 border-secondary bg-black/80 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
      {/* Title Bar */}
      <div className="bg-secondary/20 border-b border-secondary px-4 py-2 flex items-center justify-between">
        <span className="font-mono text-secondary text-sm">C:\SYSTEM\EVENT_LIST.BAT</span>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_5px_#FF00FF]"></div>
          <div className="h-3 w-3 rounded-full bg-secondary shadow-[0_0_5px_#00FFFF]"></div>
          <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_5px_#FF9900]"></div>
        </div>
      </div>
      {/* Content */}
      <div className="p-8 text-center text-xl font-mono text-foreground space-y-4">
        {/* Đã sửa dấu > thành &gt; ở đây */}
        <p className="animate-pulse">&gt; LOADING_EVENTS_FROM_MAINFRAME...</p>
        <p className="text-primary text-sm">STATUS: WAITING FOR BACKEND CONNECTION</p>
      </div>
    </div>
  </div>
);

const LoginPage = () => <div className="py-32 text-center text-2xl font-heading text-primary drop-shadow-[0_0_10px_#FF00FF]">ACCESS_DENIED // LOGIN REQUIRED</div>;
// Đã sửa dấu > thành &gt; ở đây
const AuthCallback = () => <div className="py-32 text-center text-xl font-mono text-secondary animate-pulse">&gt; DECRYPTING_TOKEN...</div>;
const MyTicketsPage = () => <div className="py-32 text-center text-2xl font-heading text-accent drop-shadow-[0_0_10px_#FF9900]">YOUR_INVENTORY.DAT</div>;

function App() {
  const mockUser = null; 

  return (
    <BrowserRouter>
      {/* Bọc toàn bộ App bằng không gian Vaporwave */}
      <div className="min-h-screen relative bg-background text-foreground overflow-hidden">
        
        {/* Floating Sun (Mặt trời mờ ảo phía sau) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] blur-[100px] bg-sun-glow opacity-30 z-0 pointer-events-none"></div>

        {/* Perspective Grid Floor (Lưới không gian bên dưới) */}
        <div className="absolute bottom-0 w-full h-[50vh] z-0 opacity-40 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(transparent 95%, #FF00FF 95%), linear-gradient(90deg, transparent 95%, #FF00FF 95%)',
               backgroundSize: '40px 40px',
               transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2.5)',
               maskImage: 'linear-gradient(to top, black, transparent)'
             }}>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar user={mockUser} />
          <main className="max-w-7xl mx-auto w-full flex-grow px-4">
            <Routes>
              <Route path="/" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
            </Routes>
          </main>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;