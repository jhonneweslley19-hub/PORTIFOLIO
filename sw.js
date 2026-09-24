// Service worker: o site funciona offline após a primeira visita.
// A versão abaixo é trocada automaticamente pelo deploy (hash do commit),
// então cada publicação invalida o cache antigo — não precisa editar à mão.
const VERSION = "dev";
const CACHE = `portfolio-${VERSION}`;
const CORE = [
  "./", "index.html", "404.html", "css/styles.css", "manifest.webmanifest",
  "assets/favicon.svg", "assets/fonts/inter.woff2", "assets/fonts/jetbrains-mono.woff2",
  "js/main.js", "js/data.js", "js/dom.js", "js/terminal.js", "js/github.js", "js/palette.js",
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
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== location.origin) return;

  // Páginas e dados: rede primeiro (conteúdo sempre atualizado), cache se estiver offline
  if (request.mode === "navigate" || url.pathname.endsWith(".json")) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone(); // clona antes de o navegador consumir o corpo
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(request)) ?? caches.match("./")),
    );
    return;
  }

  // Arquivos estáticos: cache primeiro, atualizando em segundo plano
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => { if (res.ok) cache.put(request, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
