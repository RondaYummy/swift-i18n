# Format helpers

**Full support** — For `formatting` — `numbers`, `dates`, `currencies`, `units`, `time`.

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

```ts
function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions)

interface NumberFormatOptions {
    numberingSystem?: string | undefined;
    compactDisplay?: "short" | "long" | undefined;
    notation?: "standard" | "scientific" | "engineering" | "compact" | undefined;
    signDisplay?: NumberFormatOptionsSignDisplay | undefined;
    unit?: string | undefined;
    unitDisplay?: "short" | "long" | "narrow" | undefined;
    currencySign?: "standard" | "accounting" | undefined;
}
```

```ts
formatCurrency(value: number, currency: string, locale: string, options?: Intl.NumberFormatOptions)

interface NumberFormatOptions {
    numberingSystem?: string | undefined;
    compactDisplay?: "short" | "long" | undefined;
    notation?: "standard" | "scientific" | "engineering" | "compact" | undefined;
    signDisplay?: NumberFormatOptionsSignDisplay | undefined;
    unit?: string | undefined;
    unitDisplay?: "short" | "long" | "narrow" | undefined;
    currencySign?: "standard" | "accounting" | undefined;
}
```

The `formatUnit(value: number, unit: Intl.NumberFormatOptions[‘unit’], locale: string)` method in the `unit` parameter complies with the `CLDR standard`, for example, `“kilometer-per-hour”`, `“degree”`, `“kilogram”` etc.

```ts
function formatDate(
  date: Date | number,
  locale: string,
  options?: Intl.DateTimeFormatOptions
);

interface DateTimeFormatOptions {
  calendar?: string | undefined;
  dayPeriod?: "narrow" | "short" | "long" | undefined;
  numberingSystem?: string | undefined;

  dateStyle?: "full" | "long" | "medium" | "short" | undefined;
  timeStyle?: "full" | "long" | "medium" | "short" | undefined;
  hourCycle?: "h11" | "h12" | "h23" | "h24" | undefined;
}
```

```ts
function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string
);

type RelativeTimeFormatUnit =
  | "year"
  | "years"
  | "quarter"
  | "quarters"
  | "month"
  | "months"
  | "week"
  | "weeks"
  | "day"
  | "days"
  | "hour"
  | "hours"
  | "minute"
  | "minutes"
  | "second"
  | "seconds";
```
