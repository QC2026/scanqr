const CACHE_NAME = "qc-v7-final";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { 
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => k!==CACHE_NAME && caches.delete(k))))); 
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || e.request.url.includes("html5-qrcode")) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
