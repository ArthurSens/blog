import { expect, test } from "@playwright/test";

for (const locale of ["en", "pt-br"] as const) {
  test(`${locale} signup follows the site language and loads only after activation`, async ({ page }) => {
    const requests: string[] = [];
    await page.route("https://*.sibforms.com/**", async (route) => {
      requests.push(route.request().url());
      await route.fulfill({ contentType: "text/html", body: "<html><body>Form preview</body></html>" });
    });
    await page.goto(locale === "en" ? "/" : "/pt-br");
    const newsletter = page.locator(".newsletter");
    const name = locale === "en" ? "Get new posts by email" : "Receber novos artigos por e-mail";
    const title = locale === "en" ? "Subscribe to Arthur Sens’s blog in English" : "Assinar o blog de Arthur Sens em português";
    const token = locale === "en" ? "MUIFAFUfAUTa5mJuyzvQ1Xq" : "MUIFABlCu9pyqhwq3opt8ID4b";
    const toggle = newsletter.getByRole("button", { name });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(newsletter.getByRole("combobox")).toHaveCount(0);
    await expect(newsletter.getByRole("link")).toHaveCount(1);
    await expect(newsletter.getByRole("link")).toHaveAttribute("href", locale === "en" ? "/feed.xml" : "/pt-br/feed.xml");
    await expect(newsletter.locator(".eyebrow")).toHaveCount(0);
    await expect(newsletter.getByText(locale === "en" ? "Get an email when I publish a new post." : "Receba um aviso por e-mail quando eu publicar um novo artigo.", { exact: true })).toBeVisible();
    await expect(newsletter.locator("iframe")).toHaveCount(0);
    expect(requests).toEqual([]);
    await toggle.focus();
    await page.keyboard.press("Enter");
    const frame = newsletter.locator("iframe");
    await expect(frame).toHaveAttribute("src", new RegExp(token));
    await expect(frame).toHaveAttribute("title", title);
    await expect.poll(() => requests.length).toBe(1);
    expect(await frame.evaluate(el => el.getBoundingClientRect().width <= window.innerWidth)).toBe(true);
    await newsletter.getByRole("button", { name: locale === "en" ? "Close form" : "Fechar formulário" }).click();
    await expect(frame).toHaveCount(0);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
}
