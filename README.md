# swift-i18n

Blazing-fast, dependency-free i18n library for Vue 3 and modern JS/TS apps.
Uses native Intl APIs and modern features for blazing performance, dynamic locale loading, caching, and type-safe keys.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n?ref=badge_shield&issueType=license)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2FRondaYummy%2Fswift-i18n?ref=badge_shield&issueType=security)

---

## Why choose swift-i18n? (Comparison with other libraries)
- Higher speed — no unnecessary dependencies, works on pure Intl API.
- Minimal size — lightweight and compact code.
- TypeScript support — type-safe translation keys and autocomplete.
- Dynamic loading and caching — convenient for working with large projects.
- Easy integration into Vue 3 — via a plugin with provide/inject and hooks.
- Full support for plural and formatting — numbers, dates, currencies, units.

---

## Features

- Native Intl APIs: `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`, `Intl.RelativeTimeFormat`
- Language detection (localStorage, cookie, browser language)
- Dynamic locale loading via ESM dynamic import
- Local caching of translation bundles in `localStorage` (7-day TTL)
- Vue 3 plugin with `provide`/`inject` and global `$t` function
- TypeScript-friendly with type-safe translation keys and autocompletion

---

## Installation

```bash
npm install swift-i18n
```

---

## Basic usage (Vue 3)

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createVueI18n } from 'swift-i18n/vue-plugin';
import { SwiftI18n } from 'swift-i18n';

const app = createApp(App);

const customLoader = async (lang: string = 'en') => {
  const module = await import(`./locales/${lang}.json`);
  return module.default;
};

const i18n = new SwiftI18n({
  defaultLang: 'en',
  loader: customLoader,
});

app.use(createVueI18n(i18n));

app.mount('#app');
```

---

## Usage in components (`<script setup>`)

```vue
<script setup lang="ts">
import { useI18n } from 'swift-i18n/vue-plugin';

const { i18n } = useI18n();
const { t, plural, changeLanguage, lang } = i18n;
</script>

<template>
  <div>{{ t('common.hello') }}</div>
  <div>{{ plural('common.items', 5) }}</div>

  <button @click="changeLanguage('uk')">UK</button>
  <button @click="changeLanguage('de')">DE</button>
  <button @click="changeLanguage('en')">EN</button>

  <p>Current language: {{ lang }}</p>
</template>
```

---

## Basic usage (React)

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
  loader: loadLocale,
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

## Example locale-loader.ts

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

## plural(baseKey: string, count: number, vars?: Record<string, any>)
Returns the correct plural form translation for a given count based on the locale"s plural rules.

The plural("common.items", 3) method returns the plural form, for example: "one", "few", "many", "other" (depending on the language).

### Example of JSON translation
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

### Challenge:
```js
plural('common.items', 1); // "1 item"
plural('common.items', 3); // "3 items"
```

## Transferring variables in translations
You can pass variables (e.g., names, numbers) into translations via the vars object:

```json
{
  "greeting": "Hello, {name}!"
}
```

```ts
t('greeting', { name: 'Alice' }); // "Hello, Alice!"
```

Similarly in the plural:
```ts
plural('common.items', 5, { name: 'Alice' });
```

---

## Dynamic loading & caching

- Translations are dynamically loaded via ESM `import()` from the `locales` folder.
- They are cached in `localStorage` for 7 days (TTL can be changed in the code).
- Calling `changeLanguage("de")` will automatically load the German translation and switch the language.

---

## Writing translations (Type-safe)

1. Add a file for key typing (e.g. `src/types/i18n.d.ts`):

```ts
// src/types/swift-i18n.d.ts
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

2. Add the file to tsconfig.json:

```json
{
  "include": [
    "src/types/**/*" // Or another folder or file where you described your translation scheme
  ]
}
```

3. Place the translations in the `locales` folder as JSON:

```bash
src/
 ├─ locales/
 │   ├─ en.json
 │   ├─ ua.json
 │   └─ de.json
```

---

## Notes

- For SSR: translations must be loaded manually by the server (via `fetch` or inject in the render).

---

## Contribution / How to contribute
Welcome to contribute to swift-i18n!

- Fork the repository.
- Create a branch with new features or fixes.
- Write tests for new features.
- Send a pull request with a detailed description.
- Sign commits according to Conventional Commits.

Contact me if you need help or ideas.
