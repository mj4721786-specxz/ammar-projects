import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the React app runs on :5173 and forwards /api to the server on :3000.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: { "/api": "http://localhost:3000" },
  },
  build: { outDir: "dist" },
});
