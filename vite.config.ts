import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path from "path";

const port = Number(process.env.PORT) || 3000;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          runtimeErrorOverlay(),
          ...(await Promise.all([
            import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer()
            ),
            import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner()
            ),
          ])),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
