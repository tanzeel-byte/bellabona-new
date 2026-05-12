/**
 * Separate root layout for the embedded Sanity Studio. The marketing site uses
 * a `[locale]`-prefixed root layout that injects fonts, Header, Footer, and
 * JSON-LD; Studio doesn't need any of that and ships its own Studio chrome,
 * so we give it a minimal root to keep the page weight tiny and the iframe
 * tree clean.
 *
 * Navigation between /studio and /{locale} crosses root-layout boundaries and
 * triggers a full reload — intentional. Editors going from Studio to the
 * preview site genuinely want a hard reload to flush any stale state.
 */

import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Studio · Bella&Bona",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
