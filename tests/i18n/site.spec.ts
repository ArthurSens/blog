import { expect, test } from '@playwright/test'
import { getAllPosts, parsePost, translationsFor, validateTranslations } from '../../lib/api'
import { languageNames, languageTag, locales, localizedPath, siteUrl } from '../../lib/i18n'

const posts = getAllPosts()

// Exercise grouping independently of whichever articles happen to be published.
test('@http metadata links different slugs and rejects ambiguous translations', () => {
  const en = parsePost('---\nlang: en\ntranslationKey: shared\n---\nEnglish', 'original')
  const pt = parsePost('---\nlang: pt-BR\ntranslationKey: shared\n---\nPortuguês', 'traducao')
  expect(translationsFor(en, [en, pt])).toEqual([
    { slug: 'original', lang: 'en' }, { slug: 'traducao', lang: 'pt-br' },
  ])
  expect(() => validateTranslations([en, pt])).not.toThrow()
  expect(() => validateTranslations([en, { ...en, slug: 'duplicate' }])).toThrow('Duplicate translation')
  expect(() => parsePost('---\nlang: de\n---\nText', 'unsupported')).toThrow('unsupported language')
  expect(() => parsePost('---\ntranslationKey: ""\n---\nText', 'invalid')).toThrow('translationKey')
  const legacy = parsePost('---\ntitle: Legacy\n---\nText', 'legacy')
  expect(legacy.lang).toBe('en')
  expect(legacy.translationKey).toBe('legacy')
  expect(translationsFor(legacy, [en, pt, legacy])).toEqual([{ slug: 'legacy', lang: 'en' }])
})

for (const locale of locales) {
  test(`${locale} home has only its own catalog and supports switching`, async ({ page }) => {
    await page.goto(localizedPath('/', locale))
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    for (const post of posts) {
      const link = page.getByRole('link', { name: post.title, exact: true }).first()
      if (post.lang === locale) {
        await expect(link).toBeVisible()
        await expect(link).toHaveAttribute('href', localizedPath(`/posts/${post.slug}`, locale))
      } else {
        await expect(link).toHaveCount(0)
      }
    }
    if (locale === 'pt-br' && !posts.some((post) => post.lang === locale)) {
      await expect(page.getByText('Ainda não há artigos em português.')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Explore o acervo em inglês' })).toHaveAttribute('href', '/')
    }
    const other = locale === 'en' ? 'pt-br' : 'en'
    await page.getByRole('navigation').getByRole('link', { name: languageNames[other], exact: true }).click()
    await expect(page).toHaveURL(localizedPath('/', other))
    await expect(page.locator('html')).toHaveAttribute('lang', other)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteUrl + localizedPath('/', other))
    await page.screenshot({ path: test.info().outputPath(`home-${other}.png`), fullPage: true })
  })
}

test('@http browser preference does not redirect English URLs', async ({ request }) => {
  const response = await request.get('/', { headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' }, maxRedirects: 0 })
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('lang="en"')
})

for (const post of posts) {
  test(`${post.slug} keeps its language, canonical URL, and translation navigation`, async ({ page, request }) => {
    const path = localizedPath(`/posts/${post.slug}`, post.lang)
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: post.title, exact: true })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', post.lang)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteUrl + path)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', post.excerpt)
    const translations = translationsFor(post, posts)
    await expect(page.locator('link[rel="alternate"][hreflang]:not([hreflang="x-default"])')).toHaveCount(translations.length)
    for (const translation of translations) {
      await expect(page.locator(`link[hreflang="${languageTag(translation.lang)}"]`))
        .toHaveAttribute('href', siteUrl + localizedPath(`/posts/${translation.slug}`, translation.lang))
    }
    await page.screenshot({ path: test.info().outputPath(`${post.slug}.png`), fullPage: true })
    const other = post.lang === 'en' ? 'pt-br' : 'en'
    const translation = translations.find((item) => item.lang === other)
    if (translation) {
      await page.getByRole('navigation').getByRole('link', { name: languageNames[other], exact: true }).click()
      await expect(page).toHaveURL(localizedPath(`/posts/${translation.slug}`, other))
      await expect(page.locator('html')).toHaveAttribute('lang', other)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteUrl + localizedPath(`/posts/${translation.slug}`, other))
      await page.getByRole('navigation').getByRole('link', { name: languageNames[post.lang], exact: true }).click()
      await expect(page).toHaveURL(path)
    } else {
      await expect(page.getByRole('navigation')).toContainText(post.lang === 'en' ? 'This article is not available in' : 'Este artigo não está disponível em')
      await expect(page.getByRole('navigation').getByRole('link')).toHaveAttribute('href', localizedPath('/', other))
    }
    // A translated article must never appear under the wrong locale's URL.
    expect((await request.get(localizedPath(`/posts/${post.slug}`, other))).status()).toBe(404)
    await page.getByRole('link', { name: 'arthursens.dev', exact: true }).click()
    await expect(page).toHaveURL(localizedPath('/', post.lang))
  })
}

for (const locale of locales) {
  test(`@http ${locale} serves the correct catalog and language metadata`, async ({ request }) => {
    const path = localizedPath('/', locale)
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain(`lang="${locale}"`)
    expect(html).toContain(`rel="canonical" href="${siteUrl + path}"`)
    const data = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)![1])
    expect(data.props.pageProps.allPosts.map((post: { slug: string }) => post.slug))
      .toEqual(posts.filter((post) => post.lang === locale).map((post) => post.slug))
    expect(data.props.pageProps.allPosts.every((post: { content?: string }) => !post.content)).toBe(true)
    for (const post of posts.filter((post) => post.lang === locale)) {
      expect(html).toContain(`href="${localizedPath(`/posts/${post.slug}`, locale)}"`)
    }
  })
}

for (const post of posts) {
  test(`@http ${post.slug} serves only its locale with reciprocal alternates`, async ({ request }) => {
    const path = localizedPath(`/posts/${post.slug}`, post.lang)
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain(`lang="${post.lang}"`)
    expect(html).toContain(`rel="canonical" href="${siteUrl + path}"`)
    const data = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)![1])
    expect(data.props.pageProps.post.lang).toBe(post.lang)
    expect(data.props.pageProps.translations).toEqual(translationsFor(post, posts))
    for (const translation of translationsFor(post, posts)) {
      expect(html).toContain(`hrefLang="${languageTag(translation.lang)}" href="${siteUrl + localizedPath(`/posts/${translation.slug}`, translation.lang)}"`)
      if (translation.lang !== post.lang) {
        expect(html).toContain(`href="${localizedPath(`/posts/${translation.slug}`, translation.lang)}"`)
      }
    }
    const other = post.lang === 'en' ? 'pt-br' : 'en'
    expect((await request.get(localizedPath(`/posts/${post.slug}`, other))).status()).toBe(404)
  })
}
