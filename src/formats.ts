export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
   return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: number, currency: string, locale: string, options?: Intl.NumberFormatOptions): string {
   return new Intl.NumberFormat(locale, { style: 'currency', currency, ...options }).format(value);
}

export function formatUnit(value: number, unit: Intl.NumberFormatOptions['unit'], locale: string): string {
   return new Intl.NumberFormat(locale, { style: 'unit', unit }).format(value);
}

export function formatDate(date: Date | number, locale: string, options?: Intl.DateTimeFormatOptions): string {
   return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit, locale: string): string {
   return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
}

export function formatNumberingSystem(value: number, locale: string, numberingSystem: string): string {
   return new Intl.NumberFormat(`${locale}-u-nu-${numberingSystem}`).format(value);
}

export function formatList(
  items: string[],
  locale: string,
  options?: { style?: 'long' | 'short' | 'narrow'; type?: 'conjunction' | 'disjunction' | 'unit' }
): string {
  // Fallback if Intl.ListFormat is not available
  if (typeof (Intl as any).ListFormat === "undefined") {
    return items.join(", ");
  }
  return new (Intl as any).ListFormat(
    locale,
    { style: "long", type: "conjunction", ...(options || {}) }
  ).format(items);
}