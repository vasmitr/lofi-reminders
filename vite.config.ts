import path from "path";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

import LV from "@lo-fi/local-vault/bundlers/vite";

export default defineConfig({
  plugins: [
    LV(),
    preact({
      babel: {
        plugins: [["module:@preact/signals-react-transform"]],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
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
