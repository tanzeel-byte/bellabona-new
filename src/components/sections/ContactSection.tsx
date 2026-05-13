import { SanityImage as Image } from "@/components/ui/SanityImage";

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

const fieldClassName =
  "h-10 w-full rounded-[3px] border border-[#cbd6e2] bg-[#f5f8fa] px-4 text-[15px] text-[#1a211e] placeholder:text-[#bfbfbf] focus:border-[#024930] focus:outline-none";

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

  if (!headline && !body && !formHeading) return null;

  return (
    <section aria-labelledby="contact-heading" className="bg-white py-5 md:py-10 lg:py-20">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10">
        <div className="flex flex-col items-start gap-20 lg:flex-row">
          <div className="relative min-h-[648px] w-full max-w-[635px] shrink-0 overflow-x-clip rounded-2xl bg-[#024930] pb-10 pt-10 lg:h-[648px] lg:overflow-clip lg:pb-0 lg:pt-0">
            <div className="relative left-1/2 flex w-[534px] max-w-[calc(100%-48px)] -translate-x-1/2 translate-y-0 flex-col items-start gap-16 sm:gap-24 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:gap-32">
              <div className="flex w-full flex-col gap-[10.774px]">
                {headline && (
                  <h2
                    id="contact-heading"
                    className="reveal w-full text-2xl font-bold leading-[1.2] text-[#f9ffe9] sm:text-[52px] lg:text-[60px]"
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

            <form className="reveal flex w-full flex-col gap-6" action="#" method="post">
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-base font-medium leading-5 text-[#777a89]">
                      {formCopy.nameLabel}
                    </span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder={formCopy.namePlaceholder}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-base font-medium leading-5 text-[#777a89]">
                      {formCopy.companyLabel}
                    </span>
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      placeholder={formCopy.companyPlaceholder}
                      className={fieldClassName}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-base font-medium leading-5 text-[#777a89]">
                    {formCopy.emailLabel}
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={formCopy.emailPlaceholder}
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-base font-medium leading-5 text-[#777a89]">
                    {formCopy.phoneLabel}
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder={formCopy.phonePlaceholder}
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-base font-medium leading-5 text-[#777a89]">
                    {formCopy.companySizeLabel}
                  </span>
                  <select
                    name="companySize"
                    defaultValue=""
                    className={fieldClassName}
                    required
                  >
                    <option value="" disabled>
                      {formCopy.companySizePlaceholder}
                    </option>
                    <option value="1-20">1-20</option>
                    <option value="21-50">21-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-250">101-250</option>
                    <option value="250+">250+</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-base font-medium leading-5 text-[#777a89]">
                    {formCopy.commentsLabel}
                  </span>
                  <textarea
                    name="comments"
                    rows={3}
                    placeholder={formCopy.commentsPlaceholder}
                    className="min-h-[66px] w-full resize-y rounded-[3px] border border-[#cbd6e2] bg-[#f5f8fa] px-4 py-3 text-[15px] text-[#1a211e] placeholder:text-[#bfbfbf] focus:border-[#024930] focus:outline-none"
                  />
                </label>
              </div>

              {consentText && (
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 size-4 shrink-0 rounded-[2.5px] border border-[#767676] bg-white"
                  />
                  <span className="max-w-[491px] text-base leading-[18px] text-[#777a89]">
                    {consentText}
                  </span>
                </label>
              )}

              {submitLabel && (
                <button
                  type="submit"
                  className="h-12 w-full max-w-[424px] rounded-[43px] bg-[rgba(0,38,22,0.9)] text-base font-medium text-white transition-colors hover:bg-[#024930]"
                >
                  {submitLabel}
                </button>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
