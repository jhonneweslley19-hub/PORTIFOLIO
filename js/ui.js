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
