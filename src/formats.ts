export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions) {
   return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: number, currency: string, locale: string, options?: Intl.NumberFormatOptions) {
   return new Intl.NumberFormat(locale, { style: 'currency', currency, ...options }).format(value);
}

export function formatUnit(value: number, unit: Intl.NumberFormatOptions['unit'], locale: string) {
   return new Intl.NumberFormat(locale, { style: 'unit', unit }).format(value);
}

export function formatDate(date: Date | number, locale: string, options?: Intl.DateTimeFormatOptions) {
   return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit, locale: string) {
   return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
}
