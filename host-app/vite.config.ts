import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from "@rollup/plugin-replace";
import { VitePWA } from "vite-plugin-pwa";
import process from "node:process";
import federation from "@originjs/vite-plugin-federation";

const useSwDev = process.env.SW_DEV === "true";
const useSw = process.env.SW === "true";

export default defineConfig({
  server: { port: 5173 },
  preview: { port: 5173, cors: true },
  build: { target: "esnext", sourcemap: true },
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        weather: "http://localhost:5001/assets/weather.js",
        news: "http://localhost:5002/assets/news.js",
      },
      shared: {
        react: { requiredVersion: "18.3.1" },
        "react-dom": { requiredVersion: "18.3.1" },
        "react-router-dom": { requiredVersion: "7.6.2" },
      },
    }),
    VitePWA({
      mode: "development",
      registerType: "prompt",
      injectRegister: null,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["vite.svg", "offline.html", "favicon.svg"],
      manifest: {
        name: "Host App PWA",
        short_name: "HostPWA",
        theme_color: "#ffffff",
      },
      devOptions: {
        enabled: useSwDev,
        type: "module",
        navigateFallback: "index.html",
        suppressWarnings: true,
      },
      injectManifest: useSw
        ? {
            minify: false,
            enableWorkboxModulesLogs: true,
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          }
        : undefined,
    }),
    replace({
      __DATE__: JSON.stringify(new Date().toISOString()),
      __RELOAD_SW__: JSON.stringify(false),
      preventAssignment: true,
    }),
  ],
});
