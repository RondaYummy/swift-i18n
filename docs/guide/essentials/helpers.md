# Format helpers

**Full support** — For `formatting` — `numbers`, `dates`, `currencies`, `units`.

```ts
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatUnit,
} from "swift-i18n";

formatNumber(1234567.89, "en-US"); // "1,234,567.89"
formatCurrency(1234.5, "USD", "en-US"); // "$1,234.50"
formatUnit(10, "kilometer-per-hour", "en-US"); // "10 km/h"
formatDate(new Date(), "en-US"); // "8/11/2025"
formatRelativeTime(-2, "day", "en-US"); // "2 days ago"
```
