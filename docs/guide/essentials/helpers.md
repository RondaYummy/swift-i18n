# Format helpers

**Full support** — For `formatting` — `numbers`, `dates`, `currencies`, `units`, `time`.

```ts
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatUnit,
  formatNumberingSystem,
} from "swift-i18n";

formatNumber(1234567.89, "en-US"); // "1,234,567.89"
formatCurrency(1234.5, "USD", "en-US"); // "$1,234.50"
formatUnit(10, "kilometer-per-hour", "en-US"); // "10 km/h"
formatDate(new Date(), "en-US"); // "8/11/2025"
formatRelativeTime(-2, "day", "en-US"); // "2 days ago"
formatNumberingSystem(12345, "en", "arab"); // "١٢٣٤٥"
```

## Formatting numbers

Function for universal number formatting with locale considerations.

```ts
function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string

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
// Standard formatting
formatNumber(1234567.89, “en”);
// “1,234,567.89”

formatNumber(1234567.89, “uk”);
// “1 234 567,89”


// Scientific notation
formatNumber(1234567, “en”, { notation: “scientific” });
// “1.235E6”


// Engineering notation
formatNumber(98765, “en”, { notation: “engineering” });
// “98.765E3”


// Compact display
formatNumber(1234, “en”, { notation: ‘compact’, compactDisplay: “short” });
// “1.2K”

formatNumber(1234, “en”, { notation: ‘compact’, compactDisplay: “long” });
// “1.2 thousand”


// Always show sign
formatNumber(42, “en”, { signDisplay: “always” });
// “+42”


// Units of measurement
formatNumber(100, “en”, { style: “unit”, unit: ‘kilometer’, unitDisplay: “short” });
// “100 km”

formatNumber(100, “uk”, { style: “unit”, unit: ‘kilometer’, unitDisplay: “long” });
// “100 kilometers”


// Using a different numbering system
formatNumber(2025, “en”, { numberingSystem: “arab” });
// “٢٠٢٥”
```

:::info
- If a certain option is not supported in the environment, `Intl.NumberFormat` may ignore it.

- For currencies, it is recommended to use a separate method (`formatCurrency`).

- Available number systems can be obtained via: `Intl.supportedValuesOf("numberingSystem");`
:::

## Currency formatting

Function for formatting numbers as currency, taking into account locale and currency rules.

```ts
function formatCurrency(
  value: number,
  currency: string,
  locale: string,
  options?: Intl.NumberFormatOptions
): string

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
// Standard currency formatting
formatCurrency(1234.56, “USD”, “en”);
// “$1,234.56”

formatCurrency(1234.56, “EUR”, “de”);
// “1,234.56 €”

formatCurrency(1234.56, “UAH”, “uk”);
// “1,234.56 ₴”


// Negative values
formatCurrency(-500, “USD”, “en”);
// “-$500.00”

formatCurrency(-500, “USD”, ‘en’, { currencySign: “accounting” });
// “($500.00)”


// Compact display
formatCurrency(2500000, “USD”, “en”, { notation: ‘compact’, compactDisplay: “short” });
// “$2.5M”

formatCurrency(2500000, “USD”, “en”, { notation: ‘compact’, compactDisplay: “long” });
// “$2.5 million”


// Other numbering system
formatCurrency(2025, “USD”, ‘ar’, { numberingSystem: “arab” });
// “US$ ٢٠٢٥٫٠٠”
```

:::info
- You must specify the `currency`, otherwise an error will be thrown.

- Formatting depends on the locale: the position of the currency symbol, thousands separators, and decimal separators.

- For the Ukrainian locale (`uk`), the hryvnia is displayed as `₴`.

- For accounting formatting, use `currencySign: "accounting"`.
:::

## Formatting with units

The `formatUnit(value: number, unit: Intl.NumberFormatOptions[‘unit’], locale: string)` method in the `unit` parameter complies with the `CLDR standard`, for example, `"kilometer-per-hour"`, `"degree"`, `"kilogram"` etc.

## Date formatting

Function for formatting dates and times according to the locale.

```ts
function formatDate(
  date: Date | number,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string

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
formatDate(new Date("2025-08-28T15:45:00"), "en", { dateStyle: "full" });
// "Thursday, August 28, 2025"

formatDate(new Date("2025-08-28T15:45:00"), "uk", { dateStyle: "long", timeStyle: "short" });
// "28 серпня 2025 р. о 15:45"

formatDate(Date.now(), "fr", { timeStyle: "medium" });
// "15:45:00"

formatDate(new Date("2025-08-28"), "ja", { calendar: "japanese", dateStyle: "long" });
// "令和7年8月28日"
```



## Relative time formatting

A function for displaying time relative to the current moment (for example, “5 minutes ago” or “in 2 days”).

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

```ts
// Англійська
formatRelativeTime(-5, "minutes", "en");
// "5 minutes ago"

formatRelativeTime(2, "days", "en");
// "in 2 days"


// Українська
formatRelativeTime(-1, "day", "uk");
// "вчора"

formatRelativeTime(3, "hours", "uk");
// "через 3 години"


// Німецька
formatRelativeTime(-2, "weeks", "de");
// "vor 2 Wochen"
```
:::info
- The API automatically takes into account language rules for cases and numerals.

- The choice between “numeric: auto” and “numeric: always” is supported, but in this function, you can add it via options if you need more precise control.
:::

## Numbers according to the number system (e.g., Arabic, Devanagari)

Function for formatting numbers using different numbering systems available through Unicode Numbering Systems

```ts
function formatNumberingSystem(value: number, locale: string, numberingSystem: string): string

formatNumberingSystem(12345, "en", "arab");
// "١٢٣٤٥"  (Arabic numerals)

formatNumberingSystem(2025, "uk", "deva");
// "२०२५"  (Indian Devanagari)

formatNumberingSystem(999, "en", "latn");
// "999" (standard Latin numerals)

formatNumberingSystem(2025, "ar", "latn");
// "2025" (Latin system, even for Arabic locale)
```

## Formatting lists

Function for formatting arrays of strings into human-readable lists, taking into account the locale.

```ts
function formatList(
  items: string[],
  locale: string,
  options?: Intl.ListFormatOptions
): string;
```

- `items` – an array of strings for formatting.

- `locale` – locale (e.g., "`uk`", "`en`", "`fr`").

- `options` – additional parameters:

- `style` – "`long`" (default), "`short`", or "`narrow`".

```ts
formatList(["apple", "banana", ‘cherry’], "uk");
// "apple, banana, and cherry"

formatList(["apple", "banana", ‘cherry’], "en");
// "apple, banana, and cherry"

formatList(["auto", "bus", "train"], ‘en’, { style: "short" });
// "auto, bus, & train"

formatList(["apples", "bananas"], ‘en’, { type: "disjunction" });
// "apples or bananas"

formatList(["5 km", "10 km", "15 km"], ‘en’, { type: "unit" });
// "5 km, 10 km, 15 km"
```

:::info
- Localized conjunctions are automatically selected for each language.

- For 2 elements, the result will simply be “A and B” / “A і B”.

- Intl.ListFormat support is available in most modern browsers and Node.js (v14+).
:::