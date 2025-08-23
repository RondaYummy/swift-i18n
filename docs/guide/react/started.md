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