import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Singleton — structure.ts hides this from the "+ New" menu.
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
      name: "cultureSection",
      title: "Culture / ROI",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "localeString",
        }),
        defineField({
          name: "stats",
          title: "Stats",
          type: "array",
          of: [{ type: "cultureStat" }],
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: "timeline",
          title: "Timeline",
          type: "array",
          of: [{ type: "cultureTimelineItem" }],
          validation: (rule) => rule.max(4),
        }),
        defineField({
          name: "image",
          title: "Spotlight image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "localeString",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "taxCtaSection",
      title: "Tax CTA",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "localeString" }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
        defineField({ name: "dishName", title: "Dish name", type: "localeString" }),
        defineField({ name: "salePrice", title: "Sale price", type: "localeString" }),
        defineField({ name: "listPrice", title: "List price", type: "localeString" }),
        defineField({ name: "savingsLabel", title: "Savings label", type: "localeString" }),
      ],
    }),
    defineField({
      name: "stepsSection",
      title: "Three steps",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "headingLine1", title: "Heading line 1", type: "localeString" }),
        defineField({ name: "headingLine2", title: "Heading line 2", type: "localeString" }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [{ type: "homepageStep" }],
          validation: (rule) => rule.max(3),
        }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
      ],
    }),
    defineField({
      name: "pricingSection",
      title: "Pricing calculator",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "localeString" }),
        defineField({ name: "daysQuestion", title: "Days question", type: "localeString" }),
        defineField({ name: "employeesQuestion", title: "Employees question", type: "localeString" }),
        defineField({ name: "subsidyQuestion", title: "Subsidy question", type: "localeString" }),
        defineField({ name: "emailPrompt", title: "Email prompt", type: "localeText" }),
        defineField({ name: "employeeResult", title: "Employee result", type: "pricingResultCard" }),
        defineField({ name: "companyResult", title: "Company result", type: "pricingResultCard" }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
      ],
    }),
    defineField({
      name: "testimonialsSection",
      title: "Testimonials",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "localeString" }),
        defineField({ name: "quote", title: "Quote", type: "localeText" }),
        defineField({ name: "authorName", title: "Author name", type: "localeString" }),
        defineField({ name: "authorRole", title: "Author role", type: "localeString" }),
      ],
    }),
    defineField({
      name: "contactSection",
      title: "Contact / quote form",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "localeString" }),
        defineField({ name: "body", title: "Body", type: "localeText" }),
        defineField({ name: "contactName", title: "Contact name", type: "localeString" }),
        defineField({ name: "contactEmail", title: "Contact email", type: "localeString" }),
        defineField({ name: "contactPhone", title: "Contact phone", type: "localeString" }),
        defineField({ name: "formHeading", title: "Form heading", type: "localeString" }),
        defineField({ name: "consentText", title: "Consent text", type: "localeText" }),
        defineField({ name: "submitLabel", title: "Submit label", type: "localeString" }),
      ],
    }),
    defineField({
      name: "supportSection",
      title: "Support center",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "localeString" }),
        defineField({ name: "body", title: "Body", type: "localeText" }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
      ],
    }),
    defineField({
      name: "faqSection",
      title: "FAQ",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "localeString" }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "homepageFaqItem" }],
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
