import { Archivo_Black, Figtree } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { HTML_LANG, LOCALES, isLocale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/fetch";

import "../globals.css";

/**
 * Roc Grotesk is the brand display face but is paid (LineTo). Figtree is the
 * closest free Google Font and is used as the placeholder until the licensed
 * Roc Grotesk file is added to /public/fonts and swapped in via next/font/local.
 * See README → "Known trade-offs".
 */
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
});

/**
 * Archivo Black is the closest free Google Font match to the brand's
 * Roc Grotesk wordmark. Used only for the BELLABONA logo + hero headline
 * for now. Swap to a self-hosted Roc Grotesk via next/font/local when
 * licensed.
 */
const archivo = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["400"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#085136",
};

/**
 * Layout-level metadata. The homepage's `generateMetadata` extends this with
 * Sanity-driven title, description, OG, and canonical. Anything that's truly
 * site-wide (manifest, fallback OG, theme color) lives here.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Lunch programs for modern teams`,
    template: `%s · ${SITE_NAME}`,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Pre-render every supported locale at build time. With Cache Components
 * enabled, each locale becomes a static prerendered shell that the Sanity
 * fetch helpers populate from the cache.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Site settings drive the header, footer, and Organization JSON-LD. One
  // server fetch, deduped by React; the cached function returns a cached
  // value so this is effectively free after the first request.
  const settings = await getSiteSettings();

  return (
    <html lang={HTML_LANG[locale]} className={`${figtree.variable} ${archivo.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Organization structured data — green flag from the brief. */}
        <OrganizationJsonLd settings={settings} />

        <Header settings={settings} locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} locale={locale} />
      </body>
    </html>
  );
}
