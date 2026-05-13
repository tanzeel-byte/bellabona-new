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

const HERO_IMAGE_FILE = "public/figma/56aba6c8117d006b060e4b030cecdd7aa75b4895.png";

const OG_IMAGE_URL =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=630&q=80&auto=format&fit=crop";

const PRODUCT_MEAL_FILES = [
  "public/figma/f10164200f2cc2e7d86dcb8f4c3ae04be1e8e137.png",
  "public/figma/e6896caaa48982523cbd8b68151ee3845a7a3e54.png",
  "public/figma/6f58e355f8e6908d53143092160a10b14c35fedf.png",
  "public/figma/ce7dea7a77c49662e567de19f09ff071da384e89.png",
  "public/figma/ab9d0239b8898ce610d94c80e792ef6b226b3cfb.png",
  "public/figma/0462d331bbcf0cd50b53eef04960cebe907f2d1f.png",
] as const;

async function seed() {
  console.log(`→ Seeding project ${projectId} / ${dataset}`);

  // ---- Upload images ----
  console.log("\n1. Uploading hero image …");
  const heroAssetId = await uploadImageFromFile(
    join(process.cwd(), HERO_IMAGE_FILE),
    "hero-lunch.png",
  );

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
    PRODUCT_MEAL_FILES.map((relativePath) =>
      uploadImageFromFile(join(process.cwd(), relativePath), relativePath.split("/").pop()!),
    ),
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
    cultureSection: {
      heading: {
        en: "The #1 Perk That Actually Boosts Culture, Attendance, and ROI",
        de: "Der Benefit Nr. 1 für Kultur, Anwesenheit und ROI",
      },
      stats: [
        {
          _key: cryptoKey(),
          value: { en: "30-40%", de: "30-40%" },
          title: { en: "Attendance Boost", de: "Mehr Anwesenheit" },
          body: {
            en: "Because nobody can say no to great food",
            de: "Weil niemand gutem Essen widerstehen kann",
          },
        },
        {
          _key: cryptoKey(),
          value: { en: "7,50 €", de: "7,50 €" },
          title: { en: "Tax-free per meal", de: "Steuerfrei pro Mahlzeit" },
          body: {
            en: "Only pay for what's used",
            de: "Nur zahlen, was genutzt wird",
          },
        },
        {
          _key: cryptoKey(),
          value: { en: "92%", de: "92%" },
          title: { en: "Users use it daily", de: "Nutzen es täglich" },
          body: {
            en: "Finally, a benefit everyone loves",
            de: "Endlich ein Benefit, den alle lieben",
          },
        },
      ],
      timeline: [
        {
          _key: cryptoKey(),
          title: { en: "30+ Daily Options for All Diets", de: "30+ tägliche Optionen für alle Ernährungen" },
          body: {
            en: "Halal, vegan, gluten-free – no one's left out.",
            de: "Halal, vegan, glutenfrei – niemand bleibt außen vor.",
          },
        },
        {
          _key: cryptoKey(),
          title: { en: "Employees Order by App. Zero Admin For You", de: "No vouchers, no chasing, simply one invoice" },
          body: {
            en: "No vouchers, no chasing, simply one invoice",
            de: "Keine Gutscheine, kein Verfolgen, einfach eine Rechnung.",
          },
        },
        {
          _key: cryptoKey(),
          title: { en: "Delivered to your office", de: "Direkt ins Büro geliefert" },
          body: {
            en: "Fresh meals arrive on the days you choose.",
            de: "Frische Gerichte an den Tagen, die Sie wählen.",
          },
        },
      ],
    },
    taxCtaSection: {
      headline: {
        en: "Fill office seats with tax-deductible lunches.",
        de: "Füllen Sie Büroplätze mit steuerlich absetzbarem Mittagessen.",
      },
      cta: {
        label: { en: "Get Custom Quote", de: "Individuelles Angebot anfordern" },
        href: "/contact",
        variant: "primary",
      },
      dishName: { en: "Pasta Bowl", de: "Pasta Bowl" },
      salePrice: { en: "4.50€", de: "4,50 €" },
      listPrice: { en: "9.90€", de: "9,90 €" },
      savingsLabel: { en: "You save 5.40 €", de: "Sie sparen 5,40 €" },
    },
    stepsSection: {
      headingLine1: {
        en: "From test lunch to happy teams in",
        de: "Vom Test-Mittagessen zu glücklichen Teams in",
      },
      headingLine2: { en: "3 easy steps", de: "3 einfachen Schritten" },
      steps: [
        {
          _key: cryptoKey(),
          stepLabel: { en: "Step 01", de: "Schritt 01" },
          title: {
            en: "Set delivery interval & budget",
            de: "Lieferintervall und Budget festlegen",
          },
          body: {
            en: "Ready to go in less than a week.",
            de: "In weniger als einer Woche startklar.",
          },
        },
        {
          _key: cryptoKey(),
          stepLabel: { en: "Step 02", de: "Schritt 02" },
          title: { en: "Lunch runs automatically", de: "Mittagessen läuft automatisch" },
          body: {
            en: "Team orders by 9:00 for same-day delivery.",
            de: "Das Team bestellt bis 9:00 Uhr für die Lieferung am selben Tag.",
          },
        },
        {
          _key: cryptoKey(),
          stepLabel: { en: "Step 03", de: "Schritt 03" },
          title: {
            en: "Track satisfaction & usage",
            de: "Zufriedenheit und Nutzung verfolgen",
          },
          body: {
            en: "Dashboard for order volume, billing data, etc.",
            de: "Dashboard für Bestellvolumen, Abrechnungsdaten und mehr.",
          },
        },
      ],
      cta: {
        label: { en: "Schedule Free Test Lunch", de: "Kostenloses Test-Mittagessen planen" },
        href: "/contact",
        variant: "primary",
      },
    },
    pricingSection: {
      heading: {
        en: "Let's Run Some Numbers and Make Lunch Work for You",
        de: "Rechnen wir nach und machen Mittagessen für Sie nutzbar",
      },
      daysQuestion: {
        en: "How many days per week do you want to offer lunch?",
        de: "An wie vielen Tagen pro Woche möchten Sie Mittagessen anbieten?",
      },
      employeesQuestion: {
        en: "How many employees will roughly join?",
        de: "Wie viele Mitarbeitende werden ungefähr teilnehmen?",
      },
      subsidyQuestion: {
        en: "How much of each meal will your company cover?",
        de: "Wie viel übernimmt Ihr Unternehmen pro Mahlzeit?",
      },
      emailPrompt: {
        en: "Enter your email for a custom breakdown and expert advice on saving more.*",
        de: "Geben Sie Ihre E-Mail für eine individuelle Aufstellung und Spartipps ein.*",
      },
      employeeResult: {
        heading: {
          en: "What your employees pay per meal",
          de: "Was Ihre Mitarbeitenden pro Mahlzeit zahlen",
        },
        value: { en: "3.50 € - 5.50 € / dish", de: "3,50 € - 5,50 € / Gericht" },
        caption: { en: "Per employee per dish", de: "Pro Mitarbeitendem pro Gericht" },
        note: {
          en: "Employees top up their virtual wallet with all common payment methods.",
          de: "Mitarbeitende laden ihr virtuelles Wallet mit allen gängigen Zahlungsmethoden auf.",
        },
      },
      companyResult: {
        heading: {
          en: "What your company pays per month",
          de: "Was Ihr Unternehmen pro Monat zahlt",
        },
        value: { en: "2247 € - 2511 € / mo", de: "2247 € - 2511 € / Monat" },
        caption: { en: "Per month total", de: "Gesamt pro Monat" },
        note: {
          en: "You only pay what your team orders. A small service fee applies.",
          de: "Sie zahlen nur, was Ihr Team bestellt. Es fällt eine kleine Servicegebühr an.",
        },
      },
      cta: {
        label: { en: "Get Custom Quote", de: "Individuelles Angebot anfordern" },
        href: "/contact",
        variant: "primary",
      },
    },
    testimonialsSection: {
      heading: {
        en: "Join 200+ Companies Filling Desks and Boosting Culture With Lunch",
        de: "Schließen Sie sich über 200 Unternehmen an, die mit Mittagessen Kultur stärken",
      },
      quote: {
        en: "This is the first benefit that everyone is really happy about—and that they will continue to use for longer than two months.",
        de: "Das ist der erste Benefit, über den wirklich alle glücklich sind – und den sie länger als zwei Monate nutzen werden.",
      },
      authorName: { en: "Anna Boehm", de: "Anna Boehm" },
      authorRole: { en: "People Manager", de: "People Managerin" },
    },
    contactSection: {
      headline: {
        en: "Got Questions? Let’s Talk Lunch.",
        de: "Fragen? Lassen Sie uns über Mittagessen sprechen.",
      },
      body: {
        en: "Straightforward answers on pricing, setup and whether Bella&Bona fits your office – we're here to help.",
        de: "Klare Antworten zu Preisen, Setup und ob Bella&Bona zu Ihrem Büro passt – wir helfen gern.",
      },
      contactName: { en: "Sara Dorofeev", de: "Sara Dorofeev" },
      contactEmail: { en: "sara@bellabona.com", de: "sara@bellabona.com" },
      contactPhone: { en: "+49 151 2960 5077", de: "+49 151 2960 5077" },
      formHeading: {
        en: "Schedule an appointment now",
        de: "Jetzt einen Termin vereinbaren",
      },
      consentText: {
        en: "I agree to be contacted by Bella&Bona regarding this request.",
        de: "Ich stimme zu, dass Bella&Bona mich zu dieser Anfrage kontaktiert.",
      },
      submitLabel: {
        en: "Request a free quote",
        de: "Kostenloses Angebot anfordern",
      },
    },
    supportSection: {
      heading: {
        en: "Already a Bella&Bona customer?",
        de: "Bereits Bella&Bona-Kunde?",
      },
      body: {
        en: "Access the Support Center to manage orders, check your balance, or resolve questions about your account.",
        de: "Nutzen Sie das Support Center, um Bestellungen zu verwalten, Ihr Guthaben zu prüfen oder Fragen zu Ihrem Konto zu klären.",
      },
      cta: {
        label: { en: "Go to Support Center", de: "Zum Support Center" },
        href: "/support",
        variant: "primary",
      },
    },
    faqSection: {
      heading: {
        en: "Tax-free meal allowance, employee catering & more – everything you need to know.",
        de: "Steuerfreier Essenszuschuss, Mitarbeiterverpflegung und mehr – alles, was Sie wissen müssen.",
      },
      items: [
        {
          _key: cryptoKey(),
          question: {
            en: "What is the tax-free lunch subsidy (Steuerfreier Essenszuschuss) in Germany?",
            de: "Was ist der steuerfreie Essenszuschuss in Deutschland?",
          },
          answer: {
            en: "Bella&Bona is designed to seamlessly apply the tax-free meal subsidy on every eligible order. You only pay per meal, and we handle the automated invoicing and tax compliance, so your finance team doesn’t have to. Touch base with us and we’ll guide you through it.",
            de: "Bella&Bona ist darauf ausgelegt, den steuerfreien Essenszuschuss bei jeder berechtigten Bestellung nahtlos anzuwenden. Sie zahlen nur pro Mahlzeit, und wir übernehmen automatisierte Rechnungsstellung und steuerliche Compliance, damit Ihr Finanzteam das nicht muss.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "How does Bella&Bona help me use the tax-free lunch benefit (Steuerfreier Essenszuschuss)?",
            de: "Wie hilft Bella&Bona mir, den steuerfreien Essenszuschuss zu nutzen?",
          },
          answer: {
            en: "Traditional meal vouchers (Essensgutscheine) often go unused, are limited to partner restaurants, and create reimbursement hassle. Bella&Bona offers 30+ fresh, chef-made meals delivered daily, with 92% usage and zero paperwork. CFOs love the savings and teams actually enjoy the perk.",
            de: "Klassische Essensgutscheine werden oft nicht genutzt, sind auf Partnerrestaurants beschränkt und erzeugen Erstattungsaufwand. Bella&Bona bietet täglich über 30 frische Gerichte mit 92 % Nutzung und ohne Papierkram.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "What makes this better than meal vouchers (Essensgutscheine)?",
            de: "Was macht das besser als Essensgutscheine?",
          },
          answer: {
            en: "Almost none. Employees order via app, and Bella&Bona delivers ready-to-eat meals. You receive one monthly invoice, with access to a real-time admin dashboard for usage tracking and tax reporting.",
            de: "Kaum welcher. Mitarbeitende bestellen per App, Bella&Bona liefert fertige Mahlzeiten. Sie erhalten eine monatliche Rechnung und ein Echtzeit-Dashboard für Nutzung und Steuerreporting.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "How much admin work is involved?",
            de: "Wie viel Verwaltungsaufwand ist damit verbunden?",
          },
          answer: {
            en: "Yes. Every meal clearly lists allergens and dietary tags. With 40% plant-based options, halal-friendly, lactose- and gluten-free meals, every team member finds something they love – regardless of background or preference.",
            de: "Ja. Jede Mahlzeit listet Allergene und Ernährungs-Tags klar auf. Mit 40 % pflanzlichen Optionen sowie halalfreundlichen, laktose- und glutenfreien Gerichten findet jedes Teammitglied etwas Passendes.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "We have an international team. Do you support diverse dietary needs?",
            de: "Wir haben ein internationales Team. Unterstützt ihr unterschiedliche Ernährungsbedürfnisse?",
          },
          answer: {
            en: "Yes. Every meal clearly lists allergens and dietary tags. With 40% plant-based options, halal-friendly, lactose- and gluten-free meals, every team member finds something they love – regardless of background or preference.",
            de: "Ja. Jede Mahlzeit listet Allergene und Ernährungs-Tags klar auf. Mit 40 % pflanzlichen Optionen sowie halalfreundlichen, laktose- und glutenfreien Gerichten findet jedes Teammitglied etwas Passendes.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "Can I test the service before committing?",
            de: "Kann ich den Service testen, bevor ich mich festlege?",
          },
          answer: {
            en: "Absolutely. We offer a free team tasting for up to 50 people, so you can experience the impact before rolling it out. No setup cost, no hidden fees – just great food.",
            de: "Absolut. Wir bieten eine kostenlose Teamverkostung für bis zu 50 Personen, damit Sie die Wirkung vor dem Rollout erleben können. Keine Einrichtungskosten, keine versteckten Gebühren.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "Is Bella&Bona a good fit for hybrid or part-time office teams?",
            de: "Passt Bella&Bona zu hybriden oder teilweise im Büro arbeitenden Teams?",
          },
          answer: {
            en: "Yes. You can select specific delivery days, adjust your budget any time, and even rotate team members. Most companies see 30–40% higher office attendance on Bella&Bona lunch days.",
            de: "Ja. Sie wählen Liefer­tage, passen das Budget jederzeit an und können Teammitglieder rotieren. Viele Unternehmen sehen an Bella&Bona-Mittagstagen 30–40 % höhere Büroanwesenheit.",
          },
        },
        {
          _key: cryptoKey(),
          question: {
            en: "How fast can we go live?",
            de: "Wie schnell können wir live gehen?",
          },
          answer: {
            en: "Most companies go from first contact to first lunch in under 7 days. There’s no lengthy setup, and our team supports you through every step – from free tasting to full rollout.",
            de: "Die meisten Unternehmen gehen vom Erstkontakt bis zum ersten Mittagessen in unter 7 Tagen live. Ohne langwieriges Setup begleitet Sie unser Team von der Verkostung bis zum Rollout.",
          },
        },
      ],
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
