import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Swift I18n",
  description: "Fast & Lightweight swift-i18n Library",
  base: '/swift-i18n/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Swift I18n?', link: '/guide/introduction' },
          { text: 'Installation', link: '/guide/installation' },
        ],
      },
      {
        text: 'Vue',
        items: [
          { text: 'Getting Started', link: '/guide/vue/started' },
        ],
      },
      {
        text: 'React',
        items: [
          { text: 'Getting Started', link: '/guide/react/started' },
        ],
      },
      {
        text: 'Essentials',
        items: [
          { text: 'Pluralization', link: '/guide/essentials/pluralization' },
          { text: 'Interpolation', link: '/guide/essentials/interpolation' },
          { text: 'Fallbacking', link: '/guide/essentials/fallbacking' },
          { text: 'Format helpers', link: '/guide/essentials/helpers' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Linked messages', link: '/guide/advanced/linked' },
          { text: 'Escape parameter option', link: '/guide/advanced/escape' },
          { text: 'Type-safe Translations', link: '/guide/advanced/safe' },
          { text: 'Runtime warnings', link: '/guide/advanced/warnings' },
        ],
      },
    ],

    editLink: {
      pattern:
        'https://github.com/RondaYummy/swift-i18n/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RondaYummy/swift-i18n' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Andrii Halevych'
    },

    search: {
      provider: 'local',
    },
  }
})
