import { html, render, toString } from "./dom.js";
import { placeBelow } from "./ui.js";

export const ICON_GITHUB = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>`;
const CHECK = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const norm = (s) => s.toLowerCase();
/** Todas as tecnologias de um projeto: as visíveis (`tags`) e as extras (`uses`). */
const techOf = (p) => [...p.tags, ...(p.uses ?? [])].map(norm);

const demoLink = (p, cls = "btn small primary") =>
  p.demo ? html`<a class="${cls}" href="${p.demo}" target="_blank" rel="noopener">Ver online ↗</a>` : "";
const codeLink = (p) =>
  p.repo ? html`<a class="btn small ghost" href="${p.repo}" target="_blank" rel="noopener">${{ raw: ICON_GITHUB }} Código</a>` : "";

export function initProjects(projects) {
  const drawer = document.querySelector(".drawer");
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  render("projects", projects, (p) => html`
    <article class="card project" id="card-${p.slug}">
      <div>
        <h3>${p.title}</h3>
        <p class="summary">${p.summary}</p>
        <ul class="chips" aria-label="Tecnologias">${p.tags.map((t) => html`<li>${t}</li>`)}</ul>
        <div class="project-links">
          <button class="btn small primary" type="button" data-project="${p.slug}">Ver detalhes ${{ raw: ARROW }}</button>
          ${codeLink(p)}
          ${demoLink(p, "link")}
        </div>
      </div>
      <ul class="highlights" aria-label="Destaques">${p.highlights.map((h) => html`<li>${{ raw: CHECK }}<span>${h}</span></li>`)}</ul>
    </article>`);

  /* ── Painel de detalhes ───────────────────────── */
  function open(slug, { updateUrl = true } = {}) {
    const p = bySlug.get(slug);
    if (!p) return;
    const i = projects.indexOf(p);
    const prev = projects[(i - 1 + projects.length) % projects.length];
    const next = projects[(i + 1) % projects.length];

    render("drawer", [p], () => html`
      <header class="drawer-head">
        <p class="kicker">Projeto ${i + 1} de ${projects.length}</p>
        <form method="dialog"><button class="icon-btn" aria-label="Fechar detalhes">✕</button></form>
      </header>
      <h2 id="drawer-title" tabindex="-1">${p.title}</h2>
      <p class="lead">${p.summary}</p>
      <div class="project-links">${demoLink(p)}${codeLink(p)}</div>
      ${p.problem ? html`<section><h3>O problema</h3><p>${p.problem}</p></section>` : ""}
      ${p.solution ? html`<section><h3>A solução</h3><p>${p.solution}</p></section>` : ""}
      <section>
        <h3>O que eu fiz</h3>
        <ul class="highlights">${p.highlights.map((h) => html`<li>${{ raw: CHECK }}<span>${h}</span></li>`)}</ul>
      </section>
      <section>
        <h3>Tecnologias</h3>
        <ul class="chips">${[...p.tags, ...(p.uses ?? [])].map((t) => html`<li>${t}</li>`)}</ul>
      </section>
      ${projects.length > 1 ? html`
        <footer class="drawer-nav">
          <button class="btn small ghost" type="button" data-project="${prev.slug}">← ${prev.title}</button>
          <button class="btn small ghost" type="button" data-project="${next.slug}">${next.title} →</button>
        </footer>` : ""}`);

    if (!drawer.open) drawer.showModal();
    drawer.querySelector(".drawer-inner").scrollTop = 0;
    drawer.querySelector("h2").focus({ preventScroll: true });
    if (updateUrl) history.replaceState(null, "", `#projeto/${slug}`);
  }

  drawer.addEventListener("close", () => {
    if (location.hash.startsWith("#projeto/")) history.replaceState(null, "", "#projetos");
  });
  drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-project]");
    if (btn) open(btn.dataset.project);
  });

  // Link direto: /#projeto/calculadora-nutri abre o painel
  const deepLink = () => {
    const m = location.hash.match(/^#projeto\/([\w-]+)$/);
    if (m) open(m[1], { updateUrl: false });
  };
  addEventListener("hashchange", deepLink);
  deepLink();

  return { open };
}

/**
 * Competências clicáveis: cada tecnologia usada em algum projeto vira um botão
 * que mostra em quais projetos ela aparece.
 */
export function initSkills({ skills, learning, projects, openProject }) {
  const pop = document.getElementById("skill-pop");
  const usedIn = (skill) => projects.filter((p) => techOf(p).includes(norm(skill)));

  const chip = (skill) => usedIn(skill).length
    ? html`<li><button type="button" class="chip-btn" data-skill="${skill}" popovertarget="skill-pop" aria-haspopup="dialog">${skill}</button></li>`
    : html`<li>${skill}</li>`;

  render("skills", skills, (g) => html`
    <div><dt>${g.group}</dt><dd><ul class="chips">${g.items.map(chip)}</ul></dd></div>`);
  render("learning", learning, (i) => html`<li>${i}</li>`);

  let anchor = null;
  document.addEventListener("click", (e) => { anchor = e.target.closest("[data-skill]") ?? anchor; }, true);

  pop.addEventListener("beforetoggle", (e) => {
    if (e.newState !== "open" || !anchor) return;
    const skill = anchor.dataset.skill;
    pop.innerHTML = toString(html`
      <p class="pop-title">${skill} <span class="muted">· usado em</span></p>
      <ul>${usedIn(skill).map((p) => html`
        <li><button type="button" data-open="${p.slug}"><strong>${p.title}</strong><span>${p.summary}</span></button></li>`)}
      </ul>`);
  });
  pop.addEventListener("toggle", (e) => {
    if (e.newState === "open" && anchor) placeBelow(pop, anchor);
    document.querySelectorAll("[data-skill]").forEach((b) => b.classList.toggle("active", e.newState === "open" && b === anchor));
  });
  pop.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    pop.hidePopover();
    openProject(btn.dataset.open);
  });
}
