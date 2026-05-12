import { defineField, defineType } from "sanity";

import { LOCALES } from "@/lib/i18n";

/**
 * A short single-line string with one value per supported locale.
 * Editors see one input per language; the API returns `{ en: "...", de: "..." }`.
 * Centralising this means adding a new locale is a one-line change.
 */
export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations" }],
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: "string",
      fieldset: "translations",
    }),
  ),
});
