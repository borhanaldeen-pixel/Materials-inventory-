// Service Worker — QPT ERP (Cache-First / Offline First)
const CACHE_NAME = 'qpt-erp-v1';   // غيّر الرقم عند كل تحديث للتطبيق
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./vendor/FileSaver.min.js",
  "./vendor/apexcharts.min.js",
  "./vendor/app.css",
  "./vendor/chart.umd.min.js",
  "./vendor/exceljs.min.js",
  "./vendor/tajawal-arabic-400-normal.woff2",
  "./vendor/tajawal-arabic-700-normal.woff2",
  "./vendor/tajawal-arabic-900-normal.woff2",
  "./vendor/tajawal-latin-400-normal.woff2",
  "./vendor/tajawal-latin-700-normal.woff2",
  "./vendor/tajawal-latin-900-normal.woff2"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok) { const cp = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, cp)); }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    })
  );
});
