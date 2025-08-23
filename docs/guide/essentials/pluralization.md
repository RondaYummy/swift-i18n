# Pluralization

The `plural(baseKey: string, count: number, vars?: Record<string, any>)` method returns the correct plural form translation:

### Example `JSON` structure:

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

### Usage:

```js
plural('common.items', 1); // "1 item"
plural('common.items', 3); // "3 items"
```