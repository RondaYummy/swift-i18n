# Getting started

### Create locale files
Create a `locales` folder in your `src` directory:

```bash
src/
 ├─ locales/
 │   ├─ en.json
 │   └─ uk.json
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
    const module = await import(`./locales/${lang}.json`);
    return module.default;
  }
});
app.use(i18n);

app.mount('#app');
```

## Usage in components `script setup`

```ts
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