import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { federation } from "@module-federation/vite";
import federation from "@originjs/vite-plugin-federation";
// import { dependencies } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "news",
      filename: "news.js",
      exposes: {
        "./news-app": "./src/App.tsx",
      },
      // shared: {
      //   react: {
      //     // requiredVersion: dependencies.react,
      //     singleton: true,
      //     requiredVersion: "18.3.1",
      //   },
      //   "react-dom": {
      //     // requiredVersion: dependencies["react-dom"],
      //     requiredVersion: "18.3.1",
      //     singleton: true,
      //   },
      //   "react-router-dom": {
      //     // requiredVersion: dependencies["react-router-dom"],
      //     requiredVersion: "7.6.2",
      //     singleton: true,
      //   },
      // },
      shared: {
        react: { requiredVersion: "18.3.1" },
        "react-dom": { requiredVersion: "18.3.1" },
        "react-router-dom": { requiredVersion: "7.6.2" },
      },
    }),
  ],
  build: {
    target: "esnext",
    modulePreload: false,
  },
  server: {
    port: 5002,
    cors: true,
  },
  preview: { port: 5002, cors: true },
});
