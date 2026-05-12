import { defineField, defineType } from "sanity";

export const productCard = defineType({
  name: "productCard",
  title: "Meal card",
  type: "object",
  fields: [
    defineField({
      name: "tag",
      title: "Tag",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ratingPercent",
      title: "Rating percent",
      type: "string",
      description: 'e.g. "94%"',
    }),
    defineField({
      name: "reviewCount",
      title: "Review count",
      type: "string",
      description: 'e.g. "171"',
    }),
    defineField({
      name: "image",
      title: "Meal image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "localeString",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "tag.en",
      media: "image",
    },
  },
});
