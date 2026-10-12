import { expect, test } from "@playwright/test";

test("Portuguese signup loads only on request and resets when language changes", async ({ page }) => {
  const requests: string[] = [];
  await page.route("https://*.sibforms.com/**", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: "text/html", body: "<html lang='pt'><body>Form preview</body></html>" });
  });
  await page.goto("/pt-br");
  const newsletter = page.locator(".newsletter");
  const toggle = newsletter.getByRole("button", { name: "Receber novos artigos por e-mail" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(newsletter.locator("iframe")).toHaveCount(0);
  expect(requests).toEqual([]);
  const fallback = newsletter.getByRole("link", { name: /Abrir inscrição/ });
  const url = await fallback.getAttribute("href");
  expect(url).toMatch(/^https:\/\/be00fc41\.sibforms\.com\/v2\/serve\//);
  await toggle.focus();
  await page.keyboard.press("Enter");
  const frame = newsletter.locator("iframe");
  await expect(frame).toHaveAttribute("src", url!);
  await expect(frame).toHaveAttribute("title", "Assinar o blog de Arthur Sens em português");
  await expect.poll(() => requests.length).toBe(1);
  expect(await frame.evaluate(el => el.getBoundingClientRect().width <= window.innerWidth)).toBe(true);
  await newsletter.getByLabel("Idioma de leitura").selectOption("en");
  await expect(frame).toHaveCount(0);
  await expect(newsletter.getByRole("button")).toHaveCount(0);
  await expect(newsletter.getByRole("link", { name: /RSS/ })).toHaveAttribute("href", "/feed.xml");
  await newsletter.getByLabel("Idioma de leitura").selectOption("pt-br");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("English readers can explicitly select Portuguese without changing the page locale", async ({ page }) => {
  await page.goto("/");
  const newsletter = page.locator(".newsletter");
  await expect(newsletter.getByRole("button")).toHaveCount(0);
  await newsletter.getByLabel("Reading language").selectOption("pt-br");
  await expect(newsletter.getByRole("button", { name: "Get new posts by email" })).toBeVisible();
  await expect(newsletter.getByRole("link", { name: /RSS/ })).toHaveAttribute("href", "/pt-br/feed.xml");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
