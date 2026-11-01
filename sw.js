const CACHE_NAME = 'qc-scan-v3-final-terang';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
  // scan.html SENGAJA GAK DI CACHE BIAR SELALU TERBARU!
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Kalau scan.html, JANGAN pakai cache, ambil dari internet terbaru!
  if (event.request.url.includes('scan.html')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
