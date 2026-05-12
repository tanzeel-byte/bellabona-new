import { defineField, defineType } from "sanity";

/**
 * Reusable call-to-action object. The variant selector lets editors swap
 * styles without coupling design tokens to specific button instances.
 */
export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal path (e.g. /menu) or external https URL.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Visual variant",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary (solid)", value: "primary" },
          { title: "Secondary (outline)", value: "secondary" },
          { title: "Ghost (link)", value: "ghost" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "label.en",
      subtitle: "href",
    },
  },
});
