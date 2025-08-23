<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/RondaYummy.png',
    name: "Andrii",
    title: 'Creator of Swift I18n',
    links: [
      { icon: 'github', link: 'https://github.com/RondaYummy' },
    ]
  },
]
</script>

# What is Vue I18n?

Blazing-fast, dependency-free i18n library for `Vue 3`, `React` and modern `JS/TS apps`.
Uses native `Intl APIs` and modern features for blazing performance, dynamic locale loading, and `type-safe` keys.

# Why choose swift-i18n?

- **Higher speed** — no unnecessary dependencies, works on pure `Intl API`.
- **Minimal size** — lightweight and compact code.
- **TypeScript support** — `type-safe` translation keys and autocomplete.
- **Dynamic loading and caching** — convenient for working with large projects.
- **Easy integration** — `React` plugin and `Vue 3` plugin with provide/inject and hooks
- **Full support** — For `plural` and `formatting` — `numbers`, `dates`, `currencies`, `units`.

Go to [Installation](./installation)


## Meet the team

<VPTeamMembers size="small" :members="members" />