// Gera assets/og.png (1200×630): a imagem que aparece ao compartilhar o link.
// Uso: npm run og   (rode de novo se mudar nome ou cargo em js/data.js)
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { profile } from "../js/data.js";

// Fontes embutidas em base64 (páginas em about:blank não podem carregar file://)
const font = (f) => `data:font/woff2;base64,${readFileSync(`assets/fonts/${f}`).toString("base64")}`;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

const page = `<!doctype html><html><head><style>
  @font-face { font-family: Inter; src: url(${font("inter.woff2")}); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url(${font("jetbrains-mono.woff2")}); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 90px 96px; color: #e6e8ec; font-family: Inter;
    display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
    background: #0b0d11;
  }
  .dots { position: absolute; inset: 0;
    background-image: radial-gradient(rgb(230 232 236 / .13) 1.5px, transparent 1.5px); background-size: 28px 28px;
    mask-image: radial-gradient(55% 75% at 85% 20%, #000 15%, transparent 75%); }
  .brand { display: flex; align-items: center; gap: 18px; font-size: 30px; font-weight: 600; position: relative; }
  .mark { width: 56px; height: 56px; border-radius: 14px; background: #e6e8ec; color: #0b0d11;
          display: grid; place-items: center; font-size: 24px; font-weight: 800; }
  h1 { font-size: 92px; font-weight: 750; letter-spacing: -.045em; line-height: 1; position: relative; }
  h2 { margin-top: 22px; font-size: 40px; font-weight: 500; color: #8d95a3; letter-spacing: -.02em; }
  .foot { display: flex; gap: 14px; position: relative; }
  .pill { font-family: Mono; font-size: 22px; padding: 10px 18px; border-radius: 10px; border: 1px solid #2f3542; color: #c9ced8; }
  .pill b { color: #7b93ff; font-weight: 500; }
</style></head><body>
  <div class="dots"></div>
  <div class="brand"><div class="mark">JW</div>Portfólio</div>
  <div><h1>${esc(profile.name)}</h1><h2>${esc(profile.role)}${profile.university ? ` · ${esc(profile.university)}` : ""}</h2></div>
  <div class="foot"><span class="pill"><b>●</b> TypeScript</span><span class="pill"><b>●</b> React</span><span class="pill"><b>●</b> Supabase</span></div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await tab.setContent(page, { waitUntil: "load" });
await tab.evaluate(() => document.fonts.ready);
await tab.screenshot({ path: "assets/og.png" });
await browser.close();
console.log("✔ assets/og.png");
