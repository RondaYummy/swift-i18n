# Custom Message Format

:::tip Supported Versions
:new: 1.3+
:::

If you want to use a message format like ICU Message Format, you can use a custom format by implementing the message compiler yourself.

:::warning
This topic requires understanding Swift I18n message format compilation and how formats are resolved.
:::

:::warning
The feature is experimental. It may receive breaking changes or be removed in the future.
:::

## Message Compiler implementation

You can make a message compiler by implementing functions with the following interfaces.

The following is a TypeScript type definition:

```js
export type MessageCompiler = (
  message: string | unknown,
  ctx: {
    locale: string;
    key: string;
    onError?: (err: CompileError) => void;
  }
) => MessageFunction;
```

The following is an example of a message compiler implementation that uses [`intl-messageformat`](https://formatjs.io/docs/intl-messageformat/) to support the ICU Message format.

```ts
import IntlMessageFormat from "intl-messageformat";

import type { MessageCompiler, CompileError, MessageContext } from "swift-i18n";

export const messageCompiler: MessageCompiler = (
  message,
  { locale, key, onError }
) => {
  if (typeof message === "string") {
    /**
     * You can tune your message compiler performance more with your cache strategy or also memoization at here
     */
    const formatter = new IntlMessageFormat(message, locale);
    return (ctx: MessageContext) => {
      return formatter.format(ctx.values);
    };
  } else {
    /**
     * for AST.
     * If you would like to support it,
     /**
      * You need to transform locale messages such as `json`, `yaml`, etc. with the bundle plugin.
      */
    if (onError) {
      onError(
        new Error("AST format for messages is not supported") as CompileError
      );
    }
    return () => key;
  }
};
```

## Message compiler registration

After implementing message compiler, set the `messageCompiler` option of `createSwiftI18n` as follows, and you can use your message format for the `messages` option:

```ts
import { createSwiftI18n } from "swift-i18n";
import { messageCompiler } from "./compilation";

const i18n = createSwiftI18n({
  locale: "en",
  messageCompiler,
});

// the below your something to do ...
// ...
```

Example in the translation file:

```json
{
  "common": {
    "hello": "Hello {name}, you have {count, plural, one {# message} other {# messages}}"
  }
}
```

Example of use and substitution in a template:

```html
<h1>{{ t('common.Hello', { name: "John", count: 5 }) }}</h1>
```

Result obtained:

```js
Hello John, you have 5 messages

```

## Reference

:::info
You can get the code for the tutorial below on [examples/message-format](https://github.com/intlify/vue-i18n/tree/master/examples/message-format).
:::
