# Bella&Bona — Developer Test

Homepage build for Bella&Bona on Next.js 16 + Sanity + Tailwind v4.

## Stack

Next.js 16.2 (App Router, Cache Components), React 19, Sanity 5 (embedded at `/studio`), Tailwind CSS v4, TypeScript strict.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in Sanity + site URL values
pnpm dev                     # localhost:3000 → /en, localhost:3000/studio for CMS
```

## Decisions

**Rendering** — Went with Next 16's Cache Components (`'use cache'` + `cacheLife` + `cacheTag`) instead of the legacy `revalidate` export. Pages are statically prerendered at build time. Sanity publishes hit a webhook at `/api/revalidate` that busts the relevant tag, so editors see changes in seconds without blocking readers.

**Performance** — Hero image uses `next/image` with `priority` and responsive `sizes`. All images go through Sanity's CDN with auto-format (AVIF/WebP). Fonts via `next/font/google` with `display: swap`. Only animation is a CSS `@keyframes` fade-in that respects `prefers-reduced-motion`. No JS animation libraries.

**SEO** — `generateMetadata` pulls everything from Sanity (title, description, OG image, canonical, noIndex toggle). hreflang alternates for all locales in both `<head>` and sitemap. Organization JSON-LD from site settings. Dynamic `robots.txt` and `sitemap.xml`.

**Sanity schema** — Homepage and site settings are singletons (enforced in `structure.ts`). SEO is a separate reusable object type with its own tab, so editors aren't confused by meta fields. All text fields are locale-aware (`localeString` / `localeText` / `localePortableText`).

**i18n** — Routes use `[locale]` segment, `/` redirects to `/en` via proxy. Adding a locale = one line in `lib/i18n.ts` + content in Sanity.

## Project layout

```
src/
  app/[locale]/           layout, page, not-found
  app/studio/             embedded Sanity Studio (separate root layout)
  app/api/revalidate/     Sanity webhook handler
  components/sections/    all page sections (Header, Hero, Footer, etc.)
  components/seo/         JSON-LD
  components/ui/          Container, Button, LocaleToggle, SocialIcon
  lib/                    i18n, metadata builder, site config
  sanity/schemas/         document + object schemas
  sanity/lib/             client, queries, fetch wrappers, image helpers
  types/sanity.ts         content types
  proxy.ts                locale redirect
```

## Trade-offs

**Font** — Figma uses Roc Grotesk (paid, LineTo). Shipped Figtree as a stand-in. Swapping is one `next/font/local` change + the .woff2 files.

**Sanity types** — Hand-written instead of codegenned. Fine for this scope, but in production I'd use `sanity typegen` so schema renames break at compile time.

**Studio as client component** — The embedded Studio needs browser APIs that Cache Components rejects during prerender. Gave it a separate root layout so the marketing site stays fully static.

## What I'd do differently

- **Codegen Sanity types** — field renames should produce TS errors, not silent runtime misses
- **Playwright visual regression** — snapshot the homepage against a fixed dataset so design drift is caught in CI
- **Self-host Roc Grotesk** with `unicode-range` subsets for Latin Extended (DE umlauts) to drop unused glyph weight
- **`'use cache: remote'`** for cache durability across cold starts on multi-region Vercel
