import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

import LV from "@lo-fi/local-vault/bundlers/vite";

export default defineConfig({
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },

    LV(),
    react({
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
    exclude: ["sqlocal"],
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
