# swift-i18n

Blazing-fast, dependency-free i18n library for `Vue 3`, `React` and modern `JS/TS apps`.
Uses native `Intl APIs` and modern features for blazing performance, dynamic locale loading, `caching`, and `type-safe` keys.

[![npm version](https://badge.fury.io/js/swift-i18n.svg)](https://badge.fury.io/js/swift-i18n)
![NPM Downloads](https://img.shields.io/npm/dm/swift-i18n)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/RondaYummy/swift-i18n)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n?ref=badge_shield&issueType=license)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n?ref=badge_shield&issueType=security)

---

## Why choose swift-i18n?
- **Higher speed** — no unnecessary dependencies, works on pure `Intl API`.
- **Minimal size** — lightweight and compact code.
- **TypeScript support** — `type-safe` translation keys and autocomplete.
- **Dynamic loading and caching** — convenient for working with large projects.
- **Easy integration** — `React` plugin and `Vue 3` plugin with provide/inject and hooks
- **Full support** — For `plural` and `formatting` — `numbers`, `dates`, `currencies`, `units`.

---

## Features

- Native Intl APIs: `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`, `Intl.RelativeTimeFormat`
- Language detection (`localStorage`, `cookie`, `browser language`)
- Dynamic locale loading via `ESM` dynamic import
- Local caching of translation bundles in `localStorage` (7-day TTL)
- Vue 3 plugin with `provide`/`inject` and global `$t` function
- TypeScript-friendly with `type-safe` translation keys and autocompletion

---

## Get Started

### 1. Installation

```bash
npm install swift-i18n
```

### 2. Create locale files
Create a `locales` folder in your `src` directory:

```bash
src/
 ├─ locales/
 │   ├─ en.json
 │   └─ ua.json
```

### Example `en.json`:

```json
{
  "common": {
    "hello": "Hello!",
    "items_one": "{count} item",
    "items_other": "{count} items"
  },
  "home": {
    "title": "Welcome",
    "description": "This is the home page"
  }
}
```

### 3. Create `locale-loader.ts`

---

## `Vue 3` Integration with `Vite`

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createVueI18n } from 'swift-i18n/vue-plugin';
import { SwiftI18n } from 'swift-i18n';
import { loadLocale } from './locale-loader.ts';

const app = createApp(App);

const i18n = new SwiftI18n({
  defaultLang: 'en',
  supportedLangs: ['en', 'uk'],
  loader: loadLocale,
  cacheTtlMs:  1000 * 60 * 60 * 24 * 7, // 7 days
});

app.use(createVueI18n(i18n));

app.mount('#app');
```

## Usage in components (`<script setup>`)

```vue
<script setup lang="ts">
import { useI18n } from 'swift-i18n/vue-plugin';

const { t, plural, changeLanguage, lang } = useI18n();
</script>

<template>
  <h1>Current language: {{ lang }}</h1>

  <div>{{ t('common.hello') }}</div>
  <div>{{ plural('common.items', 5) }}</div>

  <button @click="changeLanguage('uk')">UK</button>
  <button @click="changeLanguage('en')">EN</button>
</template>
```

---

## `React` Integration

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadLocale } from './locale-loader.ts';
import { SwiftI18n } from 'swift-i18n';
import { createReactI18n } from 'swift-i18n/react-plugin';

const i18n = new SwiftI18n({
  defaultLang: 'en',
  supportedLangs: ['en', 'uk'],
  loader: loadLocale,
  cacheTtlMs:  1000 * 60 * 60 * 24 * 7, // 7 days
});

const I18nProvider = createReactI18n(i18n);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
```

```tsx
import React from 'react';
import { useI18n } from 'swift-i18n/react-plugin';

export default function App() {
  const { i18n, lang } = useI18n();
  return (
    <>
      <div>{i18n.t('common.hello')}</div>
      <div>{i18n.plural('common.items', 3)}</div>
      <button onClick={() => i18n.changeLanguage('uk')}>🇺🇦</button>
      <button onClick={() => i18n.changeLanguage('en')}>🇬🇧</button>
      <p>Current lang: {lang}</p>
    </>
  );
}
```

## Example `locale-loader.ts` for `Vite`

```ts
import type { LocaleBundle } from 'swift-i18n';
const localeModules = import.meta.glob('./locales/*.json');

export async function loadLocale(lang: string = 'en') {
  const importer = localeModules[`./locales/${lang}.json`];
  if (!importer) {
    throw new Error(`Locale ${lang} not found`);
  }
  const module = await importer();
  return (module as { default: LocaleBundle; }).default;
}
```

---

## Format helpers

```ts
import { formatCurrency, formatDate, formatRelativeTime, formatNumber, formatUnit } from 'swift-i18n';

formatNumber(1234567.89, 'en-US'); // "1,234,567.89"
formatCurrency(1234.5, 'USD', 'en-US'); // "$1,234.50"
formatUnit(10, 'kilometer-per-hour', 'en-US'); // "10 km/h"
formatDate(new Date(), 'en-US'); // "8/11/2025"
formatRelativeTime(-2, 'day', 'en-US'); // "2 days ago"
```

---

## Core Features

### Pluralization

The `plural(baseKey: string, count: number, vars?: Record<string, any>)` method returns the correct plural form translation:

### Example `JSON` structure:

```json
{
  "common": {
    "items_one": "{count} item",
    "items_few": "{count} items",
    "items_many": "{count} items",
    "items_other": "{count} items"
  }
}
```

### Usage:

```js
plural('common.items', 1); // "1 item"
plural('common.items', 3); // "3 items"
```

## Variable Interpolation

Pass variables into translations via the vars object:

```json
{
  "greeting": "Hello, {name}!"
}
```

```ts
t('greeting', { name: 'Alice' }); // "Hello, Alice!"
plural('common.items', 5, { name: 'Alice' });
```

---

## Dynamic loading & caching

- Translations are dynamically loaded via ESM `import()`
- Cached in `localStorage` for 7 days ( default )
- Automatic loading when calling `changeLanguage()`.

---

## Advanced Usage

### `Type-safe` Translations
Add type definitions for autocompletion:

1. Create `src/types/swift-i18n.d.ts`:

```ts
import 'swift-i18n';
declare module 'swift-i18n' {
  // Merge interface — put YOUR key scheme here
  interface Translations {
    common: {
      hello: string;
      items_one: string;
      items_other: string;
    };
    home: {
      title: string;
      description: string;
    };
  }
}
```

2. Add to `tsconfig.json`:

```json
{
  "include": [
    "src/types/**/*"
  ]
}
```

---

## Contribution
Welcome to contribute to `swift-i18n`!

- Fork the repository.
- Create a branch with new features or fixes.
- Write tests for new features.
- Send a pull request with a detailed description.
- Sign commits according to Conventional Commits.

Contact me if you need help or ideas.
