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
    width: 1200px; height: 630px; padding: 80px 90px; color: #e7eaf3; font-family: Inter;
    display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;
    background:
      radial-gradient(45% 60% at 10% 10%, rgb(124 108 255 / .45), transparent 70%),
      radial-gradient(40% 55% at 95% 0%, rgb(34 211 238 / .3), transparent 70%),
      #0a0d14;
  }
  .grid { position: absolute; inset: 0; opacity: .12;
    background-image: linear-gradient(#7c6cff 1px, transparent 1px), linear-gradient(90deg, #7c6cff 1px, transparent 1px);
    background-size: 48px 48px; mask-image: linear-gradient(to bottom right, #000, transparent 70%); }
  .brand { font-family: Mono; font-size: 34px; font-weight: 700; } .brand b { color: #7c6cff; }
  h1 { margin-top: 48px; font-size: 104px; font-weight: 800; letter-spacing: -.045em; line-height: 1; }
  h2 { margin-top: 22px; font-family: Mono; font-size: 44px; font-weight: 700; letter-spacing: -.03em;
       background: linear-gradient(95deg, #7c6cff, #22d3ee); -webkit-background-clip: text; color: transparent; }
  .url { position: absolute; left: 90px; bottom: 60px; font-family: Mono; font-size: 24px; color: #8b93a9; }
</style></head><body>
  <div class="grid"></div>
  <div class="brand"><b>&lt;</b>JW<b>/&gt;</b></div>
  <h1>${esc(profile.name)}</h1>
  <h2>${esc(profile.role)}</h2>
  <div class="url">jhonneweslley19-hub.github.io/PORTIFOLIO</div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await tab.setContent(page, { waitUntil: "load" });
await tab.evaluate(() => document.fonts.ready);
await tab.screenshot({ path: "assets/og.png" });
await browser.close();
console.log("✔ assets/og.png");
