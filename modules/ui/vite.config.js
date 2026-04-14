import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  server: {
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval'; worker-src 'self' blob:; frame-src 'self' blob:; connect-src 'self' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com data:;"
    },
    proxy: {
      // Điều hướng tất cả các yêu cầu bắt đầu bằng /api sang Backend server
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      }
    }
  }
});
