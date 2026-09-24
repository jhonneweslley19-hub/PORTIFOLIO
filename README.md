# Portfólio · Jhonne Weslley

[![CI](https://github.com/jhonneweslley19-hub/PORTIFOLIO/actions/workflows/ci.yml/badge.svg)](https://github.com/jhonneweslley19-hub/PORTIFOLIO/actions/workflows/ci.yml)
[![Deploy](https://github.com/jhonneweslley19-hub/PORTIFOLIO/actions/workflows/deploy.yml/badge.svg)](https://github.com/jhonneweslley19-hub/PORTIFOLIO/actions/workflows/deploy.yml)

Portfólio pessoal de **Jhonne Weslley**, estudante de **Engenharia de Software**: projetos, stack, jornada e contato.

🔗 **Site:** https://jhonneweslley19-hub.github.io/PORTIFOLIO/

## Tecnologia

Sem framework no navegador: HTML, CSS e **JavaScript moderno (ES Modules)**.

| Recurso | Onde |
|---|---|
| Todo o conteúdo em um único arquivo de dados | `js/data.js` |
| Templates seguros com escape automático de HTML (tagged templates) | `js/dom.js` |
| **Terminal interativo** (`help`, `neofetch`, histórico ↑/↓, Tab, Ctrl+L) | `js/terminal.js` |
| Repositórios do GitHub, gerados no deploy com fallback para a API | `js/github.js`, `scripts/fetch-repos.mjs` |
| Paleta de comandos <kbd>Ctrl</kbd>+<kbd>K</kbd> | `js/palette.js` |
| Painel de detalhes de cada projeto, com link direto (`#projeto/slug`) | `js/projects.js` |
| Competências clicáveis que mostram onde cada tecnologia foi usada | `js/projects.js` |
| Abas acessíveis (WAI-ARIA) no cartão do topo e na formação | `js/ui.js` |
| Menu "Mais" e indicador animado da seção atual | `js/ui.js` |
| Atalhos de teclado estilo GitHub (<kbd>?</kbd>, <kbd>g</kbd> <kbd>p</kbd>…) | `js/ui.js` |
| Formulário de contato que monta o e-mail, com rascunho salvo | `js/contact.js` |
| Menu do celular com Popover API + `@starting-style` | `index.html`, `css/styles.css` |
| Tema claro/escuro com View Transitions API | `js/main.js` |
| CSS nesting, `@layer`, `color-mix()`, `oklab` | `css/styles.css` |
| Fontes variáveis hospedadas no próprio site (sem Google Fonts) | `assets/fonts/` |
| PWA offline, com versão de cache carimbada a cada deploy | `sw.js`, `scripts/build.mjs` |
| SEO: Open Graph com imagem, JSON-LD, sitemap e robots | `index.html`, `assets/og.png` |
| Página 404 no estilo terminal | `404.html` |

## Qualidade

Cada push roda no GitHub Actions:

- **ESLint** para padronizar o código
- **Playwright**: testes de ponta a ponta no desktop e no celular (terminal, Ctrl+K, menu, tema, 404, repositórios)
- **Lighthouse CI**: bloqueia se acessibilidade ou SEO ficarem abaixo de 95

O deploy só acontece se o CI passar. Além disso, a lista de repositórios é atualizada automaticamente todo dia.

## Como editar

Abra **`js/data.js`**. Campos vazios (`""`) e listas vazias (`[]`) são ocultados automaticamente.

- `profile`: nome, faculdade, período, selo de disponibilidade, textos do topo e do "Sobre", e-mail, links e `cv` (PDF)
- `projects`: projetos em destaque, com resumo, destaques, tecnologias e links (os do GitHub aparecem sozinhos)
- `skills` e `learning`: competências e o que você está estudando
- `education` e `curriculum`: formação e grade curricular
- `certificates`: cursos e certificados

Mudou o nome ou o cargo? Rode `npm run og` para gerar a imagem de compartilhamento de novo.

## Comandos

```bash
npm install          # instala as ferramentas de desenvolvimento
npm start            # servidor local em http://localhost:8080
npm run lint         # ESLint
npm test             # testes Playwright (antes, uma vez: npx playwright install chromium)
npm run build        # gera _site/ como no deploy
npm run og           # gera assets/og.png
```

## Publicar

1. Faça o merge na branch `main`.
2. No GitHub: **Settings → Pages → Source: GitHub Actions**.
3. O site fica em `https://jhonneweslley19-hub.github.io/PORTIFOLIO/`.
