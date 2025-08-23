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