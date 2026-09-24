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

test("formação mostra os períodos e o status das disciplinas, sem notas", async ({ page }) => {
  await page.goto("/#formacao");
  const periods = page.locator('[data-render="curriculum"] .period');
  await expect(periods).toHaveCount(2);
  await expect(periods.first()).toContainText("concluído");
  await expect(periods.nth(1)).toContainText("em andamento");
  await expect(page.locator("main")).not.toContainText("média");

  const input = page.locator("#term-in");
  await input.fill("grade");
  await input.press("Enter");
  await expect(page.locator(".term-out")).toContainText("Computação em Nuvem");
});

test("projetos em destaque mostram resumo, destaques e links", async ({ page }) => {
  await page.goto("/#projetos");
  const first = page.locator(".project").first();
  await expect(first.locator("h3")).toHaveText("Calculadora Nutri");
  await expect(first.locator(".highlights li")).toHaveCount(4);
  await expect(first.getByRole("link", { name: "Código" })).toHaveAttribute("href", /APP-CALCULADORANUTRI/);
});
