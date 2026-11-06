const CACHE_NAME = "qc-v6-fix-clone";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.map((k) => { if(k !== CACHE_NAME) return caches.delete(k) }))
    )
  );
});

self.addEventListener("fetch", (e) => {
  // SKIP JANGAN CACHE KAMERA & API
  if (e.request.method !== "GET" || e.request.url.includes("api") || e.request.url.includes("html5-qrcode")) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // CLONE DULU BARU DI SIMPEN! INI KUNCINYA!
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
