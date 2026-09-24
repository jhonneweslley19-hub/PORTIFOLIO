/** Paleta de comandos estilo “Ctrl/⌘ + K”. */
export function initPalette({ disciplines, profile, toast }) {
  const dialog = document.querySelector(".palette");
  const input = dialog.querySelector("input");
  const list = dialog.querySelector("ul");

  const goto = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const open = (url) => () => window.open(url, "_blank", "noopener");

  const commands = [
    { label: "Sobre", hint: "seção", run: goto("sobre") },
    { label: "Disciplinas", hint: "seção", run: goto("disciplinas") },
    { label: "Jornada acadêmica", hint: "seção", run: goto("jornada") },
    { label: "Flashcards", hint: "seção", run: goto("flashcards") },
    { label: "Produções", hint: "seção", run: goto("producoes") },
    { label: "Contato", hint: "seção", run: goto("contato") },
    ...disciplines.map((d) => ({ label: `${d.icon} ${d.name}`, hint: "disciplina", run: goto("disciplinas") })),
    { label: "Alternar tema claro/escuro", hint: "ação", run: () => document.getElementById("theme-toggle").click() },
    {
      label: "Copiar e-mail", hint: "ação",
      run: async () => { try { await navigator.clipboard.writeText(profile.email); toast("E-mail copiado ✓"); } catch {} },
    },
    ...Object.entries(profile.links).filter(([, u]) => u)
      .map(([k, u]) => ({ label: `Abrir ${k[0].toUpperCase() + k.slice(1)}`, hint: "link", run: open(u) })),
  ];

  let results = commands;
  let active = 0;
  const norm = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  function draw() {
    list.replaceChildren(...results.map((c, i) => {
      const li = document.createElement("li");
      li.role = "option";
      li.setAttribute("aria-selected", String(i === active));
      li.innerHTML = "<span></span><small></small>";
      li.firstChild.textContent = c.label;
      li.lastChild.textContent = c.hint;
      li.onpointermove = () => { if (active !== i) { active = i; draw(); } };
      li.onclick = () => exec(c);
      return li;
    }));
    list.children[active]?.scrollIntoView({ block: "nearest" });
  }

  function exec(c) { dialog.close(); c?.run(); }

  function show() {
    input.value = ""; results = commands; active = 0; draw();
    dialog.showModal(); input.focus();
  }

  input.addEventListener("input", () => {
    const q = norm(input.value.trim());
    results = commands.filter((c) => norm(c.label + " " + c.hint).includes(q));
    active = 0; draw();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % Math.max(results.length, 1); draw(); }
    if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + results.length) % Math.max(results.length, 1); draw(); }
    if (e.key === "Enter") { e.preventDefault(); exec(results[active]); }
  });

  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  document.querySelectorAll("[data-open-palette]").forEach((b) => b.addEventListener("click", show));
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog.open ? dialog.close() : show();
    }
  });
}
