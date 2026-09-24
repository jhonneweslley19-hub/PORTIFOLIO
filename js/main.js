import * as data from "./data.js";
import { html, render, escape } from "./dom.js";
import { startECG } from "./ecg.js";
import { initDeck } from "./flashcards.js";
import { loadRepos } from "./github.js";
import { initPalette } from "./palette.js";

const { profile } = data;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const ICONS = {
  github: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>`,
  lattes: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 19.5V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-1.5Zm0 0A2 2 0 0 1 6 17h12M8 7h6M8 11h6"/></svg>`,
};

/* ── Textos simples ─────────────────────────────── */
function bindText() {
  const values = {
    ...profile,
    initials: profile.name.split(" ").map((w) => w[0]).slice(0, 2).join(""),
    year: new Date().getFullYear(),
    semester: [profile.semester, profile.university].filter(Boolean).join(" · "),
  };
  $$("[data-bind]").forEach((el) => {
    const v = values[el.dataset.bind];
    if (v) el.textContent = v;
  });
}

/* ── Seções renderizadas a partir de data.js ────── */
function renderSections() {
  render("stats", data.stats.filter((s) => s.value), (s) => html`<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`);

  render("about", profile.about, (p) => html`<p>${p}</p>`);

  render("disciplines", data.disciplines, (d) => html`
    <article class="card discipline">
      <span class="icon" aria-hidden="true">${d.icon}</span>
      <h3>${d.name}</h3>
      <p>${d.summary}</p>
      <ul aria-label="Referências">${d.refs.map((r) => html`<li>${r}</li>`)}</ul>
    </article>`);

  const statusLabel = { current: "em andamento", next: "planejado" };
  render("timeline", data.timeline, (t) => html`
    <li class="card" data-status="${t.status}">
      <time>${t.period}</time>
      <h3>${t.title}${statusLabel[t.status] ? html`<span class="badge">${statusLabel[t.status]}</span>` : ""}</h3>
      <p>${t.text}</p>
    </li>`);

  render("works", data.works, (w) => {
    const tag = w.url ? "a" : "article";
    const attrs = w.url ? `href="${escape(w.url)}" target="_blank" rel="noopener"` : "";
    return html`
      <${tag} class="card work" ${{ raw: attrs }}>
        <span class="badge">${w.type}</span>
        <h4>${w.title}</h4>
        <p>${w.description ?? ""}</p>
        <div class="meta">${w.discipline ? html`<span>${w.discipline}</span>` : ""}${w.date ? html`<span>${w.date}</span>` : ""}</div>
      </${tag}>`;
  });
  $('[data-empty="works"]').hidden = data.works.length > 0;

  if (data.certificates.length) {
    $('[data-section="certificates"]').hidden = false;
    render("certificates", data.certificates, (c) => html`
      <li><strong>${c.url ? html`<a href="${c.url}" target="_blank" rel="noopener">${c.title}</a>` : c.title}</strong>
      <span>${[c.issuer, c.year].filter(Boolean).join(" · ")}</span></li>`);
  }

  render("tools", data.tools, (t) => html`<li>${t}</li>`);

  const labels = { github: "GitHub", linkedin: "LinkedIn", lattes: "Currículo Lattes" };
  render("socials", Object.entries(profile.links).filter(([, url]) => url), ([key, url]) => html`
    <a class="icon-btn" href="${url}" target="_blank" rel="noopener me" aria-label="${labels[key]}" title="${labels[key]}">${{ raw: ICONS[key] }}</a>`);
}

/* ── Tema com View Transitions ──────────────────── */
function initTheme() {
  const root = document.documentElement;
  $("#theme-toggle").addEventListener("click", (e) => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch {}
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();

    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  });
}

/* ── Animações e navegação ─────────────────────── */
function initScrollFx() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target)));
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));

  // Destaca o link da seção visível
  const links = new Map($$(".nav nav a").map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      links.get(en.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // Fallback da barra de progresso onde scroll-timeline não existe
  if (!CSS.supports("animation-timeline: scroll()")) {
    const bar = $(".progress");
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", max > 0 ? scrollY / max : 0);
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  // Brilho que acompanha o cursor nos cartões
  $$(".discipline").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ── Utilidades ─────────────────────────────────── */
export function toast(msg) {
  const el = $(".toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2200);
}

function initCopyEmail() {
  $("[data-copy-email]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast("E-mail copiado ✓");
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  });
}

/* ── Inicialização ──────────────────────────────── */
bindText();
renderSections();
initTheme();
initScrollFx();
initCopyEmail();
initDeck(data.flashcards);
initPalette({ disciplines: data.disciplines, profile, toast });
startECG($(".ecg"));
loadRepos($('[data-render="repos"]'), profile.githubUser);

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
