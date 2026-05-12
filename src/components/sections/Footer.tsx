import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/Container";
import { PLATFORM_LABELS, SocialIcon } from "@/components/ui/SocialIcon";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/types/sanity";

type Props = {
  settings: SiteSettings | null;
  locale: Locale;
};

// Captured at build time so Cache Components doesn't trip on `new Date()`
// at render time.
const BUILD_YEAR = new Date().getFullYear();

/**
 * Site footer — matches the Figma "Footer" frame: deep brand-forest surface
 * (#024930), Follow-Us block on the left with email + social icon row, three
 * stacked or grid-aligned link columns, then an oversized BELLABONA wordmark
 * in the lime accent that bleeds the brand into the bottom edge of the page.
 *
 * All content is Sanity-driven via siteSettings.footer. If a block is empty
 * in the CMS it simply doesn't render — editors stay in control without us
 * leaving placeholder ghosts in the DOM.
 */
export function Footer({ settings, locale }: Props) {
  const footer = settings?.footer;
  const tagline = pickLocale(footer?.tagline, locale);
  const followUs = footer?.followUs;
  const followHeading = pickLocale(followUs?.heading, locale);
  const followBody = pickLocale(followUs?.body, locale);

  const copyright =
    pickLocale(footer?.copyright, locale) ??
    `Bella&Bona Copyright © ${BUILD_YEAR}. Made with care.`;

  const hasFollowUs =
    !!followHeading ||
    !!followBody ||
    !!followUs?.contactEmail ||
    (followUs?.socialLinks?.length ?? 0) > 0;

  return (
    <footer className="bg-[var(--color-brand-forest)] text-white">
      <Container className="pt-16 pb-10 lg:pt-24 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Follow Us block — spans the left half of the footer at desktop. */}
          {hasFollowUs ? (
            <div className="lg:col-span-5">
              {followHeading && (
                <h2 className="text-2xl font-bold leading-tight">
                  {followHeading}
                </h2>
              )}
              {followBody && (
                <p className="mt-2 max-w-sm text-base leading-relaxed text-white/85">
                  {followBody}
                </p>
              )}

              {followUs?.contactEmail && (
                <a
                  href={`mailto:${followUs.contactEmail}`}
                  className="mt-8 inline-flex items-center gap-3 text-base text-white/90 transition-colors hover:text-[var(--color-brand-accent)]"
                >
                  <MailIcon className="h-5 w-5" aria-hidden="true" />
                  {followUs.contactEmail}
                </a>
              )}

              {followUs?.socialLinks && followUs.socialLinks.length > 0 && (
                <ul className="mt-6 flex flex-wrap items-center gap-5">
                  {followUs.socialLinks.map((social) => (
                    <li key={`${social.platform}-${social.url}`}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={PLATFORM_LABELS[social.platform]}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:text-[var(--color-brand-accent)]"
                      >
                        <SocialIcon platform={social.platform} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            tagline && (
              <div className="lg:col-span-5">
                <p className="max-w-sm text-base leading-relaxed text-white/85">
                  {tagline}
                </p>
              </div>
            )
          )}

          {/* Link columns — wrap on mobile, sit in a 3-col grid on desktop. */}
          {footer?.columns && footer.columns.length > 0 && (
            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3 lg:gap-8">
              {footer.columns.map((column, idx) => {
                const heading = pickLocale(column.heading, locale);
                return (
                  <div key={`${heading}-${idx}`}>
                    {heading && (
                      <h3 className="text-lg font-bold leading-tight">
                        {heading}
                      </h3>
                    )}
                    <ul className="mt-5 space-y-3">
                      {(column.links ?? []).map((link, i) => {
                        const label = pickLocale(link.label, locale);
                        if (!label || !link.href) return null;
                        return (
                          <li key={`${link.href}-${i}`}>
                            <Link
                              href={link.href as Route}
                              className="text-base text-white/85 transition-colors hover:text-[var(--color-brand-accent)]"
                            >
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Oversized wordmark — bleeds the brand into the bottom edge. */}
        <div
          aria-hidden="true"
          className="mt-16 select-none overflow-hidden font-bold leading-none tracking-tight text-[var(--color-brand-accent)] text-[20vw] md:mt-24 md:text-[16vw]"
        >
          BELLA&amp;BONA
        </div>

        {/* Separator + copyright + legal links */}
        <div className="mt-10 border-t border-white/15 pt-6">
          <div className="flex flex-col items-start justify-between gap-4 text-sm text-white/70 md:flex-row md:items-center">
            <p>{copyright}</p>
            {footer?.legalLinks && footer.legalLinks.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {footer.legalLinks.map((link, i) => {
                  const label = pickLocale(link.label, locale);
                  if (!label || !link.href) return null;
                  return (
                    <li key={`${link.href}-${i}`}>
                      <Link
                        href={link.href as Route}
                        className="transition-colors hover:text-[var(--color-brand-accent)]"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
