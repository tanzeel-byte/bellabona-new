import { defineField, defineType } from "sanity";

import { LOCALES } from "@/lib/i18n";

/**
 * Rich-text Portable Text per locale. Editors get bold/italic/links — the
 * minimum set for marketing copy. Avoid adding too many marks here; the more
 * options an editor has, the harder it is to keep visual consistency.
 */
export const localePortableText = defineType({
  name: "localePortableText",
  title: "Localized rich text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations" }],
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: "array",
      fieldset: "translations",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                        allowRelative: true,
                      }),
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),
  ),
});
