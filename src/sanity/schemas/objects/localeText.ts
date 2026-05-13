import { defineField, defineType } from "sanity";

import { LOCALES } from "@/lib/i18n";

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
