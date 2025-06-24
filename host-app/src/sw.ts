/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("install", (event) => {
  console.log("Service Worker установился");
  self.skipWaiting();
});

// Пример кэширования внешнего API
registerRoute(
  ({ url }) =>
    url.origin === "https://newsapi.org" && url.pathname.startsWith("/v2/"),
  new StaleWhileRevalidate({
    cacheName: "news-requests",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);
