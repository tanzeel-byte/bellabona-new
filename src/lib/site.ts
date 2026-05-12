/**
 * Single source of truth for the absolute site URL.
 * Used by metadata, sitemap, robots, OG tags, JSON-LD, and canonical links.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL (set per environment, including production)
 *   2. VERCEL_URL (auto-injected on Vercel deployments — preview & prod)
 *   3. localhost fallback for `next dev`
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Bella&Bona";
