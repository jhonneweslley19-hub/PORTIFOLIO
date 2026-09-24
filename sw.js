// Service worker: funciona offline após a primeira visita.
// Estratégia "stale-while-revalidate" para arquivos do próprio site.
const CACHE = "portfolio-v2";
const CORE = [
  "./", "index.html", "css/styles.css", "manifest.webmanifest", "assets/favicon.svg",
  "js/main.js", "js/data.js", "js/dom.js", "js/network.js", "js/terminal.js", "js/github.js", "js/palette.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request)
        .then((res) => { if (res.ok) cache.put(e.request, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
