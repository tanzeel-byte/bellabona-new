import { SanityImage as Image } from "@/components/ui/SanityImage";

import { ContactLeadForm } from "@/components/sections/ContactLeadForm";
import { Container } from "@/components/ui/Container";
import { FIGMA_IMAGES } from "@/lib/figma/assets";
import { sanityImageUrl } from "@/lib/sanity-image";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["contactSection"]>;
  locale: Locale;
};

const FORM_COPY = {
  en: {
    nameLabel: "Name*",
    namePlaceholder: "Your Name",
    companyLabel: "Company Name",
    companyPlaceholder: "Company Name",
    emailLabel: "Email*",
    emailPlaceholder: "Email",
    phoneLabel: "Phone Number*",
    phonePlaceholder: "Your Phone Number",
    companySizeLabel: "Company Size*",
    companySizePlaceholder: "Please select",
    commentsLabel: "Additional Comments",
    commentsPlaceholder: "Your Comments",
  },
  de: {
    nameLabel: "Name*",
    namePlaceholder: "Ihr Name",
    companyLabel: "Firmenname",
    companyPlaceholder: "Firmenname",
    emailLabel: "E-Mail*",
    emailPlaceholder: "E-Mail",
    phoneLabel: "Telefonnummer*",
    phonePlaceholder: "Ihre Telefonnummer",
    companySizeLabel: "Unternehmensgröße*",
    companySizePlaceholder: "Bitte auswählen",
    commentsLabel: "Zusätzliche Anmerkungen",
    commentsPlaceholder: "Ihre Anmerkungen",
  },
} as const;

export function ContactSection({ section, locale }: Props) {
  const headline = pickLocale(section.headline, locale);
  const body = pickLocale(section.body, locale);
  const contactName = pickLocale(section.contactName, locale);
  const contactEmail = pickLocale(section.contactEmail, locale);
  const contactPhone = pickLocale(section.contactPhone, locale);
  const formHeading = pickLocale(section.formHeading, locale);
  const consentText = pickLocale(section.consentText, locale);
  const submitLabel = pickLocale(section.submitLabel, locale);
  const formCopy = FORM_COPY[locale];
  const portraitSrc =
    sanityImageUrl(section.portraitImage, 900) ?? FIGMA_IMAGES.contactPortrait;
  const portraitAlt =
    pickLocale(section.portraitImage?.alt, locale) ?? "";
  const isGerman = locale === "de";
  const contentGapClassName = isGerman
    ? "gap-16 py-12 sm:gap-20 sm:py-14 lg:gap-20 lg:py-0"
    : "gap-16 py-12 sm:gap-24 sm:py-14 lg:gap-32 lg:py-0";
  const headingClassName = isGerman
    ? "reveal w-full text-2xl font-bold leading-[1.2] text-[#f9ffe9] sm:text-[46px] lg:text-[52px]"
    : "reveal w-full text-2xl font-bold leading-[1.2] text-[#f9ffe9] sm:text-[52px] lg:text-[60px]";

  if (!headline && !body && !formHeading) return null;

  return (
    <section aria-labelledby="contact-heading" className="bg-white py-5 md:py-10 lg:py-20">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10">
        <div className="flex flex-col items-start gap-20 lg:flex-row">
          <div className="relative min-h-[648px] w-full max-w-[635px] shrink-0 overflow-hidden rounded-2xl bg-[#024930] lg:h-[648px] lg:overflow-clip">
            <div className={`relative left-1/2 flex w-[534px] max-w-[calc(100%-48px)] -translate-x-1/2 translate-y-0 flex-col items-start lg:absolute lg:top-1/2 lg:-translate-y-1/2 ${contentGapClassName}`}>
              <div className="flex w-full flex-col gap-[10.774px]">
                {headline && (
                  <h2
                    id="contact-heading"
                    className={headingClassName}
                  >
                    {headline}
                  </h2>
                )}
                {body && (
                  <p className="reveal w-full text-xl lg:text-2xl leading-[1.4] tracking-[0.288px] text-[#f9ffe9]">
                    {body}
                  </p>
                )}
              </div>

              {(contactName || contactEmail || contactPhone) && (
                <div className="reveal flex w-full max-w-[512px] flex-col items-start gap-6 sm:h-[205px] sm:flex-row sm:items-end sm:gap-[25px]">
                  <div className="relative h-[200px] w-full max-w-[230px] shrink-0 overflow-clip rounded-[18.831px] bg-[#f9ffe9] sm:h-[205px] sm:w-[230px]">
                    <div className="absolute left-[-5.17px] top-[-22.36px] h-[345px] w-[240px]">
                      <Image
                        alt={portraitAlt}
                        src={portraitSrc}
                        width={1024}
                        height={1024}
                        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 w-full flex-col items-start text-[#f9ffe9]">
                    {contactName && (
                      <p className="w-full break-words text-[24.455px] font-semibold leading-tight">
                        {contactName}
                      </p>
                    )}
                    {(contactEmail || contactPhone) && (
                      <div className="mt-[10.567px] w-full text-[21.738px] font-normal leading-[1.4]">
                        {contactEmail && <p className="break-words">{contactEmail}</p>}
                        {contactPhone && (
                          <p className="break-words">{contactPhone}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-[648px] w-full flex-1 flex-col items-start justify-between gap-10">
            {formHeading && (
              <h3 className="reveal text-[32px] font-bold leading-10 text-[#024930]">{formHeading}</h3>
            )}

            <ContactLeadForm
              locale={locale}
              formCopy={formCopy}
              consentText={consentText}
              submitLabel={submitLabel}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
