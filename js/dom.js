/**
 * Mini-template seguro: interpolações são escapadas automaticamente,
 * arrays são concatenados e `{ raw: "..." }` insere HTML confiável.
 */
const RAW = Symbol("raw");

export const escape = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const toHTML = (v) => {
  if (v == null || v === false) return "";
  if (Array.isArray(v)) return v.map(toHTML).join("");
  if (typeof v === "object" && RAW in v) return v[RAW];
  if (typeof v === "object" && "raw" in v) return v.raw;
  return escape(v);
};

export function html(strings, ...values) {
  return { [RAW]: strings.reduce((out, s, i) => out + s + (i < values.length ? toHTML(values[i]) : ""), "") };
}

/** Converte um template em string HTML. */
export const toString = toHTML;

export function render(name, items, template) {
  const el = document.querySelector(`[data-render="${name}"]`);
  if (!el) return;
  el.innerHTML = items.map((item) => toHTML(template(item))).join("");
}
