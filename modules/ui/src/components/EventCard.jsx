import { useMemo, useState } from "react";
import { THEME_COLORS } from "../constants/uiConstants";

const EventCard = ({ event }) => {
  // Mock status for demonstration (Idle | Submitting | Queued | Completed)
  // Trong thực tế sẽ lấy từ hook useBookTicket
  const [bookingStatus, setBookingStatus] = useState("idle");

  // Format ngày theo chuẩn DD/MM/YYYY
  const formattedDate = useMemo(() => {
    if (!event?.date) return "TBA";
    return new Date(event.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }, [event.date]);

  // Tính toán % cho thanh Progress (Số vé đã bán / Tổng số vé)
  const available = event.availableTickets || 0;
  const total = event.totalTickets || 1;
  const soldTickets = Math.max(0, total - available);
  const progressPercentage = Math.round((soldTickets / total) * 100);

  const handleBooking = () => {
    if (available === 0 || bookingStatus !== "idle") return;

    // Giả lập luồng 4 trạng thái
    setBookingStatus("submitting");
    setTimeout(() => setBookingStatus("queued"), 1500);
    setTimeout(() => setBookingStatus("completed"), 4000);
  };

  return (
    <div
      className="relative group rounded-xl overflow-hidden border-2 border-primary/20 bg-card backdrop-blur-md transition-all duration-500 hover:border-secondary shadow-lg flex flex-col"
      style={{ boxShadow: `0 0 15px ${THEME_COLORS.PRIMARY}10` }}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-secondary/10 transition-colors"></div>

      <div className="p-6 grow flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-heading font-black text-white leading-tight uppercase tracking-widest line-clamp-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {event.title}
          </h3>
          <span className="text-[10px] font-mono p-1 border border-secondary/40 text-secondary bg-secondary/5">
            ID: {event._id?.slice(-6).toUpperCase() || "UNKNOWN"}
          </span>
        </div>

        <p className="text-foreground/70 text-sm mb-6 line-clamp-3 font-sans leading-relaxed border-l-2 border-secondary/20 pl-3">
          {event.description}
        </p>

        <div className="space-y-3 text-xs text-secondary/80 font-sans mb-8">
          <div className="flex items-center gap-3">
            <span className="w-4 flex justify-center opacity-70">📅</span>
            <span className="tracking-widest uppercase font-bold">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 flex justify-center opacity-70">📍</span>
            <span className="tracking-widest uppercase truncate font-bold">{event.location}</span>
          </div>
        </div>

        {/* Thanh Progress */}
        <div className="mt-auto">
          <div className="flex justify-between text-[10px] font-mono text-foreground/50 mb-2 uppercase tracking-tighter">
            <span>UNITS_DEPLETED: {progressPercentage}%</span>
            <span className={available < 10 ? "text-primary animate-pulse" : "text-secondary"}>
              REMAINING: {available}
            </span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-[6px] overflow-hidden border border-secondary/10">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${progressPercentage}%`,
                background: `linear-gradient(to right, ${THEME_COLORS.SECONDARY}, ${THEME_COLORS.PRIMARY})`,
                boxShadow: `0 0 10px ${THEME_COLORS.SECONDARY}`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Nút Hành động */}
      <div className="p-5 bg-black/20 border-t border-primary/20">
        <button
          onClick={handleBooking}
          disabled={available === 0 || bookingStatus === "completed"}
          className={`w-full py-3 font-heading font-bold uppercase tracking-[0.3em] text-xs transition-all duration-300 relative overflow-hidden group/btn ${
            available === 0
              ? "border-foreground/20 text-foreground/30 cursor-not-allowed grayscale"
              : bookingStatus === "completed"
                ? "border-green-500/50 text-green-400 bg-green-500/10"
                : "border-secondary/50 text-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          } border-2`}
        >
          {/* Scanline overlay for button */}
          <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>

          <span className="relative z-10 flex items-center justify-center gap-2">
            {bookingStatus === "idle" && (
              <>{available === 0 ? "STATUS: SOLD_OUT" : "🎟️ Đặt vé ngay"}</>
            )}
            {bookingStatus === "submitting" && <>⏳ Đang gửi yêu cầu...</>}
            {bookingStatus === "queued" && (
              <span className="animate-pulse flex items-center gap-2">
                📡 Đang xếp hàng...
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-secondary animate-bounce"></span>
                  <span className="w-1 h-3 bg-secondary animate-bounce [animation-delay:0.2s]"></span>
                </span>
              </span>
            )}
            {bookingStatus === "completed" && <>✅ Đã xác nhận thành công</>}
          </span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
