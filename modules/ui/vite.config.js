import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Điều hướng tất cả các yêu cầu bắt đầu bằng /api sang Backend server
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});
