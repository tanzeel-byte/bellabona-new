import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";
import type { Homepage } from "@/types/sanity";

type Props = {
  logoBar: NonNullable<Homepage["logoBar"]>;
  locale: Locale;
};

/**
 * Social proof / logo bar — Figma "Light" frame (1440×207 export).
 *
 * Pixel anchors from the source SVG:
 *   - White band with a single centred row
 *   - Heading: Figtree medium, #1B1B1B
 *   - Partner logos: #A9A9A9, ~34px tall
 *   - ~80px vertical breathing room above/below the row in the full-page slice
 */
export function LogoBar({ logoBar, locale }: Props) {
  const heading = pickLocale(logoBar.heading, locale);
  const logos = logoBar.logos?.filter((logo) => logo.asset?.url) ?? [];

  if (!heading && logos.length === 0) return null;

  return (
    <section
      aria-labelledby={heading ? "logo-bar-heading" : undefined}
      className="bg-white py-12 md:py-20"
    >
      <Container>
        <div className="reveal flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16 lg:gap-20">
          {heading && (
            <p
              id="logo-bar-heading"
              className="shrink-0 text-center text-[42px] font-medium leading-[28px] tracking-[-0.01em] text-[#1B1B1B] md:text-left"
            >
              {heading}
            </p>
          )}

          {logos.length > 0 && (
            <ul
              className="flex flex-wrap items-center justify-center gap-10 md:gap-12 lg:gap-16"
              aria-label={heading ?? "Partner logos"}
            >
              {logos.map((logo, index) => {
                const alt = pickLocale(logo.alt, locale) ?? "";
                const src = urlFor(logo).height(68).url();
                const width = logo.asset.metadata?.dimensions?.width ?? 160;
                const height = logo.asset.metadata?.dimensions?.height ?? 34;

                return (
                  <li key={`${logo.asset._id}-${index}`}>
                    <Image
                      src={src}
                      alt={alt}
                      width={width}
                      height={height}
                      sizes="(min-width: 768px) 160px, 120px"
                      className="h-[34px] w-auto max-w-[186px] object-contain object-center"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
