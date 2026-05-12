import { defineField, defineType } from "sanity";

import { LOCALES } from "@/lib/i18n";

/**
 * Multi-line text variant of localeString. Use for paragraphs of plain text
 * where rich-text formatting is not required (e.g. CTA subtitles, taglines).
 * For headings/body that need bold/links use localePortableText instead.
 */
export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations" }],
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: "text",
      rows: 3,
      fieldset: "translations",
    }),
  ),
});
