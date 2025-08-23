# swift-i18n

Blazing-fast, dependency-free i18n library for `Vue 3`, `React` and modern `JS/TS apps`.
Uses native `Intl APIs` and modern features for blazing performance, dynamic locale loading, `caching`, and `type-safe` keys.

[![Coverage Status](https://coveralls.io/repos/github/RondaYummy/swift-i18n/badge.svg?branch=main)](https://coveralls.io/github/RondaYummy/swift-i18n?branch=main)
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
- Vue 3 plugin with `provide`/`inject` and global `$t` function
- TypeScript-friendly with `type-safe` translation keys and autocompletion

---

## Get Started

#### 1. Installation

```bash
npm install swift-i18n
```

#### 2. Create locale files
Create a `locales` folder in your `src` directory:

```bash
src/
 ├─ locales/
 │   ├─ en.json
 │   └─ uk.json
```

#### Example `en.json`:

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

## `Vue 3` Integration with `Vite`

```ts
import { createApp } from 'vue';
import App from './App.vue';
import { createSwiftI18n } from 'swift-i18n/vue-plugin';

const app = createApp(App);

const i18n = await createSwiftI18n({
  defaultLang: 'en',
  supportedLangs: ['en', 'uk'],
  loader: async (lang) => {
    const module = await import(`./locales/${lang}.json`)
    return module.default
  }
});
app.use(i18n);

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
import { createSwiftI18n } from 'swift-i18n/react-plugin';

async function bootstrap() {
  const I18nProvider = await createSwiftI18n({
    defaultLang: 'en',
    supportedLangs: ['en', 'uk'],
    loader: async (lang) => {
      const module = await import(`./locales/${lang}.json`)
      return module.default
    }
  });

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>
  )
}

bootstrap()
```

```tsx
import React from 'react';
import { useI18n } from 'swift-i18n/react-plugin';

export default function App() {
  const { t, lang, changeLanguage, plural } = useI18n();

  return (
    <>
      <div>{t('common.hello')}</div>
      <div>{plural('common.items', 3)}</div>
      <button onClick={() => changeLanguage('uk')}>🇺🇦</button>
      <button onClick={() => changeLanguage('en')}>🇬🇧</button>
      <p>Current lang: {lang}</p>
    </>
  );
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

#### Example `JSON` structure:

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

#### Usage:

```js
plural('common.items', 1); // "1 item"
plural('common.items', 3); // "3 items"
```

---

### Variable Interpolation

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

### Fallbacking

`fallbackLang: 'en'` to choose which language to use when your preferred language lacks a translation.

Sometimes some items will not be translated into some languages. In this example, the item `hello` is available in English but not Japanese:

```json
{
  "en": {
    "hello": "Hello, world!"
  },
  "ja": {
  }
}
```

If you want to use (say) `en` items when an item is not available in your desired locale, set the `fallbackLang` option in the `createSwiftI18n`:

```ts
const i18n = await createSwiftI18n({
  defaultLang: 'ja',
  fallbackLang: 'en',
  loader: async (lang) => {
    const module = await import(`./locales/${lang}.json`)
    return module.default
  }
});
```

---

# Advanced Usage

## Linked messages

If there’s a locale messages key that will always have the same concrete text as another one you can just link to it.

To link to another locale messages key, all you have to do is to prefix its contents with an `@:key` sign followed by the full name of the locale messages key including the namespace you want to link to.

#### Locale messages the below:

```json
{
  "en": {
    "message": {
      "the_world": "the world",
      "dio": "DIO:",
      "linked": "@:message.dio @:message.the_world !!!!"
    }
  }
}
```
It’s `en` locale that has hierarchical structure in the object.

The `message.the_world` has `the_world` and `message.dio`. The `message.linked` has `@:message.dio @:message.dio @:message.the_world !!!!`, and it’s linked to the locale messages key with `message.dio` and `message.the_world`.

#### The following is an example of the use of `$t()` or `t()` in a template:

```html
<p>{{ $t('message.linked') }}</p>
```

The first argument is `message.linked` as the locale messages key as a parameter to `t`.

#### As result the below:

```html
<p>DIO: the world !!!!</p>
```

---

## Using the escape parameter option

To help mitigate XSS risks when using HTML messages, Vue I18n provides escape parameter options. When enabled, this option escapes interpolation parameters and sanitizes the final translated HTML.

#### For example:

```ts
// enable `escapeParameter` globally
const i18n = createI18n({
  locale: 'en',
  escapeParameter: true,
})

// or enable it per translation
t('message.welcome', { name }, { escapeParameter: true })
```

#### How it works

When the escape parameter option is enabled:

- HTML special characters (`<`, `>`, `"`, `'`, `&`, `/`, `=`) in interpolation parameters are escaped
- The final translated HTML is sanitized to prevent XSS attacks:
  - Dangerous characters in HTML attribute values are escaped
  - Event handler attributes (`onclick`, `onerror`, etc.) are neutralized
  - JavaScript URLs in href, src, action, formaction, and style attributes are disabled

#### Example

```ts
const input = '<img src=x onerror=alert(1)>'

// Without escape parameter (DANGEROUS):
$t('message.hello', { name: input })
// Result: Hello <strong><img src=x onerror=alert(1)></strong>!

// With escape parameter (SAFE):
$t('message.hello', { name: input }, { escapeParameter: true })
// Result: Hello <strong>&lt;img src=x &#111;nerror=alert(1)&gt;</strong>!
```

---

## Dynamic loading & caching

- Translations are dynamically loaded via ESM `import()`
- Automatic loading when calling `changeLanguage()`.

---

## `Type-safe` Translations

Add type definitions for autocompletion:

1. Create `src/types/swift-i18n.d.ts`:

**[Manual schema definition]**

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

**[Derive schema directly from a JSON locale file]**

Alternatively, you can generate the type definition automatically from an existing locale (e.g. `en.json`).
This approach ensures the types always stay in sync with your translation files.

```ts
import 'swift-i18n';
import en from '../locales/en.json'

type MessageSchema = typeof en;

declare module 'swift-i18n' {
  interface Translations extends MessageSchema {};
}
```

> [!TIP]
> Use the **manual schema** if you want strict control.  
> Use the **derived schema** if you prefer automatic synchronization.

2. Add to `tsconfig.json`:

```json
{
  "include": [
    "src/types/**/*"
  ]
}
```

---

## Debugging missing translations

### Runtime warnings

`swift-i18n` supports the **runtime key warnings** mechanism, which helps find problems with translation keys during development.
This allows you to quickly detect errors in localization keys that `TypeScript` cannot check statically.


#### The framework will output `console.warn` if one of the following occurs during the call to `t()`:
- Key not found in locale
- The value is not a string
- If supportedLangs is passed, then when attempting to change the language to one that is not supported

By default, `warnOnMissing` is enabled. To disable it, pass `warnOnMissing: false` to the `swift-i18n` configuration.

---

## Contribution
Welcome to contribute to `swift-i18n`!

- Fork the repository.
- Create a branch with new features or fixes.
- Write tests for new features.
- Send a pull request with a detailed description.
- Sign commits according to Conventional Commits.

Contact me if you need help or ideas.
