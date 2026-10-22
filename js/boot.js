// Aplica o tema salvo antes da renderização (evita "flash").
// Fica num arquivo próprio (e não inline) para a CSP aceitar só scripts do próprio site.
document.documentElement.classList.add("js");
try {
  const t = localStorage.getItem("theme");
  if (t) document.documentElement.dataset.theme = t;
  else if (matchMedia("(prefers-color-scheme: light)").matches) document.documentElement.dataset.theme = "light";
} catch {}
