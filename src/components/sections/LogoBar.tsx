import { SanityImage as Image } from "@/components/ui/SanityImage";

import { AtollsLogo, IfcoLogo } from "@/components/figma/TrustLogos";
import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";
import type { Homepage } from "@/types/sanity";

type Props = {
  logoBar: NonNullable<Homepage["logoBar"]>;
  locale: Locale;
};

export function LogoBar({ logoBar, locale }: Props) {
  const heading = pickLocale(logoBar.heading, locale);
  const logos = logoBar.logos?.filter((logo) => logo.asset?.url) ?? [];

  if (!heading && logos.length === 0) return null;

  return (
    <section
      aria-labelledby={heading ? "logo-bar-heading" : undefined}
      className="bg-white py-10 md:px-10 lg:px-20"
    >
      <Container className="max-w-[1440px] px-6 md:px-10 lg:px-20">
        <div className="reveal flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-[100px]">
          {heading && (
            <p
              id="logo-bar-heading"
              className="shrink-0 text-center text-[32px] font-normal leading-none tracking-[-0.8px] text-[#1b1b1b] sm:text-[40px] lg:text-right"
            >
              {heading}
            </p>
          )}

          <ul
            className="flex flex-wrap items-center justify-center gap-12 lg:gap-24"
            aria-label={heading ?? "Partner logos"}
          >
            {logos.length > 0
              ? logos.map((logo, index) => {
                  const alt = pickLocale(logo.alt, locale) ?? "";
                  const src = urlFor(logo).height(92).url();
                  const width = logo.asset.metadata?.dimensions?.width ?? 191;
                  const height = logo.asset.metadata?.dimensions?.height ?? 46;

                  return (
                    <li key={`${logo.asset._id}-${index}`}>
                      <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        sizes="(min-width: 1024px) 191px, 140px"
                        className="h-[34px] w-auto max-w-[191px] object-contain object-center"
                      />
                    </li>
                  );
                })
              : (
                <>
                  <li>
                    <IfcoLogo />
                  </li>
                  <li>
                    <AtollsLogo />
                  </li>
                </>
              )}
          </ul>
        </div>
      </Container>
    </section>
  );
}
