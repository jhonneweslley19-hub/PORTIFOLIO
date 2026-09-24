# Portfólio acadêmico · Medicina

Site pessoal de **Jhonne Weslley**, estudante de Medicina: disciplinas, jornada acadêmica, flashcards interativos, produções e repositórios do GitHub.

## Tecnologia

Sem framework e sem etapa de build: HTML, CSS e **JavaScript moderno (ES Modules)** rodando direto no navegador.

| Recurso | Onde |
|---|---|
| Conteúdo em um único arquivo de dados | `js/data.js` |
| Templates seguros (escape automático de HTML) | `js/dom.js` |
| Traçado de ECG animado em `<canvas>` | `js/ecg.js` |
| Flashcards 3D (teclado, toque e filtros por disciplina) | `js/flashcards.js` |
| Repositórios carregados ao vivo da API do GitHub | `js/github.js` |
| Paleta de comandos <kbd>Ctrl</kbd>+<kbd>K</kbd> | `js/palette.js` |
| Tema claro/escuro com View Transitions API | `js/main.js` |
| Barra de progresso com CSS scroll-driven animations | `css/styles.css` |
| CSS nesting, `@layer`, `color-mix()`, `oklab` | `css/styles.css` |
| PWA: instalável e funciona offline | `manifest.webmanifest`, `sw.js` |
| Deploy automático no GitHub Pages | `.github/workflows/deploy.yml` |

## Como editar

Abra **`js/data.js`** e altere os textos. Campos vazios (`""`) e listas vazias (`[]`) são ocultados automaticamente.

- `profile` — nome, faculdade, cidade, e-mail, links (GitHub, LinkedIn, Lattes)
- `disciplines` — disciplinas e referências
- `timeline` — linha do tempo acadêmica
- `works` — resumos, mapas mentais, trabalhos (com link para PDF/Drive)
- `certificates` — cursos, congressos, ligas
- `flashcards` — perguntas de revisão (**sempre com a referência**)
- `tools` — ferramentas de estudo

Ao publicar uma alteração nos arquivos, aumente a versão em `sw.js` (`portfolio-v1` → `portfolio-v2`) para que visitantes recebam a versão nova.

## Rodar localmente

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Abra `http://localhost:8000`. (Abrir o `index.html` direto pelo arquivo não funciona, porque ES Modules exigem um servidor.)

## Publicar

1. Faça o merge na branch `main`.
2. No GitHub: **Settings → Pages → Source: GitHub Actions**.
3. O site fica disponível em `https://jhonneweslley19-hub.github.io/PORTIFOLIO/`.
