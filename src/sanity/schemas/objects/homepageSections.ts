import { defineField, defineType } from "sanity";

export const homepageStep = defineType({
  name: "homepageStep",
  title: "Homepage step",
  type: "object",
  fields: [
    defineField({ name: "stepLabel", title: "Step label", type: "localeString" }),
    defineField({ name: "title", title: "Title", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "stepLabel.en" },
  },
});

export const pricingResultCard = defineType({
  name: "pricingResultCard",
  title: "Pricing result card",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "value", title: "Value", type: "localeString" }),
    defineField({ name: "caption", title: "Caption", type: "localeString" }),
    defineField({ name: "note", title: "Note", type: "localeText" }),
  ],
});

export const testimonialItem = defineType({
  name: "testimonialItem",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "localeText" }),
    defineField({ name: "authorName", title: "Author name", type: "localeString" }),
    defineField({ name: "authorRole", title: "Author role", type: "localeString" }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "localeString" }),
      ],
    }),
  ],
  preview: {
    select: { title: "authorName.en", subtitle: "authorRole.en", media: "photo" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Testimonial", subtitle, media };
    },
  },
});

export const homepageFaqItem = defineType({
  name: "homepageFaqItem",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString" }),
    defineField({ name: "answer", title: "Answer", type: "localeText" }),
  ],
  preview: {
    select: { title: "question.en" },
  },
});
