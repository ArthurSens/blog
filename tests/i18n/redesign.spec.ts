import { expect, test } from "@playwright/test";
import { getAllPosts } from "../../lib/api";

for (const locale of ["en", "pt-br"]) {
  test(`@http ${locale} RSS contains only the matching catalog`, async ({
    request,
  }) => {
    const response = await request.get(
      locale === "en" ? "/feed.xml" : "/pt-br/feed.xml",
    );
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain(
      `<language>${locale === "en" ? "en" : "pt-BR"}</language>`,
    );
    for (const post of getAllPosts()) {
      expect(xml.includes(`/posts/${post.slug}</link>`)).toBe(
        post.lang === locale,
      );
    }
  });
  test(`@http ${locale} privacy page is available`, async ({ request }) => {
    const response = await request.get(
      locale === "en" ? "/privacy" : "/pt-br/privacy",
    );
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`lang="${locale}"`);
  });
}

test("topic filters keep stories reachable", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Life, sometimes", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Grief.", exact: true }),
  ).toBeVisible();
  for (const post of getAllPosts("en").filter(
    (post) => post.translationKey !== "grief",
  )) {
    await expect(
      page.getByRole("link", { name: post.title, exact: true }),
    ).toHaveCount(0);
  }
  await page.getByRole("button", { name: "All writing", exact: true }).click();
  for (const post of getAllPosts("en")) {
    await expect(
      page.getByRole("link", { name: post.title, exact: true }).first(),
    ).toBeVisible();
  }
});

test("homepage motion follows the system preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".character-sprite")).toHaveCSS("background-position", "-576px 0px");
  const wave = page.getByRole("button", { name: "Say hello to Arthur", exact: true });
  await expect(wave).toBeDisabled();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(wave).toBeEnabled();
});

test("reduced motion is respected and the memorial starts still", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/posts/grief");
  await expect(page.locator(".memory-art img")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".character-sprite")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "A quiet moment" })).toHaveCount(0);
  await expect(page.getByAltText(/Killua the cat runs playfully/)).toHaveCSS("animation-name", "none");
  await page.getByText("A photograph of Killua", { exact: true }).click();
  await expect(page.getByAltText("Killua", { exact: true })).toBeVisible();
});

test("representative pages fit the viewport and load their artwork", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/pt-br",
    "/posts/grief",
    "/posts/created-timestamps",
  ]) {
    await page.goto(path);
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images).map((image) => {
          image.loading = "eager";
          return image.decode().catch(() => {});
        }),
      );
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    ).toBe(true);
    await page.screenshot({
      path: test
        .info()
        .outputPath(`${path.replace(/\W+/g, "-") || "home"}-review.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
  expect(errors).toEqual([]);
});

test("theme follows the system and remembers manual overrides", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const theme = page.getByRole("combobox", { name: "Theme", exact: true });
  await expect(theme).toHaveValue("system");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await theme.selectOption("light");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 250, 250)");
  await page.reload();
  await expect(theme).toHaveValue("light");
  await page.goto("/posts/created-timestamps");
  await expect(page.getByRole("combobox", { name: "Theme", exact: true })).toHaveValue("light");
  await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption("system");
  expect(await page.evaluate(() => localStorage.getItem("arthursens-theme"))).toBeNull();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 250, 250)");
  await page.goto("/pt-br");
  await page.getByRole("combobox", { name: "Tema", exact: true }).selectOption("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
});

test("dark reading pages use the shared palette", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  for (const path of ["/", "/posts/grief", "/posts/created-timestamps"]) {
    await page.goto(path);
    await expect(page.locator("body")).toHaveCSS("color", "rgb(244, 244, 244)");
    const code = page.locator("pre").first();
    if (await code.count()) await expect(code).toHaveCSS("background-color", "rgb(37, 37, 37)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`dark-${path.replace(/\W+/g, "-") || "home"}.png`), fullPage: true, animations: "disabled" });
  }
});
