import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Homepage as a singleton — there is exactly one in the dataset.
 * Singleton enforcement happens in structure.ts (the document is hidden from
 * the "+ New" menu) so editors can never accidentally create a second.
 *
 * Top-level fields are deliberately split into "seo" and content sections.
 * This is the explicit green flag from the brief.
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "seo", title: "SEO", default: false },
    { name: "content", title: "Content", default: true },
  ],
  fields: [
    defineField({
      name: "seo",
      title: "SEO & metadata",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoBar",
      title: "Social proof / logo bar",
      type: "object",
      group: "content",
      description:
        "Sits directly under the hero. Renders a row of client logos with an optional heading.",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "localeString",
          description: 'e.g. "Trusted by 200+ teams across Europe"',
        }),
        defineField({
          name: "logos",
          title: "Logos",
          type: "array",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "localeString",
                }),
              ],
              preview: {
                select: {
                  title: "alt.en",
                  subtitle: "alt.de",
                  media: "asset",
                },
                prepare({ title, subtitle, media }) {
                  return {
                    title: title || subtitle || "Logo",
                    media,
                  };
                },
              },
            },
          ],
          validation: (rule) => rule.max(8),
        }),
      ],
    }),
    defineField({
      name: "features",
      title: "Features / benefits",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "localeString",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "localeString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "localeText",
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "featureItem" }],
          validation: (rule) => rule.min(2).max(8),
        }),
      ],
    }),
    defineField({
      name: "productsSection",
      title: "Meal options / products",
      type: "object",
      group: "content",
      description:
        "Lime section with a grid of meal cards and a menu download CTA.",
      fields: [
        defineField({
          name: "headingLine1",
          title: "Heading line 1",
          type: "localeString",
        }),
        defineField({
          name: "headingLine2",
          title: "Heading line 2",
          type: "localeString",
        }),
        defineField({
          name: "items",
          title: "Meal cards",
          type: "array",
          of: [{ type: "productCard" }],
          validation: (rule) => rule.min(3).max(6),
        }),
        defineField({
          name: "cta",
          title: "CTA",
          type: "cta",
        }),
      ],
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA section",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "headline",
          title: "Headline",
          type: "localeString",
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "localeText",
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "cta",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
