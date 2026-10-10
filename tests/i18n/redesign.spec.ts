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

test("motion can be paused and survives navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const sprite = page.locator(".character-sprite");
  await expect(sprite).toHaveCSS("background-position", "-576px 0px");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enable motion", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Say hello to Arthur", exact: true }),
  ).toBeDisabled();
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
