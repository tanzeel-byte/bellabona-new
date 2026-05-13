import { defineField, defineType } from "sanity";

import { LOCALES } from "@/lib/i18n";

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
