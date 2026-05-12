"use client";

/**
 * Embedded Sanity Studio route. The Studio is a fully-fledged React app that
 * relies on browser-only APIs (window, React Context, IndexedDB), so this
 * route runs on the client. `'use client'` opts the segment out of
 * server-side rendering — without it the build fails when Cache Components
 * tries to prerender the Studio.
 *
 * Page-level metadata is intentionally omitted here because `metadata` and
 * `viewport` exports are forbidden in client components — they live in the
 * adjacent `studio/layout.tsx` instead.
 */

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
