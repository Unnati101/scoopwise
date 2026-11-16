const currencyFormats = new Map<string, Intl.NumberFormat>();

/** Formats an amount in Indian rupees. Whole amounts show no decimals, others show two. */
export function formatCurrency(value: number, locale = 'en-US'): string {
  const digits = Number.isInteger(value) ? 0 : 2;
  const key = `${locale}:${digits}`;
  let format = currencyFormats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR', currencyDisplay: 'narrowSymbol', minimumFractionDigits: digits, maximumFractionDigits: digits });
    currencyFormats.set(key, format);
  }
  return format.format(value);
}

export function formatDateTime(value: number | string, locale = 'en-US'): string {
  return new Date(value).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' }).replace(/\u202f/g, ' ');
}

export function formatDate(value: number | string | Date, locale = 'en-US'): string {
  return new Date(value).toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(value: number | string | Date, locale = 'en-US'): string {
  return new Date(value).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }).replace(/\u202f/g, ' ');
}

/** Weekday name for a day index where 0 is Sunday. */
export function formatWeekday(day: number, locale = 'en-US', style: 'long' | 'short' = 'long'): string {
  return new Date(2024, 0, 7 + day).toLocaleDateString(locale, { weekday: style });
}
