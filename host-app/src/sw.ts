/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{
    url: string;
    revision?: string;
  }>;
};

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);

// Кэшируем запросы к новостному API
registerRoute(
  ({ url }) =>
    url.origin === "https://newsapi.org" && url.pathname.startsWith("/v2/"),
  new StaleWhileRevalidate({
    cacheName: "remote-news-requests",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.mode === "navigate",
  async ({ request }) => {
    try {
      return await fetch(request);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const cached = await caches.match("/offline.html", {
        ignoreSearch: true,
      });
      return (
        cached ?? new Response("Offline page not available", { status: 503 })
      );
    }
  }
);

self.addEventListener("activate", () => {
  self.clients.claim();
});
