import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Component tiện ích để reset vị trí cuộn trang.
 * Phiên bản cuối cùng: Tắt cơ chế tự động của trình duyệt và ép cuộn sau delay nhẹ.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // 1. Tắt cơ chế khôi phục scroll tự động của trình duyệt ngay khi component mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // 2. Ép cuộn về (0,0) ngay lập tức
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    
    // 3. Dự phòng: Thêm một độ trễ nhỏ (10ms) để chắc chắn chạy sau khi layout ổn định
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
