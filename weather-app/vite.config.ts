import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
// import { dependencies } from "./package.json";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    federation({
      name: "weather",
      filename: "weather.js",
      exposes: {
        "./weather-app": "./src/App.tsx",
      },
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
  ],
  build: {
    target: "esnext",
    // modulePreload: false,
  },
  server: {
    port: 5001,
  },
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.svg"],
});
