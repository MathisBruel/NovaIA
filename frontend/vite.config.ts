import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.JPEG", "**/*.obj", "**/*.mtl"],
  server: {
    port: 5173,
    allowedHosts: ["novaia.mathisbruel.fr"],
    proxy: {
      "/api": {
        target: (process.env.VITE_API_PROXY_TARGET || "").trim() || "http://backend:8080",
        changeOrigin: true
      }
    }
  }
});

