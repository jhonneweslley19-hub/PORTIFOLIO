# Portfólio · Jhonne Weslley

Portfólio pessoal de **Jhonne Weslley**, estudante de **Engenharia de Software**: projetos, stack, jornada e contato.

🔗 **Site:** https://jhonneweslley19-hub.github.io/PORTIFOLIO/

## Tecnologia

Sem framework e sem etapa de build: HTML, CSS e **JavaScript moderno (ES Modules)** rodando direto no navegador.

| Recurso | Onde |
|---|---|
| Todo o conteúdo em um único arquivo de dados | `js/data.js` |
| Templates seguros com escape automático de HTML (tagged templates) | `js/dom.js` |
| Rede de nós animada em `<canvas>` que reage ao cursor + efeito de digitação | `js/network.js` |
| **Terminal interativo** (histórico ↑/↓, autocompletar com Tab, Ctrl+L) | `js/terminal.js` |
| Repositórios carregados ao vivo da API do GitHub, com cache | `js/github.js` |
| Paleta de comandos <kbd>Ctrl</kbd>+<kbd>K</kbd> | `js/palette.js` |
| Tema claro/escuro com View Transitions API | `js/main.js` |
| Barra de progresso com CSS scroll-driven animations | `css/styles.css` |
| CSS nesting, `@layer`, `color-mix()`, `oklab` | `css/styles.css` |
| PWA: instalável e funciona offline | `manifest.webmanifest`, `sw.js` |
| Deploy automático no GitHub Pages | `.github/workflows/deploy.yml` |

Acessibilidade: navegação por teclado, link "pular para o conteúdo", `aria-live` e suporte a `prefers-reduced-motion`.

## Como editar

Abra **`js/data.js`**. Campos vazios (`""`) e listas vazias (`[]`) são ocultados automaticamente.

- `profile`: nome, semestre, faculdade, cidade, frases do topo, e-mail e links
- `stack`: tecnologias, com status `uso` ou `estudando`
- `projects`: projetos em destaque (os do GitHub aparecem sozinhos)
- `timeline`: linha do tempo
- `certificates`: cursos e certificados

Depois de publicar mudanças, aumente a versão em `sw.js` (`portfolio-v2` → `portfolio-v3`) para que os visitantes recebam a versão nova.

## Rodar localmente

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Abrir o `index.html` direto do arquivo não funciona, porque ES Modules exigem um servidor.

## Publicar

1. Faça o merge na branch `main`.
2. No GitHub: **Settings → Pages → Source: GitHub Actions**.
3. O site fica em `https://jhonneweslley19-hub.github.io/PORTIFOLIO/`.
