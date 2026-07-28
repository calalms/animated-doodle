// sw.js — minimal cache-on-fetch service worker for the vanilla build.
// Same simple behavior as the dc-runtime variant's inline data: URL worker
// (cache GET responses as they're fetched, serve from cache on repeat
// visits), just written as a normal file instead of registered inline.
const CACHE = 'vanilla-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});
