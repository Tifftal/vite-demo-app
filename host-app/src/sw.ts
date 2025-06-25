// /* eslint-disable @typescript-eslint/no-unused-vars */
// /// <reference lib="webworker" />
// import { clientsClaim } from "workbox-core";
// import { matchPrecache, precacheAndRoute } from "workbox-precaching";
// import {
//   NavigationRoute,
//   registerRoute,
//   setCatchHandler,
// } from "workbox-routing";
// import { NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";
// import { CacheableResponsePlugin } from "workbox-cacheable-response";
// import { ExpirationPlugin } from "workbox-expiration";

// declare let self: ServiceWorkerGlobalScope;

// clientsClaim();
// precacheAndRoute(self.__WB_MANIFEST || []);

// self.addEventListener("install", (event) => {
//   console.log("Service Worker установился");
//   self.skipWaiting();
// });

// registerRoute(({ request }) => request.mode === "navigate", new NetworkOnly());

// setCatchHandler(async ({ request }) => {
//   console.log("⚠️ [SW] Catch triggered for", request.url);

//   if (request.destination === "document") {
//     const cached = await matchPrecache("/offline.html");
//     return (
//       cached ||
//       new Response("Offline page not found", {
//         status: 503,
//         headers: { "Content-Type": "text/html" },
//       })
//     );
//   }

//   return Response.error();
// });

// registerRoute(
//   ({ url }) =>
//     url.origin === "https://newsapi.org" && url.pathname.startsWith("/v2/"),
//   new StaleWhileRevalidate({
//     cacheName: "news-requests",
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [0, 200] }),
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 60 * 60 * 24 * 30,
//       }),
//     ],
//   })
// );

import { precacheAndRoute, matchPrecache } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import {
  CacheFirst,
  StaleWhileRevalidate,
  NetworkOnly,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

precacheAndRoute([...self.__WB_MANIFEST]);

registerRoute(({ request }) => request.mode === "navigate", new NetworkOnly());

setCatchHandler(async ({ event }) => {
  console.log("⚠️ [SW] Catch triggered for", event.request.url);

  if (event.request.destination === "document") {
    const cached = await matchPrecache("/offline.html");
    console.log("📄 [SW] Returning offline.html:", !!cached);
    return cached || new Response("Offline page not found", { status: 503 });
  }

  return Response.error();
});

registerRoute(
  ({ url }) =>
    url.origin === "http://localhost:5001" && url.pathname.endsWith(".js"),
  new CacheFirst({
    cacheName: "remote-weather-js",
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === "http://localhost:5002" && url.pathname.endsWith(".js"),
  new CacheFirst({
    cacheName: "remote-news-js",
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// 🔹 Кэширование локальных изображений
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// 🔹 Кэширование картинок с localhost:3001
registerRoute(
  /^https?:\/\/localhost:5001\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: "remote-weather-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// 🔹 Кэширование запросов к newsapi.org
registerRoute(
  /^https:\/\/newsapi\.org\/v2\/.*$/,
  new StaleWhileRevalidate({
    cacheName: "remote-news-requests",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
