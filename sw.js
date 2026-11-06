const CACHE_NAME = "qc-v8-final";
const FILES = ["./", "./index.html", "./manifest.json", "./logo.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("html5-qrcode")) return;
  if (e.request.url.includes("chrome-extension")) return;
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
