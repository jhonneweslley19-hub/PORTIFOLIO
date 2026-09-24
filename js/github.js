import { html, escape, toString } from "./dom.js";

const CACHE_KEY = "gh-repos";
const TTL = 1000 * 60 * 60; // 1h — evita estourar o limite da API pública

async function fetchRepos(user) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.t < TTL) return cached.data;
  } catch {}

  const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=12`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(res.status);
  const data = (await res.json()).filter((r) => !r.fork);
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch {}
  return data;
}

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
function ago(date) {
  const days = Math.round((new Date(date) - Date.now()) / 864e5);
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

export async function loadRepos(el, user) {
  if (!el || !user) return;
  const profileUrl = `https://github.com/${user}`;
  try {
    const repos = (await fetchRepos(user)).slice(0, 6);
    el.innerHTML = repos.length
      ? repos.map((r) => toString(html`
          <a class="card repo" href="${r.html_url}" target="_blank" rel="noopener">
            <h4>${r.name}</h4>
            <p>${r.description || "Sem descrição."}</p>
            <div class="meta">
              ${r.language ? html`<span>● ${r.language}</span>` : ""}
              ${r.stargazers_count ? html`<span>★ ${r.stargazers_count}</span>` : ""}
              <span>atualizado ${ago(r.pushed_at)}</span>
            </div>
          </a>`)).join("")
      : `<div class="empty">Nenhum repositório público ainda. <a href="${escape(profileUrl)}" target="_blank" rel="noopener">Ver perfil no GitHub →</a></div>`;
  } catch {
    el.innerHTML = `<div class="empty">Não foi possível carregar os repositórios agora. <a href="${escape(profileUrl)}" target="_blank" rel="noopener">Ver perfil no GitHub →</a></div>`;
  } finally {
    el.removeAttribute("aria-busy");
  }
}
