## Debugging missing translations

### Runtime warnings

`swift-i18n` supports the **runtime key warnings** mechanism, which helps find problems with translation keys during development.
This allows you to quickly detect errors in localization keys that `TypeScript` cannot check statically.


#### The framework will output `console.warn` if one of the following occurs during the call to `t()`:
- Key not found in locale
- The value is not a string
- If supportedLangs is passed, then when attempting to change the language to one that is not supported

By default, `warnOnMissing` is enabled. To disable it, pass `warnOnMissing: false` to the `swift-i18n` configuration.