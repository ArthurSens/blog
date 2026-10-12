import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: { remarkPlugins: ['remark-frontmatter'] },
})

export default withMDX({
  i18n: {
    locales: ['en', 'pt-br'],
    defaultLocale: 'en',
    localeDetection: false,
  },
})
