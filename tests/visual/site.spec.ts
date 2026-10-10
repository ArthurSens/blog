import { expect, test } from '@playwright/test'

const pages = [
  { name: 'home', path: '/' },
  { name: 'post', path: '/posts/grief' },
]

for (const pageUnderTest of pages) {
  test(`${pageUnderTest.name} matches its visual baseline`, async ({ page }) => {
    await page.goto(pageUnderTest.path)
    await page.waitForLoadState('load')
    await page.evaluate(async () => {
      await document.fonts.ready
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((resolve) => window.setTimeout(resolve, 50))
      }
      window.scrollTo(0, 0)
      await Promise.all(
        Array.from(document.images, (image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.addEventListener('load', () => resolve(), { once: true })
                image.addEventListener('error', () => resolve(), { once: true })
              }),
        ),
      )
    })

    await expect(page).toHaveScreenshot(`${pageUnderTest.name}.png`, {
      fullPage: true,
    })
  })
}
