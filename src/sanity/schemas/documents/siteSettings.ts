import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Site-wide settings: organization info (drives the Organization JSON-LD
 * structured data), header nav, footer nav. Singleton — enforced in
 * structure.ts.
 *
 * Editing here changes every page that consumes site settings, so the
 * cache tag is keyed on `siteSettings` and a webhook from this document
 * invalidates every page.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "organization", title: "Organization", default: true },
    { name: "header", title: "Header" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "organization",
      title: "Organization (for JSON-LD)",
      type: "object",
      group: "organization",
      description:
        "Powers the Organization structured data injected on every page. Improves brand SERP and knowledge panel coverage.",
      fields: [
        defineField({
          name: "legalName",
          title: "Legal name",
          type: "string",
        }),
        defineField({
          name: "url",
          title: "Canonical website URL",
          type: "url",
        }),
        defineField({
          name: "logo",
          title: "Logo (used in JSON-LD)",
          type: "image",
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        }),
        defineField({
          name: "sameAs",
          title: "Social profile URLs",
          type: "array",
          of: [{ type: "url" }],
          description: "LinkedIn, Instagram, etc. Included in JSON-LD sameAs.",
        }),
      ],
    }),
    defineField({
      name: "header",
      title: "Header",
      type: "object",
      group: "header",
      fields: [
        defineField({
          name: "logo",
          title: "Header logo",
          type: "image",
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "localeString" }),
          ],
        }),
        defineField({
          name: "links",
          title: "Primary nav links",
          type: "array",
          of: [{ type: "navLink" }],
          validation: (rule) => rule.max(6),
        }),
        defineField({
          name: "secondaryLink",
          title: "Secondary text link (next to CTA)",
          type: "navLink",
          description: 'e.g. "Download menu" — appears underlined to the left of the CTA pill.',
        }),
        defineField({
          name: "cta",
          title: "Header CTA button",
          type: "cta",
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "localeText",
        }),
        defineField({
          name: "followUs",
          title: "Follow us block",
          type: "object",
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "localeString",
              description: 'e.g. "Follow us" / "Folge uns!"',
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "localeText",
            }),
            defineField({
              name: "contactEmail",
              title: "Contact email",
              type: "string",
              validation: (rule) =>
                rule.email().error("Must be a valid email address"),
            }),
            defineField({
              name: "socialLinks",
              title: "Social links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "platform",
                      title: "Platform",
                      type: "string",
                      options: {
                        list: [
                          { title: "Google", value: "google" },
                          { title: "Twitter / X", value: "twitter" },
                          { title: "Instagram", value: "instagram" },
                          { title: "LinkedIn", value: "linkedin" },
                          { title: "Facebook", value: "facebook" },
                          { title: "YouTube", value: "youtube" },
                          { title: "App Store", value: "appstore" },
                          { title: "Google Play", value: "playstore" },
                        ],
                      },
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "url",
                      title: "URL",
                      type: "url",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: "platform", subtitle: "url" } },
                },
              ],
              validation: (rule) => rule.max(8),
            }),
          ],
        }),
        defineField({
          name: "columns",
          title: "Link columns",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "heading",
                  title: "Column heading",
                  type: "localeString",
                }),
                defineField({
                  name: "links",
                  title: "Links",
                  type: "array",
                  of: [{ type: "navLink" }],
                }),
              ],
              preview: { select: { title: "heading.en" } },
            },
          ],
          validation: (rule) => rule.max(4),
        }),
        defineField({
          name: "legalLinks",
          title: "Legal links (privacy, imprint…)",
          type: "array",
          of: [{ type: "navLink" }],
        }),
        defineField({
          name: "copyright",
          title: "Copyright line",
          type: "localeString",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
