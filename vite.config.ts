import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import LV from "@lo-fi/local-vault/bundlers/vite";

export default defineConfig({
  plugins: [LV(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      // WALC (dependency) uses "top-level await", which is ES2022+
      target: "es2022",
    },
  },

  build: {
    // WALC (dependency) uses "top-level await", which is ES2022+
    target: "es2022",
  },
});
