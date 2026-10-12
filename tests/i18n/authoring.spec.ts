import { expect, test } from '@playwright/test'
import { raceSamples, observedChange } from '../../lib/race-model'
import { getPostBySlug } from '../../lib/api'

const path = '/posts/created-timestamps'

test('@http original slug resolves MDX and preserves ordinary Markdown', async ({ request }) => {
  expect(getPostBySlug('created-timestamps')?.format).toBe('mdx')
  expect(getPostBySlug('prometheus-agent-support')?.format).toBe('md')
  expect(getPostBySlug('../created-timestamps')).toBeUndefined()
  const html = await (await request.get(path)).text()
  expect(html).toContain('Monitoring the rabbit vs. turtle race training')
  expect(html).toContain('What happens between scrapes?')
  expect(html).not.toContain('import { CreatedTimestampsStory }')
  expect(html).not.toContain('translationKey: created-timestamps')
})

test('@http model cannot invent observations or synthetic zeros before ingestion', () => {
  expect(raceSamples(10, 0, 'rabbit', false)).toEqual([{ time: 30, value: 30 }])
  expect(observedChange(raceSamples(10, 0, 'rabbit', false))).toBeNull()
  expect(raceSamples(10, 0, 'rabbit', true)).toEqual([{ time: 20, value: 0, synthetic: true }, { time: 30, value: 30 }])
  expect(observedChange(raceSamples(10, 0, 'rabbit', true))).toBe(30)
  expect(raceSamples(15, 1, 'rabbit', true)).toEqual([])
  expect(raceSamples(5, 1, 'rabbit', false)).toEqual([{ time: 21, value: 3 }, { time: 26, value: 18 }])
  expect(raceSamples(10, 0, 'turtle', false)).toEqual([{ time: 10, value: 10 }, { time: 20, value: 20 }, { time: 30, value: 30 }])
})

test('story follows native scroll in both directions and uses static mobile scenes', async ({ page }, info) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(path)
  const scene = page.locator('[data-story-scene]')
  const steps = page.locator('[data-story-value]')
  await expect(steps).toHaveCount(4)
  if (info.project.name === 'desktop-chromium') {
    await expect(page.locator('[data-motion]')).toHaveAttribute('data-motion', 'on')
    const moveTo = async (index: number, offset = 0) => steps.nth(index).evaluate((element, offset) => window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - window.innerHeight * .55 + offset, behavior: 'instant' }), offset)
    await moveTo(2, 50)
    await expect.poll(async () => Number(await scene.getAttribute('data-value'))).toBeGreaterThan(20)
    const forward = Number(await scene.getAttribute('data-value'))
    await moveTo(1, 20)
    await expect.poll(async () => Number(await scene.getAttribute('data-value'))).toBeLessThan(forward)
    await expect(scene).toBeVisible()
    // Pause on an in-between state for visual review.
    await page.screenshot({ path: info.outputPath('scroll-story.png') })
  } else {
    await expect(scene).toBeHidden()
    for (const step of await steps.all()) await expect(step.getByRole('img')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('reduced motion retains every scene and keyboard controls update real sample data', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' })
  await page.goto(path)
  await expect(page.locator('[data-story-scene]')).toBeHidden()
  for (const step of await page.locator('[data-story-value]').all()) await expect(step.getByRole('img')).toBeVisible()
  const experiment = page.getByRole('region', { name: 'What happens between scrapes?' })
  await expect(experiment).toContainText('Not enough data to compare two samples.')
  await expect(experiment).toContainText('Change between first and last sample: 30 m')
  const interval = page.getByRole('slider', { name: 'Scrape interval' })
  await interval.focus()
  await interval.press('Home')
  await expect(interval).toHaveValue('5')
  await expect(experiment).toContainText('25 s → 15 m')
  await expect(experiment).toContainText('Change between first and last sample: 15 m')
  const phase = page.getByRole('slider', { name: 'First scrape' })
  await phase.focus()
  await phase.press('ArrowRight')
  await expect(experiment).toContainText('21 s → 3 m')
  await expect(experiment).toContainText('26 s → 18 m')
  await page.getByRole('button', { name: 'Reset example' }).click()
  await expect(interval).toHaveValue('10')
  await expect(phase).toHaveValue('0')
  await experiment.scrollIntoViewIfNeeded()
  await page.screenshot({ path: info.outputPath('experiment-dark.png'), fullPage: true })
  await page.screenshot({ path: info.outputPath('experiment-detail.png') })
})
