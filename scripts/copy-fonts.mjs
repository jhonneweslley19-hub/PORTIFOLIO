// Copia as fontes variáveis (Inter e JetBrains Mono) do npm para assets/fonts.
// Assim o site não depende do Google Fonts: carrega mais rápido e sem rastreamento.
import { copyFileSync, mkdirSync } from "node:fs";

const files = {
  "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2": "inter.woff2",
  "node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2": "jetbrains-mono.woff2",
};

mkdirSync("assets/fonts", { recursive: true });
for (const [from, to] of Object.entries(files)) {
  copyFileSync(from, `assets/fonts/${to}`);
  console.log(`✔ assets/fonts/${to}`);
}
