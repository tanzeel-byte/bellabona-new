# Bella&Bona — Developer Test

Single-page homepage build on Next.js + Sanity. Phase 1 ships the foundation
the rest of the site will inherit: rendering strategy, SEO infrastructure,
Sanity schema, and the Header / Hero / Footer sections.

## Stack

- **Next.js 16.2** (App Router, Turbopack, Cache Components)
- **React 19**
- **Sanity 5** (embedded Studio at `/studio`)
- **Tailwind CSS v4** (CSS-first `@theme` token config)
- **TypeScript**, strict mode

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in Sanity + site URL values
pnpm dev                     # http://localhost:3000  → redirects to /en
                              # http://localhost:3000/studio for the CMS
```

Build & typecheck:

```bash
pnpm build
pnpm typecheck
```

## Key decisions

### Rendering: Cache Components, not legacy ISR

Next.js 16 removed `export const revalidate` once `cacheComponents: true` is
enabled. We adopted the new model in full:

- All Sanity reads sit behind `'use cache'` wrappers
  (`src/sanity/lib/fetch.ts`) with `cacheLife('hours')` and a per-document
  `cacheTag` (`'homepage'`, `'siteSettings'`).
- The page is **statically prerendered** for every locale at build (see
  `Generating static pages` in build output). TTFB is whatever the edge
  cache returns — sub-100ms after the first hit.
- **On-demand revalidation**: a Sanity webhook posts to
  `POST /api/revalidate` with a shared secret. The handler maps the changed
  `_type` to its tag and calls `revalidateTag(tag, 'max')` — stale-while-
  revalidate semantics, no blocking work for readers.
- Editors get sub-second freshness without sacrificing static rendering.

### LCP & Core Web Vitals

- Hero image: `next/image` with `priority`, `fetchPriority="high"`, explicit
  `width`/`height`, responsive `sizes`, and a Sanity LQIP blur placeholder.
- Sanity serves AVIF/WebP via the image CDN; the asset pipeline is
  `auto-format` (negotiated per browser).
- Fonts: `next/font/google` with `display: 'swap'` and CSS variable
  injection — no FOIT, font files preloaded.
- Animations: a single CSS `@keyframes` (`.reveal` in `globals.css`) that
  honours `prefers-reduced-motion`. **No** GSAP, Framer Motion, or other JS
  animation libraries on the critical path.

### SEO

- `generateMetadata()` in `app/[locale]/page.tsx` reads Sanity SEO fields
  (`metaTitle`, `metaDescription`, `ogImage`, `canonicalUrl`, `noIndex`) via
  `buildMetadata()` in `src/lib/metadata.ts`. **Zero hardcoded copy.**
- **Organization JSON-LD** injected on every page via
  `src/components/seo/OrganizationJsonLd.tsx`, sourced from the
  `siteSettings` singleton.
- **hreflang** alternates emitted for every supported locale + `x-default`
  in both the `<head>` (via `alternates.languages`) and the sitemap.
- `app/sitemap.ts` and `app/robots.ts` are dynamic; Studio is the only path
  disallowed for crawlers.
- `noIndex` toggle in Sanity flips `metadata.robots.index` — editors can
  pull a page from search without a deploy.

### Sanity schema

- **Singletons** (`homepage`, `siteSettings`) enforced via the structure
  builder in `src/sanity/structure.ts` — editors can't create duplicates.
- **SEO is a separate object** (`src/sanity/schemas/objects/seo.ts`) reused
  across documents, not mixed in with content fields. Collapsed by default
  so editors focus on copy first.
- **Locale-aware from day one**: `localeString`, `localeText`, and
  `localePortableText` objects with one input per supported locale. The
  brief only ships English, but adding German is purely a content task.
- **Portable Text** for the hero subheadline and any future rich-text areas
  — editors get bold/italic/links, deliberately not a kitchen sink.
- **Hero image is required** in the schema because it's the LCP element;
  making it optional would make CLS unpredictable.

### i18n awareness

- Route segment is `app/[locale]/...` with `generateStaticParams` returning
  `['en', 'de']`.
- `/` is redirected to `/en` by `src/proxy.ts` (Next 16 `proxy` file — the
  renamed-from-`middleware` convention).
- `lib/i18n.ts` is the single source of truth for the locale list; adding
  a third locale is one line + content.

## Project layout

```
src/
  app/
    [locale]/
      layout.tsx          # root layout (html, body, fonts, Header, Footer, JSON-LD)
      page.tsx            # homepage — generateMetadata + Hero render
      not-found.tsx
    studio/
      layout.tsx          # minimal root layout for embedded Studio
      [[...tool]]/page.tsx
    api/revalidate/route.ts  # Sanity webhook → revalidateTag
    sitemap.ts
    robots.ts
    globals.css           # Tailwind v4 @theme tokens
  components/
    sections/{Header,Hero,Footer}.tsx
    seo/OrganizationJsonLd.tsx
    ui/{Container,Button}.tsx
  lib/
    i18n.ts               # locale config + pickLocale helper
    metadata.ts           # buildMetadata(): Sanity SEO → Next.js Metadata
    site.ts               # SITE_URL / SITE_NAME
  sanity/
    env.ts                # validated env vars
    lib/{client,image,fetch,queries}.ts
    schemas/
      documents/{homepage,siteSettings}.ts
      objects/{seo,cta,hero,navLink,localeString,localeText,localePortableText}.ts
      index.ts
    structure.ts          # singleton enforcement
  types/sanity.ts         # hand-written content types
  proxy.ts                # `/` → `/en` redirect (Next 16 proxy)
sanity.config.ts
sanity.cli.ts
next.config.ts            # cacheComponents + image CDN allowlist
```

## CMS setup

The Sanity project is connected (`8yc2ngkf` / `production`).
First-run checklist for editors:

1. Visit `/studio` and log in with the Sanity account that has access.
2. Open **Site settings** → fill organization, header nav, footer columns.
3. Open **Homepage** → fill the SEO group, then the Hero section
   (headline, subheadline, primary CTA, image, stats).
4. Publish. Site updates within seconds via the webhook.

### Wiring the revalidation webhook

In Sanity → Manage → API → Webhooks, create a webhook with:

| Field | Value |
| --- | --- |
| URL | `https://{your-domain}/api/revalidate` |
| Trigger | Create / Update / Delete |
| Filter | `_type in ["homepage", "siteSettings"]` |
| HTTP method | POST |
| Secret | matches `SANITY_REVALIDATE_SECRET` (sent in `Sanity-Webhook-Secret` header) |

## Known trade-offs

- **Roc Grotesk vs Figtree**: the Figma design uses Roc Grotesk (paid font,
  LineTo). We ship Figtree (free, Google Fonts) as the closest stand-in.
  Swapping to Roc Grotesk is a single `next/font/local` change in
  `app/[locale]/layout.tsx` plus the `.woff2` files in `/public/fonts/`.
- **Sanity types**: hand-written in `src/types/sanity.ts` for the test.
  In a production codebase we'd codegen via `sanity typegen` (the script
  is wired up at `pnpm sanity:typegen`) so schema renames stay in sync.
- **Phase 1 scope**: only Header, Hero, Footer ship. Logo bar, features
  grid, and final-CTA sections are scaffolded in the Sanity schema and
  will plug in during phase 2 using the same render-from-Sanity pattern.
- **Studio prerendering**: the embedded Studio runs as a client component
  (`'use client'`) because it uses React Context APIs that Cache
  Components rejects during prerender. Its layout is a separate root so
  navigating between marketing pages and Studio is a hard reload — that's
  intentional (editors expect a fresh Studio session).

## What I'd do differently with more time

- **Codegen types** from the Sanity schema (`pnpm sanity:typegen`) and
  wire them through the GROQ queries, so a field rename produces a TS
  error at the call site rather than a silent runtime miss.
- **Visual regression test** via Playwright snapshots on the homepage at a
  fixed Sanity dataset (e.g. a `staging` dataset) so the design diff is
  enforced in CI rather than eyeballed.
- **PartyTown / route-level lazy-loading** for any third-party analytics
  added later, to keep the main thread clean.
- **Server-only `'use cache: remote'`** for runtime cache durability on
  multi-region Vercel — the default in-memory cache doesn't persist
  across cold starts.
- **Real Roc Grotesk file** and a self-hosted font subset, with `unicode-
  range` declarations for Latin Extended (DE umlauts) to avoid loading
  Cyrillic + Greek glyphs we don't use.
