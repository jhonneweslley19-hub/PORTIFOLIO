/** Paleta de comandos estilo “Ctrl/⌘ + K”. */
export function initPalette({ profile, projects, copyEmail, runCommand }) {
  const dialog = document.querySelector(".palette");
  const input = dialog.querySelector("input");
  const list = dialog.querySelector("ul");

  const goto = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const open = (url) => () => window.open(url, "_blank", "noopener");
  const inTerminal = (cmd) => () => {
    goto("terminal")();
    runCommand(cmd);
  };

  const commands = [
    { label: "Projetos", hint: "seção", run: goto("projetos") },
    { label: "Sobre e competências", hint: "seção", run: goto("sobre") },
    { label: "Formação", hint: "seção", run: goto("formacao") },
    { label: "Terminal", hint: "seção", run: goto("terminal") },
    { label: "Contato", hint: "seção", run: goto("contato") },
    ...(profile.cv ? [{ label: "Baixar currículo (PDF)", hint: "ação", run: open(profile.cv) }] : []),
    ...projects.filter((p) => p.repo || p.demo)
      .map((p) => ({ label: p.title, hint: "projeto", run: open(p.demo || p.repo) })),
    { label: "Rodar “help” no terminal", hint: "terminal", run: inTerminal("help") },
    { label: "Alternar tema claro/escuro", hint: "ação", run: () => document.getElementById("theme-toggle").click() },
    { label: "Copiar e-mail", hint: "ação", run: copyEmail },
    ...Object.entries(profile.links).filter(([, u]) => u)
      .map(([k, u]) => ({ label: `Abrir ${k === "github" ? "GitHub" : k === "linkedin" ? "LinkedIn" : k}`, hint: "link", run: open(u) })),
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
    const n = Math.max(results.length, 1);
    if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % n; draw(); }
    if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + n) % n; draw(); }
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
