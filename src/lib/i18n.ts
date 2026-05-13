export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function pickLocale<T>(
  value: Partial<Record<Locale, T>> | undefined,
  locale: Locale,
): T | undefined {
  if (!value) return undefined;
  return value[locale] ?? value[DEFAULT_LOCALE];
}

export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  de: "de",
};
