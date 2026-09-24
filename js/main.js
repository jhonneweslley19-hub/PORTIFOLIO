import { initComposer } from "./contact.js";
import * as data from "./data.js";
import { html, render, toString } from "./dom.js";
import { fetchRepos, loadRepos } from "./github.js";
import { initPalette } from "./palette.js";
import { initProjects, initSkills } from "./projects.js";
import { initTerminal } from "./terminal.js";
import { initDropdown, initNavIndicator, initShortcuts, initTabs, initToTop } from "./ui.js";

const { profile, education } = data;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const ICONS = {
  github: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>`,
};
const LABELS = { github: "GitHub", linkedin: "LinkedIn" };
const shortUrl = (u) => u.replace(/^https?:\/\/(www\.)?/, "");

/* ── Textos simples ─────────────────────────────── */
function bindText() {
  const values = {
    ...profile,
    year: new Date().getFullYear(),
    "edu-degree": education.degree,
    "edu-institution": education.institution,
    "edu-period": education.period,
    "edu-current": education.current,
  };
  $$("[data-bind]").forEach((el) => {
    const v = values[el.dataset.bind];
    if (v) el.textContent = v;
  });

  // Elementos opcionais: somem quando o dado correspondente está vazio
  const present = { status: profile.status, learning: data.learning.length };
  $$("[data-show]").forEach((el) => { el.hidden = !present[el.dataset.show]; });

  // O botão de currículo só entra na página se houver um PDF configurado
  const cvTpl = $("template[data-cv]");
  if (profile.cv) {
    const link = cvTpl.content.firstElementChild.cloneNode(true);
    link.href = profile.cv;
    cvTpl.replaceWith(link);
  }
}

/* ── Cartão de código do topo (3 abas) ──────────── */
const str = (v) => html`<span class="s">"${v}"</span>`;
const list = (items) => html`[${items.map((v, n) => html`${n ? ", " : ""}${str(v)}`)}]`;

function codePerfil() {
  const fields = [
    ["nome", str(profile.name)],
    ["curso", str("Engenharia de Software")],
    profile.university && ["faculdade", str(`${profile.university} · ${profile.semester}`)],
    profile.city && ["local", str(profile.city)],
    ["stack", list(["TypeScript", "React", "Supabase"])],
    data.learning.length && ["estudando", list(data.learning.slice(0, 3))],
    profile.status && ["disponível", html`<span class="k">true</span>`],
  ].filter(Boolean);
  return html`<span class="k">const</span> <span class="p">perfil</span> = {
${fields.map(([k, v]) => html`  ${k}: ${v},\n`)}};`;
}

function codeStack() {
  const groups = [...data.skills.map((g) => [g.group, g.items]), ["Estudando agora", data.learning]];
  return html`{
${groups.map(([g, items], n) => html`  ${str(g)}: ${list(items)}${n < groups.length - 1 ? "," : ""}\n`)}}`;
}

function codeContato() {
  const blocks = [
    ["echo $EMAIL", profile.email],
    ...Object.entries(profile.links).filter(([, u]) => u).map(([k, u]) => [`open ${k}`, shortUrl(u)]),
  ];
  return html`${blocks.map(([cmd, out]) => html`<span class="k">$</span> ${cmd}\n<span class="s">${out}</span>\n\n`)}<span class="c"># ou use o formulário de contato ↓</span>`;
}

/* ── Seções renderizadas a partir de data.js ────── */
function renderSections() {
  $('[data-render="code-perfil"]').innerHTML = toString(codePerfil());
  $('[data-render="code-stack"]').innerHTML = toString(codeStack());
  $('[data-render="code-contato"]').innerHTML = toString(codeContato());

  render("about", profile.about, (p) => html`<p>${p}</p>`);

  // Formação: uma aba por período, abrindo no período em andamento
  const stateLabel = { done: "concluído", current: "em andamento" };
  const curriculum = $('[data-render="curriculum"]');
  curriculum.innerHTML = toString(html`
    <div class="period-tabs" role="tablist" aria-label="Períodos">
      ${data.curriculum.map((p, i) => html`
        <button role="tab" type="button" id="ptab-${i}" aria-controls="ppanel-${i}" aria-selected="false" tabindex="-1">
          ${p.label} <span class="state" data-status="${p.status}">${stateLabel[p.status]}</span>
        </button>`)}
    </div>
    ${data.curriculum.map((p, i) => html`
      <div class="period" role="tabpanel" id="ppanel-${i}" aria-labelledby="ptab-${i}" data-status="${p.status}" tabindex="0" hidden>
        <p class="muted">${p.period} · ${p.courses.length} disciplinas</p>
        <ul>${p.courses.map((c) => html`<li>${c.name}</li>`)}</ul>
      </div>`)}`);
  const current = Math.max(0, data.curriculum.findIndex((p) => p.status === "current"));
  initTabs(curriculum.querySelector('[role="tablist"]')).select(current);

  if (data.certificates.length) {
    $('[data-section="certificates"]').hidden = false;
    render("certificates", data.certificates, (c) => html`
      <li><strong>${c.url ? html`<a href="${c.url}" target="_blank" rel="noopener">${c.title}</a>` : c.title}</strong>
      <span>${[c.issuer, c.year].filter(Boolean).join(" · ")}</span></li>`);
  }

  const socials = Object.entries(profile.links).filter(([, url]) => url);
  const social = ([key, url]) => html`
    <a class="icon-btn" href="${url}" target="_blank" rel="noopener me" aria-label="${LABELS[key] ?? key}" title="${LABELS[key] ?? key}">${{ raw: ICONS[key] ?? "↗" }}</a>`;
  render("socials", socials, social);
  render("socials-hero", socials, social);
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
      { duration: 500, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

/* ── Animações e navegação ─────────────────────── */
function initScrollFx() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target)));
  }, { threshold: 0.08 });
  $$(".reveal").forEach((el) => io.observe(el));

  // Destaca o link da seção visível (o indicador animado acompanha)
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
    toast("E-mail copiado");
  } catch {
    location.href = `mailto:${profile.email}`;
  }
}

const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ── Inicialização ──────────────────────────────── */
bindText();
renderSections();
initScrollFx();

const projects = initProjects(data.projects);
initSkills({ ...data, openProject: projects.open });

initTabs($('[data-tabs="hero"]'));
initNavIndicator($(".nav nav"));
initDropdown($("#more-menu"));
initToTop($(".to-top"), $("#topo"));
initComposer($("[data-composer]"), profile.email);

$("#theme-toggle").addEventListener("click", toggleTheme);
$$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => $("#menu").hidePopover?.()));
$$("[data-copy-email]").forEach((b) => b.addEventListener("click", copyEmail));

const terminal = initTerminal({
  ...data,
  getRepos: () => fetchRepos(profile.githubUser),
  toggleTheme: () => toggleTheme(),
});

const palette = initPalette({ profile, projects: data.projects, copyEmail, runCommand: terminal.exec, openProject: projects.open });

// Atalhos de teclado (a lista aparece com "?")
const shortcutsDialog = $("dialog.shortcuts");
const shortcuts = [
  { keys: ["?"], label: "Mostrar esta lista", run: () => shortcutsDialog.showModal() },
  { keys: ["/"], label: "Busca rápida", run: () => palette.open() },
  { keys: ["t"], label: "Alternar tema claro/escuro", run: () => toggleTheme() },
  { keys: ["g", "p"], label: "Ir para Projetos", run: () => goto("projetos") },
  { keys: ["g", "s"], label: "Ir para Sobre", run: () => goto("sobre") },
  { keys: ["g", "f"], label: "Ir para Formação", run: () => goto("formacao") },
  { keys: ["g", "t"], label: "Ir para o Terminal", run: () => goto("terminal") },
  { keys: ["g", "c"], label: "Ir para Contato", run: () => goto("contato") },
  { keys: ["g", "g"], label: "Voltar ao topo", run: () => goto("topo") },
];
render("shortcuts", [
  ...shortcuts,
  { keys: ["Ctrl", "K"], label: "Busca rápida (em qualquer lugar)" },
  { keys: ["Esc"], label: "Fechar painéis e menus" },
], (s) => html`<div><dt>${s.keys.map((k, i) => html`${i ? html`<span class="then">${s.keys[0] === "Ctrl" ? "+" : "depois"}</span>` : ""}<kbd>${k}</kbd>`)}</dt><dd>${s.label}</dd></div>`);
initShortcuts(shortcuts, shortcutsDialog);
$$("[data-open-shortcuts]").forEach((b) => b.addEventListener("click", () => shortcutsDialog.showModal()));

loadRepos($('[data-render="repos"]'), profile.githubUser);

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
