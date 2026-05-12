import { defineField, defineType } from "sanity";

/**
 * Hero section content. Image is required because the hero image is the LCP
 * element on the homepage — making it optional would make CLS unpredictable.
 */
export const hero = defineType({
  name: "hero",
  title: "Hero section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow (small label above headline)",
      type: "localeString",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "localePortableText",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
    }),
    defineField({
      name: "image",
      title: "Hero image",
      type: "image",
      description: "Used as the LCP image — prefer a 16:9 or 4:3 hero shot ≥1600px wide.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "localeString" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stats",
      title: "Stats (small trust signals)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "localeString" }),
            defineField({ name: "label", title: "Label", type: "localeString" }),
          ],
          preview: { select: { title: "value.en", subtitle: "label.en" } },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "foodLabels",
      title: "Food labels (overlaid on hero image)",
      type: "array",
      description:
        "Small pills overlaid on the hero image — name of a dish plus a rating or count.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Dish name",
              type: "localeString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "rating",
              title: "Rating value",
              type: "string",
              description: 'e.g. "4.9" or "257"',
            }),
            defineField({
              name: "ratingType",
              title: "Rating icon",
              type: "string",
              initialValue: "star",
              options: {
                list: [
                  { title: "Star (rating)", value: "star" },
                  { title: "Heart (count)", value: "heart" },
                  { title: "Leaf (badge)", value: "leaf" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "accent",
              title: "Accent colour",
              type: "string",
              initialValue: "red",
              options: {
                list: [
                  { title: "Red", value: "red" },
                  { title: "Amber", value: "amber" },
                  { title: "Green", value: "green" },
                ],
                layout: "radio",
              },
            }),
          ],
          preview: { select: { title: "name.en", subtitle: "rating" } },
        },
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "appBadges",
      title: "App store badges + Google rating",
      type: "object",
      options: { collapsible: true, collapsed: false },
      description:
        "Optional row of badges shown at the bottom of the hero image.",
      fields: [
        defineField({
          name: "playStoreUrl",
          title: "Google Play URL",
          type: "url",
        }),
        defineField({
          name: "appStoreUrl",
          title: "App Store URL",
          type: "url",
        }),
        defineField({
          name: "googleReviewUrl",
          title: "Google review URL",
          type: "url",
        }),
        defineField({
          name: "googleRatingValue",
          title: "Google rating value",
          type: "string",
          description: 'e.g. "4.7"',
        }),
        defineField({
          name: "googleRatingScale",
          title: "Google rating scale",
          type: "string",
          initialValue: "/5",
        }),
      ],
    }),
  ],
});
