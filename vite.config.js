import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    host: true,
    origin: 'http://127.0.0.1:8080',
  },
  plugins: [react()],
});
