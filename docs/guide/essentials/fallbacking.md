# Fallbacking

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

By default, falling back to fallback generates two console warnings:

```ts
[swift-i18n] Missing key "hello" in lang "ja"
[swift-i18n] Fall back to translate the keypath 'hello' with 'en' locale.
```