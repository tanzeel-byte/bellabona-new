import { defineField, defineType } from "sanity";

/**
 * A single feature/benefit. The brief's explicit shape: icon + title +
 * description per item, editable in Sanity.
 *
 * The icon is intentionally just a string slug — picking from a known set
 * keeps the design system tight and avoids editors uploading off-brand
 * imagery. Add new slugs by updating the `Icon` component.
 */
export const featureItem = defineType({
  name: "featureItem",
  title: "Feature",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      initialValue: "leaf",
      options: {
        list: [
          { title: "🌿 Leaf (fresh)", value: "leaf" },
          { title: "👨‍🍳 Chef (chef-made)", value: "chef" },
          { title: "🚚 Truck (delivery)", value: "truck" },
          { title: "📱 Phone (app ordering)", value: "phone" },
          { title: "💰 Coin (cost saving)", value: "coin" },
          { title: "🥗 Bowl (variety)", value: "bowl" },
          { title: "⭐ Star (quality)", value: "star" },
          { title: "🤝 Handshake (partnership)", value: "handshake" },
        ],
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "description.en" },
  },
});
