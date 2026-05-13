import { defineField, defineType } from "sanity";

export const cultureStat = defineType({
  name: "cultureStat",
  title: "Culture stat",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "localeString" }),
    defineField({ name: "title", title: "Title", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "value.en" },
  },
});

export const cultureTimelineItem = defineType({
  name: "cultureTimelineItem",
  title: "Timeline item",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "body.en" },
  },
});
