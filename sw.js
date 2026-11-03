const CACHE_NAME = 'qc-scan-v4-final-terang';
const urlsToCache = [
  './',
  './index.html',
  './scan.html',
  './riwayat.html',
  './manifest.json',
  './logo.png',
  './html5-qrcode.minjs',
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
  // Kalau scan.html, coba internet dulu biar terbaru, kalau offline baru pakai cache!
  if (event.request.url.includes('scan.html')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          // kalau online, simpan yang terbaru ke cache
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
