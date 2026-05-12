import { SITE_NAME, SITE_URL } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/types/sanity";

type Props = { settings: SiteSettings | null };

/**
 * Organization JSON-LD structured data. Renders a non-visible <script> tag
 * directly into the document — search engines pick this up to drive brand
 * SERPs and Knowledge Panels.
 *
 * Server Component on purpose: data is fetched server-side and injected
 * into the HTML for first paint, so crawlers see it without executing JS.
 */
export function OrganizationJsonLd({ settings }: Props) {
  const org = settings?.organization;
  const legalName = org?.legalName ?? SITE_NAME;
  const url = org?.url ?? SITE_URL;
  const logoUrl = org?.logo?.asset
    ? urlFor(org.logo).width(512).url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: legalName,
    url,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(org?.sameAs && org.sameAs.length > 0 ? { sameAs: org.sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here — no user-controlled HTML is
      // inserted, only structured data we control via the schema.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
