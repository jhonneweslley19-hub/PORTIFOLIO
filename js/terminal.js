import { html, toString } from "./dom.js";

/**
 * Terminal interativo: o visitante explora o portfólio por comandos.
 * Suporta histórico (↑/↓), autocompletar (Tab) e Ctrl+L para limpar.
 */
export function initTerminal({ profile, skills, learning, projects, education, curriculum, getRepos, toggleTheme }) {
  const root = document.querySelector("#terminal");
  const body = root.querySelector(".term-body");
  const out = root.querySelector(".term-out");
  const form = root.querySelector(".term-line");
  const input = root.querySelector("#term-in");

  const history = [];
  let hIndex = 0;

  const print = (tpl) => {
    const div = document.createElement("div");
    div.innerHTML = typeof tpl === "string" ? tpl : toString(tpl);
    out.append(div);
    body.scrollTop = body.scrollHeight;
  };

  const commands = {
    help: {
      desc: "lista os comandos",
      run: () => html`<span class="dim">Comandos disponíveis:</span>\n${Object.entries(commands).map(
        ([k, c]) => html`  <span class="hl">${k.padEnd(10)}</span> ${c.desc}\n`)}`,
    },
    sobre: {
      desc: "quem é o Jhonne",
      run: () => html`${profile.about.map((p) => html`${p}\n\n`)}`,
    },
    whoami: {
      desc: "resumo rápido",
      run: () => html`<span class="cy">${profile.name}</span> — ${profile.role}${profile.university ? ` · ${profile.university}` : ""}`,
    },
    neofetch: {
      desc: "ficha técnica estilo Linux",
      run: () => {
        const art = ["   ___ _    _  ", "  |_  | |  | | ", "    | | |  | | ", "    | | |/\\| | ", "/\\__/ \\  /\\  / ", "\\____/ \\/  \\/  "];
        const using = skills.flatMap((g) => g.items).slice(0, 5);
        const info = [
          html`<span class="hl">visitante</span>@<span class="hl">jhonne</span>`,
          html`<span class="dim">──────────────</span>`,
          html`<span class="cy">Nome</span>: ${profile.name}`,
          html`<span class="cy">Curso</span>: Engenharia de Software`,
          profile.university && html`<span class="cy">Faculdade</span>: ${profile.university} (${profile.semester})`,
          html`<span class="cy">Stack</span>: ${using.join(", ")}`,
          html`<span class="cy">Shell</span>: portfolio-sh (JavaScript)`,
          html`<span class="cy">Uptime</span>: ${Math.round(performance.now() / 1000)}s nesta página`,
        ].filter(Boolean);
        return html`${Array.from({ length: Math.max(art.length, info.length) }, (_, n) =>
          html`<span class="hl">${(art[n] ?? "").padEnd(18)}</span>${info[n] ?? ""}\n`)}`;
      },
    },
    skills: {
      desc: "competências e o que estou estudando",
      run: () => html`${skills.map((g) => html`<span class="hl">${g.group}</span>\n  ${g.items.join(" · ")}\n`)}${learning.length ? html`<span class="hl">Estudando agora</span>\n  <span class="dim">${learning.join(" · ")}</span>\n` : ""}`,
    },
    projetos: {
      desc: "projetos em destaque e do GitHub",
      run: async () => {
        print(html`<span class="hl">Em destaque</span>\n${projects.map((p) => html`  • <a href="${p.demo || p.repo}" target="_blank" rel="noopener">${p.title}</a> <span class="dim">— ${p.tags.join(", ")}</span>\n`)}`);
        print(html`<span class="dim">buscando repositórios no GitHub…</span>`);
        try {
          const repos = await getRepos();
          return repos.length
            ? html`<span class="hl">GitHub</span>\n${repos.slice(0, 8).map((r) => html`  • <a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>${r.language ? html` <span class="dim">(${r.language})</span>` : ""}\n`)}`
            : html`<span class="dim">Nenhum repositório público ainda.</span>`;
        } catch {
          return html`<span class="err">Não foi possível acessar a API do GitHub agora.</span>`;
        }
      },
    },
    formacao: {
      desc: "formação e grade curricular",
      run: () => html`<span class="cy">${education.degree}</span> — ${education.institution} <span class="dim">(${education.period})</span>\n\n${curriculum.map((p) => {
        const done = p.status === "done";
        return html`<span class="hl">${p.label}</span> <span class="dim">(${p.period})</span> — ${done ? html`<span class="pr">concluído</span>` : html`<span class="cy">em andamento</span>`}\n${p.courses.map(
          (c) => html`  ${done ? html`<span class="pr">✔</span>` : html`<span class="dim">…</span>`} ${c.name}\n`)}\n`;
      })}`,
    },
    contato: {
      desc: "como falar comigo",
      run: () => html`e-mail   <a href="mailto:${profile.email}">${profile.email}</a>\n${Object.entries(profile.links).filter(([, u]) => u).map(
        ([k, u]) => html`${k.padEnd(8)} <a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\/(www\.)?/, "")}</a>\n`)}`,
    },
    github: { desc: "abre meu GitHub", run: () => (window.open(profile.links.github, "_blank", "noopener"), "abrindo GitHub…") },
    linkedin: { desc: "abre meu LinkedIn", run: () => (window.open(profile.links.linkedin, "_blank", "noopener"), "abrindo LinkedIn…") },
    ...(profile.cv && {
      cv: { desc: "baixa meu currículo (PDF)", run: () => (window.open(profile.cv, "_blank", "noopener"), "abrindo currículo…") },
    }),
    tema: { desc: "alterna claro/escuro", run: () => (toggleTheme(), "tema alternado ✔") },
    data: { desc: "data e hora atuais", run: () => new Date().toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" }) },
    clear: { desc: "limpa a tela", run: () => (out.replaceChildren(), null) },
  };

  async function exec(raw) {
    const line = raw.trim();
    print(html`<span class="pr">visitante@jhonne:~$</span> <span class="cmd">${line}</span>`);
    if (!line) return;
    history.push(line); hIndex = history.length;

    const [name] = line.toLowerCase().split(/\s+/);
    const aliases = { stack: "skills", grade: "formacao", "formação": "formacao", ls: "help" };
    const cmd = commands[aliases[name] ?? name] ?? (name === "sudo" ? { run: () => html`<span class="err">Permissão negada.</span> Boa tentativa 😄` } : null);
    if (!cmd) return print(html`<span class="err">comando não encontrado:</span> ${name}. Digite <span class="hl">help</span>.`);
    const result = await cmd.run();
    if (result != null) print(result);
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; exec(v); });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault(); hIndex = Math.max(0, hIndex - 1); input.value = history[hIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault(); hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] ?? "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = Object.keys(commands).filter((k) => k.startsWith(input.value.toLowerCase()));
      if (matches.length === 1) input.value = matches[0];
      else if (matches.length > 1) print(html`<span class="dim">${matches.join("  ")}</span>`);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault(); out.replaceChildren();
    }
  });

  body.addEventListener("click", () => { if (!getSelection().toString()) input.focus({ preventScroll: true }); });

  print(html`<span class="hl">Bem-vindo(a) ao terminal do ${profile.name.split(" ")[0]}!</span>
Digite <span class="hl">help</span> para ver os comandos. <span class="dim">Dica: Tab autocompleta, ↑/↓ navegam no histórico.</span>\n`);

  return { exec };
}
