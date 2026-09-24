/**
 * Componentes de interface reutilizáveis: abas acessíveis, posicionamento de
 * popovers, indicador animado do menu, atalhos de teclado e "voltar ao topo".
 */

/** Abas no padrão WAI-ARIA: clique, ←/→, Home/End. */
export function initTabs(tablist, { onChange } = {}) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
    onChange?.(tab);
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
  return { select: (i) => select(tabs[i]) };
}

/** Posiciona um popover logo abaixo do elemento que o abriu. */
export function placeBelow(popover, anchor, { align = "start", gap = 8 } = {}) {
  const r = anchor.getBoundingClientRect();
  const w = popover.offsetWidth;
  let left = align === "end" ? r.right - w : r.left;
  left = Math.max(12, Math.min(left, innerWidth - w - 12));
  const below = r.bottom + gap;
  const top = below + popover.offsetHeight > innerHeight - 12 ? r.top - popover.offsetHeight - gap : below;
  Object.assign(popover.style, { left: `${left}px`, top: `${Math.max(12, top)}px` });
}

/** Menu suspenso com Popover API: posiciona, fecha ao escolher e navega com ↑/↓. */
export function initDropdown(menu) {
  const trigger = document.querySelector(`[popovertarget="${menu.id}"]`);
  const items = () => [...menu.querySelectorAll('[role="menuitem"]')];
  menu.addEventListener("toggle", (e) => {
    const open = e.newState === "open";
    trigger.setAttribute("aria-expanded", String(open));
    if (open) {
      placeBelow(menu, trigger, { align: "end" });
      items()[0]?.focus();
    }
  });
  menu.addEventListener("click", (e) => { if (e.target.closest('[role="menuitem"]')) menu.hidePopover(); });
  menu.addEventListener("keydown", (e) => {
    const list = items();
    const i = list.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
  });
  addEventListener("resize", () => menu.matches(":popover-open") && menu.hidePopover());
}

/** "Pílula" que desliza até o link da seção atual. */
export function initNavIndicator(nav) {
  const pill = nav.querySelector(".nav-indicator");
  const update = () => {
    const current = nav.querySelector('a[aria-current="true"]');
    if (!current) { pill.style.opacity = "0"; return; }
    const n = nav.getBoundingClientRect();
    const r = current.getBoundingClientRect();
    Object.assign(pill.style, {
      opacity: "1", width: `${r.width}px`, height: `${r.height}px`,
      transform: `translate(${r.left - n.left}px, ${r.top - n.top}px)`,
    });
  };
  new MutationObserver(update).observe(nav, { attributes: true, subtree: true, attributeFilter: ["aria-current"] });
  addEventListener("resize", update);
  document.fonts?.ready.then(update);
  update();
}

/** Botão "voltar ao topo": aparece quando o topo da página sai da tela. */
export function initToTop(button, hero) {
  new IntersectionObserver(([e]) => button.classList.toggle("show", !e.isIntersecting)).observe(hero);
}

const isTyping = (el) => el.closest?.("input, textarea, select, [contenteditable]") || el.isContentEditable;

/**
 * Atalhos de teclado estilo GitHub.
 * `shortcuts`: [{ keys: ["g", "p"], label, run }] — sequências de até 2 teclas.
 */
export function initShortcuts(shortcuts, dialog) {
  let pending = null;
  let timer;

  addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || document.querySelector("dialog[open]")) return;
    const key = e.key.toLowerCase();
    const seq = pending ? [pending, key] : [key];
    const match = shortcuts.find((s) => s.keys.join() === seq.join());
    const prefix = !pending && shortcuts.some((s) => s.keys.length > 1 && s.keys[0] === key);

    clearTimeout(timer);
    pending = null;
    if (match) { e.preventDefault(); match.run(); }
    else if (prefix) { pending = key; timer = setTimeout(() => (pending = null), 1200); }
  });

  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
}

/* ─────────────────────────────────────────────────────────────
   Efeitos de movimento — todos respeitam prefers-reduced-motion
   e só usam o ponteiro quando ele é preciso (mouse/trackpad).
   ───────────────────────────────────────────────────────────── */
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Divide o texto em palavras para uma entrada escalonada (leitores de tela leem o texto inteiro). */
export function splitWords(el, startDelay = 0) {
  const text = el.textContent.trim();
  if (!text) return 0;
  const readable = document.createElement("span");
  readable.className = "sr-only";
  readable.textContent = text;
  el.replaceChildren(readable, ...text.split(/\s+/).map((word, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", i + startDelay);
    span.textContent = word;
    return span;
  }).flatMap((span, i, all) => (i < all.length - 1 ? [span, " "] : [span])));
  return text.split(/\s+/).length;
}

/** Botões "magnéticos": acompanham levemente o cursor. */
export function initMagnetic(root = document) {
  if (reduceMotion() || !finePointer()) return;
  root.addEventListener("pointermove", (e) => {
    const el = e.target.closest?.(".magnetic");
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.25}px`;
  });
  root.addEventListener("pointerout", (e) => {
    const el = e.target.closest?.(".magnetic");
    if (el && !el.contains(e.relatedTarget)) el.style.translate = "";
  });
}

/** Brilho que segue o cursor em cartões `.spotlight` e na aurora do topo. */
export function initSpotlight() {
  if (!finePointer()) return;
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".spotlight, .hero");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });
}

/** Inclinação 3D suave de um elemento conforme a posição do cursor. */
export function initTilt(el, max = 6) {
  if (!el || reduceMotion() || !finePointer()) return;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
}

/**
 * Entradas ao rolar. Onde o navegador suporta CSS scroll-driven animations
 * (animation-timeline: view()) o CSS faz tudo; aqui fica só o fallback.
 */
export function initReveal() {
  const items = document.querySelectorAll(".reveal, .reveal-item");
  if (CSS.supports("animation-timeline: view()") && !reduceMotion()) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target)));
  }, { threshold: 0.08 });
  items.forEach((el) => io.observe(el));
}

/** Anel de progresso de leitura no botão "voltar ao topo". */
export function initScrollProgress(el) {
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    el.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(3) : 0);
  };
  addEventListener("scroll", () => { raf ||= requestAnimationFrame(update); }, { passive: true });
  update();
}
