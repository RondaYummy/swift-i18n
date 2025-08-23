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