// Monta a pasta _site/ só com o que vai para o ar e carimba a versão do service worker.
// Uso: npm run build   (o deploy roda isso automaticamente)
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const PUBLIC = [
  "index.html", "404.html", "manifest.webmanifest", "sw.js", "robots.txt", "sitemap.xml",
  "css", "js", "assets", "data",
];
const OUT = "_site";

rmSync(OUT, { recursive: true, force: true });
for (const path of PUBLIC) {
  if (existsSync(path)) cpSync(path, `${OUT}/${path}`, { recursive: true });
}

// Cada deploy ganha uma versão nova → o cache offline antigo é descartado sozinho
const version = (process.env.GITHUB_SHA || Date.now().toString(36)).slice(0, 8);
const sw = `${OUT}/sw.js`;
writeFileSync(sw, readFileSync(sw, "utf8").replace(/const VERSION = "dev";/, `const VERSION = "${version}";`));

console.log(`✔ ${OUT}/ pronto (service worker versão ${version})`);
