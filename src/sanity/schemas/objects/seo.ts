import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO & metadata",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "localeString",
      description: "50–60 characters. Shown in search results and browser tab.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "localeText",
      description: "120–160 characters. The snippet under the title in search results.",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description:
        "1200×630 recommended. Used for Twitter Cards and Open Graph (Facebook, LinkedIn, Slack).",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "localeString" }),
      ],
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "url",
      description:
        "Optional. Only set if this page's content lives elsewhere as the source of truth.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description: "Adds <meta name=\"robots\" content=\"noindex\">. Leave off for live pages.",
    }),
  ],
});
