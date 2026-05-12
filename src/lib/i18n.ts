/**
 * i18n configuration.
 *
 * The test brief only ships English, but the route structure, Sanity schema,
 * and metadata all support DE/EN from day one — flipping the `de` locale to
 * "live" later is purely a content task, not a code change.
 */
export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Pick a localized string from a `{ en, de }` object. Falls back to the
 * default locale if the requested locale is missing — never returns
 * undefined for valid content.
 */
export function pickLocale<T>(
  value: Partial<Record<Locale, T>> | undefined,
  locale: Locale,
): T | undefined {
  if (!value) return undefined;
  return value[locale] ?? value[DEFAULT_LOCALE];
}

/**
 * `<html lang>` attribute. BCP-47-friendly subset.
 */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  de: "de",
};
