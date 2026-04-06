import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Logic extraction token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token extracted:", token);
      login(token);
      // login sẽ tự động fetch user và cập nhật state
      setTimeout(() => navigate("/"), 1500); 
    } else {
      navigate("/login");
    }
  }, [navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      {/* Radar/Radar Scanner Effect */}
      <div className="relative w-64 h-64 border-2 border-secondary/30 rounded-full flex items-center justify-center overflow-hidden">
        {/* Rotating Beam */}
        <div className="absolute inset-0 bg-conic-gradient from-secondary/40 to-transparent animate-[spin_3s_linear_infinite] origin-center"></div>
        {/* Glow dots */}
        <div className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#FF00FF] animate-pulse"></div>
        <div className="absolute w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_#00FFFF] top-10 left-20"></div>
        <div className="absolute w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_#00FFFF] bottom-20 right-10"></div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-heading text-secondary tracking-widest uppercase mb-4 animate-pulse">
          &gt; DECRYPTING_IDENTITY_TOKEN...
        </h2>
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary/40 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
