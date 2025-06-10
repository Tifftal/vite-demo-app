import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
// import { dependencies } from "./package.json";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        weather: {
          type: "module",
          name: "weather",
          entry: "http://localhost:5001/weather.js",
          entryGlobalName: "weather",
          shareScope: "default",
        },
        news: {
          type: "module",
          name: "news",
          entry: "http://localhost:5002/news.js",
          entryGlobalName: "news",
          shareScope: "default",
        },
      },
      exposes: {},
      filename: "remoteEntry.js",
      shared: ["react", "react-dom", "react-router-dom"],
      // shared: {
      //   react: {
      //     // requiredVersion: dependencies.react,
      //     singleton: true,
      //     requiredVersion: "19.1.0",
      //   },
      //   "react-dom": {
      //     // requiredVersion: dependencies["react-dom"],
      //     requiredVersion: "19.1.0",
      //     singleton: true,
      //   },
      //   "react-router-dom": {
      //     // requiredVersion: dependencies["react-router-dom"],
      //     requiredVersion: "7.6.2",
      //     singleton: true,
      //   },
      // },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["vite.svg", "offline.html"],
      manifest: {
        name: "Microfrontend Host",
        short_name: "Host",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        description: "Host app with microfrontends",
      },
      workbox: {
        navigateFallback: "/offline.html",
        navigateFallbackAllowlist: [/.*/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/newsapi\.org\/v2\/.*$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "remote-news-requests",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: "esnext",
  },
  server: {
    port: 5000,
  },
});
