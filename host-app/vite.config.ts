// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { federation } from "@module-federation/vite";
// // import { dependencies } from "./package.json";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: "host",
//       remotes: {
//         weather: {
//           type: "module",
//           name: "weather",
//           entry: "http://localhost:5001/weather.js",
//           entryGlobalName: "weather",
//           shareScope: "default",
//         },
//         news: {
//           type: "module",
//           name: "news",
//           entry: "http://localhost:5002/news.js",
//           entryGlobalName: "news",
//           shareScope: "default",
//         },
//       },
//       exposes: {},
//       filename: "remoteEntry.js",
//       // shared: ["react", "react-dom", "react-router-dom"],
//       shared: {
//         react: {
//           // requiredVersion: dependencies.react,
//           singleton: true,
//           requiredVersion: "18.3.1",
//         },
//         "react-dom": {
//           // requiredVersion: dependencies["react-dom"],
//           requiredVersion: "18.3.1",
//           singleton: true,
//         },
//         "react-router-dom": {
//           // requiredVersion: dependencies["react-router-dom"],
//           requiredVersion: "7.6.2",
//           singleton: true,
//         },
//       },
//     }),
//     VitePWA({
//       mode: "development",
//       registerType: "prompt",
//       injectRegister: null,
//       srcDir: "src",
//       filename: "sw.ts",
//       strategies: "injectManifest",
//       includeAssets: ["vite.svg", "offline.html"],
//       devOptions: {
//         enabled: true,
//         // type: "module",
//         navigateFallback: "index.html",
//       },
//       workbox: {
//         globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
//         navigateFallback: "index.html",
//       },
//       injectManifest: {
//         minify: false,
//         enableWorkboxModulesLogs: true,
//         maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
//       },
//     }),
//   ],
//   build: {
//     target: "esnext",
//   },
//   server: {
//     port: 5173,
//   },
//   preview: {
//     port: 5173,
//     cors: true,
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from "@rollup/plugin-replace";
import { federation } from "@module-federation/vite";
import { VitePWA } from "vite-plugin-pwa";
import process from "node:process";

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
        // weather: "http://localhost:5001/weather.js",
        // news: "http://localhost:5002/news.js",
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
      // exposes: {},
      // filename: "remoteEntry.js",
      shared: {
        react: { singleton: true, requiredVersion: "18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "18.3.1" },
        "react-router-dom": { singleton: true, requiredVersion: "7.6.2" },
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
