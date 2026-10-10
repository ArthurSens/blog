import { expect, test } from "@playwright/test";
import sharp from "sharp";
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

test("the shared family scene respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator(".family-scene");
  await expect(scene).toHaveAttribute("data-playing", "false");
  await expect(scene.locator("img")).toHaveAttribute("src", /-still\.webp$/);
  await expect(page.locator(".character-sprite")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(scene).toHaveAttribute("data-playing", "true");
  await expect(scene.locator("img")).toHaveAttribute("src", /-loop\.webp$/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene).toHaveAttribute("data-playing", "false");
  await expect(scene.locator("img")).toHaveAttribute("src", /-still\.webp$/);
});

test("family animation uses full scenes on a fixed canvas at 30 FPS", async () => {
  const motion = await sharp("public/assets/cast/arth-gon-pitou-loop.webp", { animated: true }).metadata();
  const still = await sharp("public/assets/cast/arth-gon-pitou-still.webp").metadata();
  expect(motion.width).toBe(still.width);
  expect(motion.pageHeight).toBe(still.height);
  expect(motion.hasAlpha).toBe(true);
  expect(motion.loop).toBe(0);
  expect(motion.delay!.reduce((sum, value) => sum + value, 0)).toBe(3600);
  // Identical loop-closing frames may coalesce; real moving frames last 33–34 ms.
  expect(motion.delay!.filter((delay) => delay === 33 || delay === 34).length).toBeGreaterThan(95);
  const drawings = await sharp("public/assets/cast/family-full-keyframes.webp").metadata();
  expect(drawings.width).toBe(300);
  expect(drawings.height).toBe(260 * 36);
  const decoded = await sharp("public/assets/cast/arth-gon-pitou-loop.webp", { animated: true }).ensureAlpha().raw().toBuffer();
  const frameSize = 300 * 260 * 4;
  for (let f = 0; f < motion.pages!; f++) {
    let top = 260, bottom = 0, left = 300, right = 0;
    for (let y = 0; y < 260; y++) for (let x = 0; x < 300; x++) {
      if (decoded[f * frameSize + (y * 300 + x) * 4 + 3] < 220) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
    expect(left).toBeGreaterThan(0);
    expect(right).toBeLessThan(299);
    // Shared head/floor anchors reject global jumping and cutout-bound jitter.
    expect(top).toBeGreaterThanOrEqual(23);
    expect(top).toBeLessThanOrEqual(27);
    expect(bottom).toBeGreaterThanOrEqual(232);
    expect(bottom).toBeLessThanOrEqual(238);
  }
});

test("family animation uses its still when scrolled out of view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator(".family-scene");
  await expect(scene).toHaveAttribute("data-playing", "true");
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-playing", "false");
  await expect(scene.locator("img")).toHaveAttribute("src", /-still\.webp$/);
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
  const theme = page.getByRole("button", { name: /^Theme:/ });
  await expect(theme).toHaveAttribute("data-theme-preference", "system");
  await expect(page.locator(".site-header").getByRole("link", { name: "Writing", exact: true })).toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await theme.click();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 250, 250)");
  await page.reload();
  await expect(theme).toHaveAttribute("data-theme-preference", "light");
  await page.goto("/posts/created-timestamps");
  await expect(theme).toHaveAttribute("data-theme-preference", "light");
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(theme).toHaveAttribute("data-theme-preference", "dark");
  await page.keyboard.press("Space");
  await expect(theme).toHaveAttribute("data-theme-preference", "system");
  expect(await page.evaluate(() => localStorage.getItem("arthursens-theme"))).toBeNull();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 250, 250)");
  await page.goto("/pt-br");
  const tema = page.getByRole("button", { name: /^Tema:/ });
  await expect(tema).toHaveAccessibleName("Tema: sistema. Mudar para claro");
  await tema.click();
  await tema.click();
  await expect(tema).toHaveAttribute("data-theme-preference", "dark");
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
