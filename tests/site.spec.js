import { test, expect } from "@playwright/test";

// A API do GitHub é simulada: os testes não dependem de rede nem do limite de requisições.
const repos = [
  { name: "PORTIFOLIO", description: "Meu portfólio", html_url: "https://github.com/x/PORTIFOLIO", language: "JavaScript", stargazers_count: 1, pushed_at: new Date().toISOString() },
  { name: "outro-projeto", description: null, html_url: "https://github.com/x/outro", language: "Python", stargazers_count: 0, pushed_at: "2026-01-10T00:00:00Z" },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/data/repos.json", (r) => r.fulfill({ status: 404 }));
  await page.route("https://api.github.com/**", (r) => r.fulfill({ json: repos }));
});

test("carrega sem erros de JavaScript e sem rolagem horizontal", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Jhonne Weslley");
  expect(errors).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
});

test("mostra os repositórios do GitHub", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator('[data-render="repos"] .repo');
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toContainText("PORTIFOLIO");
});

test("terminal executa comandos, autocompleta e trata erros", async ({ page }) => {
  await page.goto("/#terminal");
  const input = page.locator("#term-in");
  const out = page.locator(".term-out");

  await input.fill("help");
  await input.press("Enter");
  await expect(out).toContainText("Comandos disponíveis");

  await input.fill("comando-inexistente");
  await input.press("Enter");
  await expect(out).toContainText("comando não encontrado");

  await input.fill("neo");
  await input.press("Tab");
  await expect(input).toHaveValue("neofetch");

  await input.fill("clear");
  await input.press("Enter");
  await expect(out).toBeEmpty();

  await input.press("ArrowUp");
  await expect(input).toHaveValue("clear");
});

test("tema alterna e é lembrado", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.locator("#theme-toggle").click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("página 404 aponta para o início", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator("h1")).toHaveText("404");
  await expect(page.locator("#home")).toHaveAttribute("href", "/");
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "atalho de teclado é recurso de desktop");

  test("paleta Ctrl+K busca e navega", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.locator(".palette");
    await expect(dialog).toBeVisible();
    await dialog.locator("input").fill("contato");
    await dialog.locator("input").press("Enter");
    await expect(dialog).toBeHidden();
    await expect(page.locator("#contato")).toBeInViewport();
  });
});

test.describe("celular", () => {
  test.skip(({ isMobile }) => !isMobile, "menu hambúrguer só aparece no celular");

  test("menu abre, navega e fecha", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".nav nav")).toBeHidden();
    await page.locator(".menu-btn").click();
    const menu = page.locator("#menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Projetos" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#projetos")).toBeInViewport();
  });
});

test("formação: abas por período, abrindo no período atual e sem notas", async ({ page }) => {
  await page.goto("/#formacao");
  const tabs = page.locator(".period-tabs [role=tab]");
  await expect(tabs).toHaveCount(2);
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#ppanel-1")).toBeVisible();
  await expect(page.locator("#ppanel-1")).toContainText("Banco de Dados");

  await tabs.nth(1).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#ppanel-0")).toContainText("Computação em Nuvem");
  await expect(page.locator("#ppanel-1")).toBeHidden();
  await expect(page.locator("main")).not.toContainText("média");

  const input = page.locator("#term-in");
  await input.fill("grade");
  await input.press("Enter");
  await expect(page.locator(".term-out")).toContainText("Bacharelado em Engenharia de Software");
});

test("projetos em destaque mostram resumo, destaques e links", async ({ page }) => {
  await page.goto("/#projetos");
  const first = page.locator(".project").first();
  await expect(first.locator("h3")).toHaveText("Calculadora Nutri");
  await expect(first.locator(".highlights li")).toHaveCount(2); // os 4 completos ficam no painel de detalhes
  await expect(first.locator(".project-visual")).toHaveCount(1);
  await expect(first.getByRole("link", { name: "Código" })).toHaveAttribute("href", /APP-CALCULADORANUTRI/);
});

test("painel de detalhes: abre, navega, fecha e atualiza o link", async ({ page }) => {
  await page.goto("/#projetos");
  await page.locator('#card-calculadora-nutri [data-project]').click();
  const drawer = page.locator("dialog.drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator("h2")).toHaveText("Calculadora Nutri");
  await expect(drawer).toContainText("O problema");
  await expect(page).toHaveURL(/#projeto\/calculadora-nutri$/);

  await drawer.getByRole("button", { name: /SaaS de Vendas · Perfumaria →/ }).click();
  await expect(drawer.locator("h2")).toHaveText("SaaS de Vendas · Perfumaria");
  await expect(page).toHaveURL(/#projeto\/saas-perfumaria$/);

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/#projetos$/);
});

test("link direto abre o painel do projeto", async ({ page }) => {
  await page.goto("/#projeto/portfolio");
  await expect(page.locator("dialog.drawer h2")).toHaveText("Este portfólio");
});

test("competência clicável mostra onde foi usada e abre o projeto", async ({ page }) => {
  await page.goto("/#sobre");
  await page.locator('[data-skill="React"]').click();
  const pop = page.locator("#skill-pop");
  await expect(pop).toBeVisible();
  await expect(pop).toContainText("Calculadora Nutri");
  await pop.getByRole("button", { name: /Calculadora Nutri/ }).click();
  await expect(page.locator("dialog.drawer h2")).toHaveText("Calculadora Nutri");
});

test("cartão do topo troca de arquivo pelas abas", async ({ page, isMobile }) => {
  test.skip(isMobile, "o cartão fica oculto no celular");
  await page.goto("/");
  await page.getByRole("tab", { name: "stack.json" }).click();
  await expect(page.locator("#panel-stack")).toBeVisible();
  await expect(page.locator("#panel-stack")).toContainText("Linguagens");
  await expect(page.locator("#panel-perfil")).toBeHidden();
});

test("formulário de contato conta caracteres e guarda o rascunho", async ({ page }) => {
  await page.goto("/#contato");
  const form = page.locator("[data-composer]");
  await form.locator("input[name=nome]").fill("Ana");
  await form.locator("textarea").fill("Olá, Jhonne!");
  await expect(form.locator(".counter")).toHaveText("12 / 1500");
  await page.reload();
  await expect(form.locator("textarea")).toHaveValue("Olá, Jhonne!");
  await expect(form.locator("input[name=nome]")).toHaveValue("Ana");
});

test.describe("atalhos e menus (desktop)", () => {
  test.skip(({ isMobile }) => isMobile, "atalhos de teclado e menu Mais são recursos de desktop");

  test("? mostra os atalhos e g + c vai para Contato", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("?");
    const dialog = page.locator("dialog.shortcuts");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Ir para Projetos");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.keyboard.press("g");
    await page.keyboard.press("c");
    await expect(page.locator("#contato")).toBeInViewport();
  });

  test("atalhos não disparam enquanto se digita", async ({ page }) => {
    await page.goto("/#contato");
    await page.locator("textarea").fill("");
    await page.locator("textarea").press("?");
    await expect(page.locator("dialog.shortcuts")).toBeHidden();
  });

  test("menu Mais abre e leva aos atalhos", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mais" }).click();
    const menu = page.locator("#more-menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("menuitem", { name: /Atalhos de teclado/ }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("dialog.shortcuts")).toBeVisible();
  });
});

test("faixa de tecnologias duplica a lista só visualmente", async ({ page }) => {
  await page.goto("/");
  const items = page.locator(".marquee-track li");
  const total = await items.count();
  expect(total % 2).toBe(0);
  await expect(page.locator('.marquee-track li[aria-hidden="true"]')).toHaveCount(total / 2);
});

test("nome do topo continua legível para leitores de tela", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-name .sr-only")).toHaveText("Jhonne Weslley");
  await expect(page.locator(".hero-name .word").first()).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Jhonne Weslley");
});

test("pontos laterais acompanham a seção atual", async ({ page, isMobile }) => {
  test.skip(isMobile, "os pontos laterais só aparecem em telas largas");
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/");
  await page.locator('.side-dots a[href="#formacao"]').click();
  await expect(page.locator('.side-dots a[href="#formacao"]')).toHaveAttribute("aria-current", "true");
});
