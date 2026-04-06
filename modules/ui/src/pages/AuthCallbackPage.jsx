import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Đọc tham số token từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Gọi hàm login(token) từ AuthContext để lưu JWT và cập nhật trạng thái
      login(token);
      // Sau khi login hoàn tất, điều hướng về trang chủ
      navigate("/");
    } else {
      setError("Không tìm thấy mã xác thực (token) trong URL. Vui lòng đăng nhập lại.");
    }
  }, [navigate, login]);

  // Giao diện khi có lỗi (không có token)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md w-full bg-red-950/30 backdrop-blur-xl p-10 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-500/5">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-wider">Lỗi Đăng Nhập</h2>
          <p className="text-slate-400 font-medium mb-10 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 px-8 bg-gradient-to-r from-red-600 to-red-500 text-white font-black rounded-2xl hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-500/20 uppercase tracking-widest text-sm"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Giao diện trạng thái đang xử lý
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="relative mb-12">
        {/* Loading Spinner hiện đại */}
        <div className="w-24 h-24 border-8 border-slate-800 border-t-blue-500 rounded-full animate-spin shadow-2xl"></div>
        <div className="absolute inset-0 w-24 h-24 border-8 border-transparent border-b-purple-500 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full animate-ping"></div>
      </div>
      
      <h2 className="text-3xl font-black text-white tracking-widest uppercase italic animate-pulse">
        Đang xử lý đăng nhập...
      </h2>
      <p className="mt-4 text-slate-400 font-medium tracking-wide">
        Hệ thống đang xác thực danh tính của bạn. Vui lòng giữ kết nối.
      </p>
    </div>
  );
};

export default AuthCallbackPage;

