# swift-i18n

Blazing-fast, dependency-free i18n library for Vue 3 and modern JS/TS apps.  
Uses native Intl APIs and modern features for blazing performance, dynamic locale loading, caching, and type-safe keys.

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
import { createSwiftI18n } from 'swift-i18n';

const app = createApp(App);

const customLoader = async (lang: string = 'en') => {
  const module = await import(`./locales/${lang}.json`);
  return module.default;
};

app.use(createSwiftI18n({
  defaultLang: 'en',
  supportedLangs: ['en', 'uk'],
  loader: customLoader, // The path to your locales
}));

app.mount('#app');
```

---

## Usage in components (`<script setup>`)

```vue
<script setup lang="ts">
import { useI18n } from 'swift-i18n';

const { t, plural, changeLanguage, lang } = useI18n();
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

## Format helpers

```ts
import { formatCurrency, formatDate, formatRelativeTime, formatNumber, formatUnit } from 'swift-i18n';

formatNumber(1234567.89, 'en-US'); // "1,234,567.89"
formatNumber(1234567.89, 'de-DE'); // "1.234.567,89"

formatCurrency(1234.5, 'USD', 'en-US'); // "$1,234.50"
formatCurrency(1234.5, 'EUR', 'de-DE'); // "1.234,50 €"

formatUnit(10, 'kilometer-per-hour', 'en-US'); // "10 km/h"
formatUnit(5, 'liter', 'fr-FR'); // "5 l"

formatDate(new Date(), 'en-US'); // "8/11/2025"
formatDate(Date.now(), 'de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
// "Dienstag, 11. August 2025"

formatRelativeTime(-2, 'day', 'en-US'); // "2 days ago"
formatRelativeTime(3, 'month', 'fr-FR'); // "dans 3 mois"
```

---

## plural(baseKey: string, count: number, vars?: Record<string, any>)
Returns the correct plural form translation for a given count based on the locale’s plural rules.
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

Usage:
```bash
plural('common.items', 1); // "1 item"
plural('common.items', 3); // "3 items"
```

## Writing translations (Type-safe)

12. Add a file for key typing (e.g. `src/types/i18n.d.ts`):

```ts
// types/i18n.d.ts
import type { NestedKeyOf } from 'swift-i18n';

type MyTranslations = {
  common: {
    hello: string;
    items_one: string;
    items_other: string;
  };
  home: {
    title: string;
    description: string;
  };
};

declare module 'swift-i18n' {
  export type TranslationKey = NestedKeyOf<MyTranslations>;
}
```

2. Place the translations in the `locales` folder as JSON:

```bash
src/
 ├─ locales/
 │   ├─ en.json
 │   ├─ ua.json
 │   └─ de.json
```

---

## Dynamic loading & caching

- Translations are dynamically loaded via ESM `import()` from the `locales` folder. 
- They are cached in `localStorage` for 7 days (TTL can be changed in the code).
- Calling `changeLanguage(‘de’)` will automatically load the German translation and switch the language.

---

## Notes

- For SSR: translations must be loaded manually by the server (via `fetch` or inject in the render).

---
