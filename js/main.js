import * as data from "./data.js";
import { html, render, toString } from "./dom.js";
import { fetchRepos, loadRepos } from "./github.js";
import { startNetwork, startTyping } from "./network.js";
import { initPalette } from "./palette.js";
import { initTerminal } from "./terminal.js";

const { profile } = data;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const ICONS = {
  github: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>`,
};
const LABELS = { github: "GitHub", linkedin: "LinkedIn" };

/* ── Textos simples ─────────────────────────────── */
function bindText() {
  const values = {
    ...profile,
    initials: profile.name.split(" ").map((w) => w[0]).slice(0, 2).join(""),
    year: new Date().getFullYear(),
    eyebrow: [profile.role, profile.semester, profile.university].filter(Boolean).join(" · "),
  };
  $$("[data-bind]").forEach((el) => {
    const v = values[el.dataset.bind];
    if (v) el.textContent = v;
  });
}

/* Cartão "jhonne.js" com o perfil em forma de código */
function aboutCode() {
  const str = (v) => html`<span class="s">"${v}"</span>`;
  const fields = [
    ["nome", str(profile.name)],
    ["curso", str("Engenharia de Software")],
    profile.university && ["faculdade", str(profile.university)],
    profile.city && ["local", str(profile.city)],
    ["stack", html`[${data.stack.flatMap((g) => g.items).filter((i) => i.status === "uso").slice(0, 4)
      .map((i, n) => html`${n ? ", " : ""}${str(i.name)}`)}]`],
    ["aprendendo", html`<span class="k">true</span>`],
  ].filter(Boolean);
  return html`<span class="c">// quem sou, em código</span>
<span class="k">const</span> <span class="p">jhonne</span> = {
${fields.map(([k, v]) => html`  ${k}: ${v},\n`)}};`;
}

/* ── Seções renderizadas a partir de data.js ────── */
function renderStats(extra = []) {
  render("stats", [...data.stats, ...extra].filter((s) => s.value !== ""), (s) => html`<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`);
}

function renderSections() {
  renderStats();
  render("about", profile.about, (p) => html`<p>${p}</p>`);
  $('[data-render="about-code"]').innerHTML = toString(aboutCode());

  render("stack", data.stack, (g) => html`
    <article class="card glow-card stack-group">
      <h3>${g.group}</h3>
      <ul>${g.items.map((i) => html`<li>${i.name}<span class="pill" data-status="${i.status}">${i.status}</span></li>`)}</ul>
    </article>`);

  render("projects", data.projects, (p) => html`
    <article class="card glow-card project">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">${p.tags.map((t) => html`<span class="tag">${t}</span>`)}</div>
      <div class="project-links">
        ${p.repo ? html`<a href="${p.repo}" target="_blank" rel="noopener">Código →</a>` : ""}
        ${p.demo ? html`<a href="${p.demo}" target="_blank" rel="noopener">Ver online →</a>` : ""}
      </div>
    </article>`);

  const statusLabel = { current: "em andamento", next: "planejado" };
  render("timeline", data.timeline, (t) => html`
    <li class="card" data-status="${t.status}">
      <time>${t.period}</time>
      <h3>${t.title}${statusLabel[t.status] ? html`<span class="badge">${statusLabel[t.status]}</span>` : ""}</h3>
      <p>${t.text}</p>
    </li>`);

  if (data.certificates.length) {
    $('[data-section="certificates"]').hidden = false;
    render("certificates", data.certificates, (c) => html`
      <li><strong>${c.url ? html`<a href="${c.url}" target="_blank" rel="noopener">${c.title}</a>` : c.title}</strong>
      <span>${[c.issuer, c.year].filter(Boolean).join(" · ")}</span></li>`);
  }

  render("socials", Object.entries(profile.links).filter(([, url]) => url), ([key, url]) => html`
    <a class="icon-btn" href="${url}" target="_blank" rel="noopener me" aria-label="${LABELS[key] ?? key}" title="${LABELS[key] ?? key}">${{ raw: ICONS[key] ?? "↗" }}</a>`);
}

/* ── Tema com View Transitions ──────────────────── */
function toggleTheme(e) {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();

  const x = e?.clientX ?? innerWidth / 2, y = e?.clientY ?? innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 550, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

/* ── Animações e navegação ─────────────────────── */
function initScrollFx() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target)));
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));

  // Destaca o link da seção visível
  const links = $$(".nav nav a, .mobile-menu a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        if (a.hash === `#${en.target.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
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
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".glow-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

/* ── Utilidades ─────────────────────────────────── */
function toast(msg) {
  const el = $(".toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2200);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast("E-mail copiado ✓");
  } catch {
    location.href = `mailto:${profile.email}`;
  }
}

/* ── Inicialização ──────────────────────────────── */
bindText();
renderSections();
initScrollFx();

$("#theme-toggle").addEventListener("click", toggleTheme);
$$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => $("#menu").hidePopover?.()));
$("[data-copy-email]").addEventListener("click", copyEmail);

startNetwork($(".net"));
startTyping($(".typed-text"), profile.roles);

const terminal = initTerminal({
  ...data,
  getRepos: () => fetchRepos(profile.githubUser),
  toggleTheme: () => toggleTheme(),
});

initPalette({ profile, projects: data.projects, toast, copyEmail, runCommand: terminal.exec });

loadRepos($('[data-render="repos"]'), profile.githubUser).then((repos) => {
  if (repos.length) renderStats([{ value: String(repos.length), label: "repositórios públicos" }]);
});

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
