/* eslint-disable no-console */
/**
 * One-shot Sanity content seed.
 *
 * Populates `siteSettings` and `homepage` singletons with starter content
 * that matches the Figma design (English + German copy already populated
 * for both locales, so the bilingual structure is visible immediately).
 *
 * Uses `createOrReplace` on fixed singleton IDs (`siteSettings`, `homepage`),
 * so re-running the script is idempotent — it overwrites whatever's there.
 *
 * Run with:
 *   pnpm seed
 *
 * Requires SANITY_API_READ_TOKEN in .env.local to have *write* access (the
 * token starting with `sk` is a write key — be sure to rotate it after
 * the test ships).
 */

import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const projectId = need("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = need("NEXT_PUBLIC_SANITY_DATASET");
const token = need("SANITY_API_READ_TOKEN");
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

function need(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing env var ${name}. Check .env.local`);
    process.exit(1);
  }
  return v;
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Upload a remote image to Sanity's asset store and return its _id. */
async function uploadImageFromUrl(url: string, filename: string): Promise<string> {
  console.log(`  ↳ downloading ${filename} …`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  console.log(`  ↳ uploading to Sanity …`);
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

/** Upload a local image/SVG from the repo into Sanity's asset store. */
async function uploadImageFromFile(filePath: string, filename: string): Promise<string> {
  console.log(`  ↳ reading ${filename} …`);
  const buffer = readFileSync(filePath);
  console.log(`  ↳ uploading to Sanity …`);
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

/** Build the image reference shape Sanity stores on a document. */
function imageRef(assetId: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

/** Build a Portable Text block from a plain string. */
function ptBlock(text: string) {
  return [
    {
      _type: "block",
      _key: cryptoKey(),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: cryptoKey(),
          text,
          marks: [],
        },
      ],
    },
  ];
}

function cryptoKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

// --------------------------------------------------------------------------
// Content — mirrors the Figma file. Both EN and DE filled.
// --------------------------------------------------------------------------

// Long-stable Unsplash photo IDs — verified 200s.
const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop";

const OG_IMAGE_URL =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=630&q=80&auto=format&fit=crop";

const PRODUCT_MEAL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop",
    filename: "meal-pear-tofu-salad.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop",
    filename: "meal-tuna-egg-rice-bowl.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop",
    filename: "meal-thai-chicken-salad.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop",
    filename: "meal-bacon-cheeseburger.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80&auto=format&fit=crop",
    filename: "meal-greek-chopped-salad.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80&auto=format&fit=crop",
    filename: "meal-hawaiian-chicken-poke.jpg",
  },
] as const;

async function seed() {
  console.log(`→ Seeding project ${projectId} / ${dataset}`);

  // ---- Upload images ----
  console.log("\n1. Uploading hero image …");
  const heroAssetId = await uploadImageFromUrl(HERO_IMAGE_URL, "hero-lunch.jpg");

  console.log("\n2. Uploading OG image …");
  const ogAssetId = await uploadImageFromUrl(OG_IMAGE_URL, "og-image.jpg");

  console.log("\n3. Uploading logo bar assets …");
  const ifcoAssetId = await uploadImageFromFile(
    join(process.cwd(), "public/trust-logos/ifco.svg"),
    "ifco-logo.svg",
  );
  const atollsAssetId = await uploadImageFromFile(
    join(process.cwd(), "public/trust-logos/atolls.svg"),
    "atolls-logo.svg",
  );

  console.log("\n4. Uploading product meal images …");
  const productAssetIds = await Promise.all(
    PRODUCT_MEAL_IMAGES.map((image) => uploadImageFromUrl(image.url, image.filename)),
  );

  // ---- Site settings ----
  console.log("\n5. Writing siteSettings singleton …");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    organization: {
      legalName: "Bella&Bona GmbH",
      url: "https://bellabona.com",
      sameAs: [
        "https://www.linkedin.com/company/bellabona",
        "https://www.instagram.com/bellabona",
      ],
    },
    header: {
      links: [
        {
          _key: cryptoKey(),
          _type: "navLink",
          label: { en: "Daily lunch", de: "Tägliches Mittagessen" },
          href: "/lunch",
        },
        {
          _key: cryptoKey(),
          _type: "navLink",
          label: { en: "More", de: "Mehr" },
          href: "/more",
        },
      ],
      secondaryLink: {
        _type: "navLink",
        label: { en: "Download menu", de: "Menü herunterladen" },
        href: "/menu.pdf",
      },
      cta: {
        label: { en: "Book free testing", de: "Kostenlos testen" },
        href: "/contact",
        variant: "primary",
      },
    },
    footer: {
      tagline: {
        en: "Lunch programs that build culture and cut costs.",
        de: "Mittagessen-Programme, die Kultur aufbauen und Kosten senken.",
      },
      followUs: {
        heading: { en: "Follow us!", de: "Folge uns!" },
        body: {
          en: "Fresh menus, behind-the-scenes, and the occasional dad joke.",
          de: "Frische Menüs, Blicke hinter die Kulissen und gelegentlich ein Wortwitz.",
        },
        contactEmail: "fragen@bellabona.com",
        socialLinks: [
          {
            _key: cryptoKey(),
            platform: "google",
            url: "https://google.com/maps/place/bellabona",
          },
          {
            _key: cryptoKey(),
            platform: "twitter",
            url: "https://twitter.com/bellabona",
          },
          {
            _key: cryptoKey(),
            platform: "instagram",
            url: "https://instagram.com/bellabona",
          },
          {
            _key: cryptoKey(),
            platform: "linkedin",
            url: "https://linkedin.com/company/bellabona",
          },
          {
            _key: cryptoKey(),
            platform: "appstore",
            url: "https://apps.apple.com/de/app/bellabona",
          },
          {
            _key: cryptoKey(),
            platform: "playstore",
            url: "https://play.google.com/store/apps/details?id=com.bellabona",
          },
        ],
      },
      columns: [
        {
          _key: cryptoKey(),
          heading: { en: "Quick Links", de: "Schnellzugriffe" },
          links: [
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "For Employers", de: "Für Arbeitgeber" },
              href: "/employers",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "For Employees", de: "Für Mitarbeiter" },
              href: "/employees",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: {
                en: "Join the Bella&Bona team!",
                de: "Werde Teil des Bella&Bona-Teams!",
              },
              href: "/careers",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "About Us", de: "Über uns" },
              href: "/about",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Case Studies", de: "Fallstudien" },
              href: "/case-studies",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Blog", de: "Blogs" },
              href: "/blog",
            },
          ],
        },
        {
          _key: cryptoKey(),
          heading: { en: "Discover", de: "Entdecken" },
          links: [
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Our Menu", de: "Unser Menü" },
              href: "/menu",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Office Catering", de: "Geschäfts-Catering" },
              href: "/catering",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Daily Lunch", de: "Tägliches Mittagessen" },
              href: "/lunch",
            },
          ],
        },
        {
          _key: cryptoKey(),
          heading: { en: "Our Policies", de: "Unsere Richtlinien" },
          links: [
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Terms of Use", de: "Nutzungsbedingungen" },
              href: "/terms",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Privacy Policy", de: "Datenschutz" },
              href: "/privacy",
            },
            {
              _key: cryptoKey(),
              _type: "navLink",
              label: { en: "Cookies", de: "Cookies" },
              href: "/cookies",
            },
          ],
        },
      ],
      legalLinks: [
        {
          _key: cryptoKey(),
          _type: "navLink",
          label: { en: "Imprint", de: "Impressum" },
          href: "/imprint",
        },
      ],
      copyright: {
        en: `Bella&Bona Copyright © ${new Date().getFullYear()}. Made with care.`,
        de: `Bella&Bona Copyright © ${new Date().getFullYear()}. Mit Liebe gestaltet.`,
      },
    },
  });

  // ---- Homepage ----
  console.log("\n6. Writing homepage singleton …");
  await client.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    seo: {
      metaTitle: {
        en: "Bella&Bona — Lunch programs for modern teams",
        de: "Bella&Bona — Mittagessen-Programme für moderne Teams",
      },
      metaDescription: {
        en: "Offer 30+ chef-made meals weekly, delivered to your office. Employees order via app — all diets, zero admin. Trusted by 200+ companies.",
        de: "Bieten Sie 30+ chefkoch-gemachte Mahlzeiten pro Woche, geliefert ins Büro. Mitarbeitende bestellen per App — alle Diäten, null Verwaltung.",
      },
      ogImage: imageRef(ogAssetId),
      noIndex: false,
    },
    hero: {
      eyebrow: { en: "TEAM LUNCH", de: "TEAM-MITTAGESSEN" },
      headline: {
        en: "Offer Lunch to Build Culture & Cut Costs",
        de: "Mittagessen anbieten, um Kultur aufzubauen und Kosten zu senken",
      },
      subheadline: {
        en: ptBlock(
          "30+ fresh, chef-made meals weekly, delivered straight to the office. Employees order via app — all diets, no admin.",
        ),
        de: ptBlock(
          "30+ frische, chefkoch-gemachte Mahlzeiten pro Woche, direkt ins Büro geliefert. Mitarbeitende bestellen per App — alle Diäten, keine Verwaltung.",
        ),
      },
      primaryCta: {
        label: { en: "Book a free team lunch", de: "Kostenloses Team-Lunch" },
        href: "/contact",
        variant: "primary",
      },
      secondaryCta: {
        label: { en: "See our menu", de: "Menü ansehen" },
        href: "/menu",
        variant: "ghost",
      },
      image: {
        ...imageRef(heroAssetId),
        alt: {
          en: "Colleagues eating fresh lunch together at the office",
          de: "Kollegen, die zusammen frisches Mittagessen im Büro essen",
        },
      },
      stats: [
        {
          _key: cryptoKey(),
          value: { en: "9/10", de: "9/10" },
          label: {
            en: "Employee Satisfaction",
            de: "Mitarbeiterzufriedenheit",
          },
        },
        {
          _key: cryptoKey(),
          value: { en: "30-40%", de: "30-40%" },
          label: {
            en: "More teams in the office",
            de: "Mehr Teams im Büro",
          },
        },
        {
          _key: cryptoKey(),
          value: { en: "1.2 MM", de: "1,2 Mio." },
          label: {
            en: "Meals delivered in Munich & Berlin",
            de: "Mahlzeiten in München und Berlin geliefert",
          },
        },
      ],
      foodLabels: [
        {
          _key: cryptoKey(),
          name: { en: "Schnitzel", de: "Schnitzel" },
          rating: "4.9",
          ratingType: "star",
          accent: "red",
        },
        {
          _key: cryptoKey(),
          name: { en: "Kebab Bowl", de: "Kebab Bowl" },
          rating: "257",
          ratingType: "heart",
          accent: "amber",
        },
        {
          _key: cryptoKey(),
          name: { en: "Greek Salad", de: "Griechischer Salat" },
          rating: "5.0",
          ratingType: "leaf",
          accent: "green",
        },
      ],
      appBadges: {
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.bellabona",
        appStoreUrl: "https://apps.apple.com/de/app/bellabona",
        googleReviewUrl: "https://google.com/maps/place/bellabona",
        googleRatingValue: "4.7",
        googleRatingScale: "/5",
      },
    },
    logoBar: {
      heading: {
        en: "Loved by 400+ customers",
        de: "Geliebt von über 400 Kund:innen",
      },
      logos: [
        {
          _key: cryptoKey(),
          ...imageRef(ifcoAssetId),
          alt: { en: "IFCO logo", de: "IFCO-Logo" },
        },
        {
          _key: cryptoKey(),
          ...imageRef(atollsAssetId),
          alt: { en: "atolls logo", de: "atolls-Logo" },
        },
      ],
    },
    productsSection: {
      headingLine1: {
        en: "30+ Meal Options Every Week.",
        de: "30+ Gerichte jede Woche.",
      },
      headingLine2: {
        en: "Made Fresh Daily. For Every Diet.",
        de: "Täglich frisch. Für jede Ernährung.",
      },
      items: [
        {
          _key: cryptoKey(),
          tag: { en: "Seasonal Specials", de: "Saisonale Spezialitäten" },
          title: { en: "Fresh Salad with Pears & Tofu", de: "Frischer Salat mit Birnen & Tofu" },
          ratingPercent: "94%",
          reviewCount: "171",
          image: {
            ...imageRef(productAssetIds[0]),
            alt: { en: "Fresh salad with pears and tofu", de: "Frischer Salat mit Birnen und Tofu" },
          },
        },
        {
          _key: cryptoKey(),
          tag: { en: "High-Protein Meals", de: "Proteinreiche Gerichte" },
          title: { en: "High-Protein Tuna Egg Rice Bowl", de: "Proteinreicher Thunfisch-Ei-Reis-Bowl" },
          ratingPercent: "98%",
          reviewCount: "322",
          image: {
            ...imageRef(productAssetIds[1]),
            alt: { en: "High-protein tuna egg rice bowl", de: "Proteinreicher Thunfisch-Ei-Reis-Bowl" },
          },
        },
        {
          _key: cryptoKey(),
          tag: { en: "Gluten- & Lactose-Free", de: "Gluten- & laktosefrei" },
          title: { en: "Thai Chicken Salad", de: "Thailändischer Hähnchensalat" },
          ratingPercent: "92%",
          reviewCount: "186",
          image: {
            ...imageRef(productAssetIds[2]),
            alt: { en: "Thai chicken salad", de: "Thailändischer Hähnchensalat" },
          },
        },
        {
          _key: cryptoKey(),
          tag: { en: "International Cuisine", de: "Internationale Küche" },
          title: { en: "Bacon Cheeseburger", de: "Bacon Cheeseburger" },
          ratingPercent: "99%",
          reviewCount: "532",
          image: {
            ...imageRef(productAssetIds[3]),
            alt: { en: "Bacon cheeseburger", de: "Bacon Cheeseburger" },
          },
        },
        {
          _key: cryptoKey(),
          tag: { en: "Vegan & Veggie Variety", de: "Vegane & vegetarische Vielfalt" },
          title: { en: "Greek Chopped Salad", de: "Griechischer Chopped Salad" },
          ratingPercent: "94%",
          reviewCount: "202",
          image: {
            ...imageRef(productAssetIds[4]),
            alt: { en: "Greek chopped salad", de: "Griechischer Chopped Salad" },
          },
        },
        {
          _key: cryptoKey(),
          tag: { en: "Allergy & Halal Friendly", de: "Allergie- & halal-freundlich" },
          title: { en: "Hawaiian Chicken Poke", de: "Hawaiian Chicken Poke" },
          ratingPercent: "97%",
          reviewCount: "254",
          image: {
            ...imageRef(productAssetIds[5]),
            alt: { en: "Hawaiian chicken poke bowl", de: "Hawaiian Chicken Poke Bowl" },
          },
        },
      ],
      cta: {
        label: { en: "Download the menu now", de: "Menü jetzt herunterladen" },
        href: "/menu.pdf",
        variant: "primary",
      },
    },
    finalCta: {
      headline: {
        en: "Got questions? Let's talk lunch.",
        de: "Fragen? Lass uns übers Mittagessen reden.",
      },
      body: {
        en: "Book a 20-minute call. We'll scope your team's needs and send a sample menu within 24 hours.",
        de: "Buchen Sie ein 20-Minuten-Gespräch. Wir prüfen die Anforderungen Ihres Teams und senden innerhalb von 24 Stunden ein Beispielmenü.",
      },
      primaryCta: {
        label: { en: "Book a call", de: "Gespräch buchen" },
        href: "/contact",
        variant: "primary",
      },
    },
  });

  console.log("\n✓ Seed complete.");
  console.log("  → Open http://localhost:3000/en (restart `pnpm dev` to flush the cache)");
  console.log("  → Edit content at http://localhost:3000/studio");
}

seed().catch((err) => {
  console.error("\n✗ Seed failed:", err);
  process.exit(1);
});
