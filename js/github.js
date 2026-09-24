import { html, escape, toString } from "./dom.js";

const CACHE_KEY = "gh-repos";
const TTL = 1000 * 60 * 60; // 1h — evita estourar o limite da API pública
let pending = null;

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

/** Mantém só os campos usados pelo site (mesmo formato de data/repos.json). */
export const slim = (repos) => repos
  .filter((r) => !r.fork && !r.archived)
  .map(({ name, description, html_url, language, stargazers_count, pushed_at, homepage }) =>
    ({ name, description, html_url, language, stargazers_count, pushed_at, homepage }));

/** Busca os repositórios públicos (com cache e uma única requisição compartilhada). */
export function fetchRepos(user) {
  return (pending ??= (async () => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.t < TTL) return cached.data;
    } catch {}

    // 1º: arquivo gerado no deploy (scripts/fetch-repos.mjs) — não gasta o limite da API
    // 2º: API pública do GitHub (60 req/h por IP), usada no desenvolvimento local
    const data = await fetchJSON("data/repos.json")
      .catch(() => fetchJSON(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30`).then(slim));
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch {}
    return data;
  })().catch((err) => { pending = null; throw err; }));
}

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
function ago(date) {
  const days = Math.round((new Date(date) - Date.now()) / 864e5);
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

export async function loadRepos(el, user) {
  if (!el || !user) return [];
  const profileUrl = escape(`https://github.com/${user}`);
  try {
    const repos = await fetchRepos(user);
    el.innerHTML = repos.length
      ? repos.slice(0, 6).map((r) => toString(html`
          <a class="card repo" href="${r.html_url}" target="_blank" rel="noopener">
            <h3>${r.name}</h3>
            <p>${r.description || "Sem descrição."}</p>
            <div class="meta">
              ${r.language ? html`<span>● ${r.language}</span>` : ""}
              ${r.stargazers_count ? html`<span>★ ${r.stargazers_count}</span>` : ""}
              <span>atualizado ${ago(r.pushed_at)}</span>
            </div>
          </a>`)).join("")
      : `<div class="empty">Nenhum repositório público ainda. <a href="${profileUrl}" target="_blank" rel="noopener">Ver perfil no GitHub →</a></div>`;
    return repos;
  } catch {
    el.innerHTML = `<div class="empty">Não foi possível carregar os repositórios agora. <a href="${profileUrl}" target="_blank" rel="noopener">Ver perfil no GitHub →</a></div>`;
    return [];
  } finally {
    el.removeAttribute("aria-busy");
  }
}
