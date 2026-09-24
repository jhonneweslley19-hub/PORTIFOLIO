// Gera data/repos.json no deploy, usando o GITHUB_TOKEN do Actions.
// O site lê esse arquivo primeiro e só recorre à API pública se ele não existir.
import { mkdirSync, writeFileSync } from "node:fs";
import { slim } from "../js/github.js";

const user = process.env.GH_USER || "jhonneweslley19-hub";
const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`, { headers });
if (!res.ok) {
  console.error(`GitHub API respondeu ${res.status}; o site usará a API pública como alternativa.`);
  process.exit(0); // não quebra o deploy
}

const repos = slim(await res.json());

mkdirSync("data", { recursive: true });
writeFileSync("data/repos.json", JSON.stringify(repos, null, 2));
console.log(`✔ data/repos.json com ${repos.length} repositórios`);
