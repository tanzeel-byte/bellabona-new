import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/Container";
import { FIGMA_IMAGES } from "@/lib/figma/assets";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["stepsSection"]>;
  locale: Locale;
};

const WEEKDAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"] as const;

export function StepsSection({ section, locale }: Props) {
  const headingLine1 = pickLocale(section.headingLine1, locale);
  const headingLine2 = pickLocale(section.headingLine2, locale);
  const steps =
    section.steps
      ?.map((step) => ({
        stepLabel: pickLocale(step.stepLabel, locale),
        title: pickLocale(step.title, locale),
        description: pickLocale(step.body, locale),
      }))
      .filter((step) => step.stepLabel || step.title || step.description) ?? [];
  const ctaLabel = pickLocale(section.cta?.label, locale);
  const ctaHref = section.cta?.href;

  if (!headingLine1 && !headingLine2 && steps.length === 0) return null;

  return (
    <section aria-labelledby="steps-heading" className="bg-white py-20">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10">
        <div className="flex flex-col items-center gap-16">
          {(headingLine1 || headingLine2) && (
            <h2
              id="steps-heading"
              className="reveal max-w-[1018px] whitespace-pre-wrap text-center text-[40px] font-semibold leading-[1.2] text-black sm:text-[52px] lg:text-[60px]"
            >
              {headingLine1}
              {headingLine1 && headingLine2 ? "\n" : ""}
              {headingLine2}
            </h2>
          )}

          {steps.length > 0 && (
            <div className="reveal grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
              {steps.map((step, index) => (
                <article
                  key={`${step.title ?? "step"}-${index}`}
                  className="mx-auto flex w-full max-w-[406px] flex-col gap-8"
                >
                  <StepVisual index={index} locale={locale} />
                  {step.stepLabel && (
                    <div className="inline-flex h-9 w-fit items-center justify-center rounded-full bg-[#e6ffa9] px-6 text-sm tracking-[0.14px] text-[#1a211e]">
                      {step.stepLabel}
                    </div>
                  )}
                  {(step.title || step.description) && (
                    <div className="flex flex-col gap-2 text-black">
                      {step.title && (
                        <h3 className="text-2xl font-semibold leading-[1.4] tracking-[0.288px]">
                          {step.title}
                        </h3>
                      )}
                      {step.description && (
                        <p className="text-xl leading-[1.5]">{step.description}</p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {ctaLabel && ctaHref && (
            <div className="reveal flex h-12 w-full items-center justify-center">
              <Link
                href={ctaHref as Route}
                className="inline-flex h-[47.37px] items-center justify-center rounded-[77.707px] bg-[#024930] px-6 text-lg font-medium tracking-[0.216px] text-white transition-colors hover:bg-[var(--color-brand-green)]"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function StepVisual({ index, locale }: { index: number; locale: Locale }) {
  if (index === 0) return <StepOneVisual />;
  if (index === 1) return <StepTwoVisual locale={locale} />;
  return <StepThreeVisual />;
}

function StepOneVisual() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[16px] bg-[#f9ffe9] sm:h-[392px] md:h-[416px]">
      <div className="absolute left-1/2 top-12 -translate-x-1/2 origin-top max-md:scale-[0.9] sm:max-md:scale-95 md:left-[23px] md:top-[57px] md:translate-x-0 md:scale-100">
        <div className="relative h-[285px] w-[360px]">
        <div className="absolute left-[65px] top-0 h-[170px] w-[276px] overflow-hidden rounded-[14px] bg-white shadow-[-0.8px_-3.2px_8.6px_0px_rgba(0,0,0,0.07)]">
          <div className="absolute left-[23px] top-[11px] flex items-center gap-2.5">
            <svg className="h-5 w-5" viewBox="0 0 20.368 20.368" fill="none" aria-hidden="true">
              <path
                d={svgPaths.p39e6a700}
                stroke="#001F00"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.368"
              />
            </svg>
            <p className="text-base font-medium text-[#001f00]">Employee Satisfaction</p>
          </div>
        </div>
        <div className="absolute left-[49px] top-[45px] h-[190px] w-[309px] overflow-hidden rounded-[14px] bg-white shadow-[-0.8px_-3.2px_10.3px_0px_rgba(0,0,0,0.08)]">
          <div className="absolute left-[23px] top-[13px] flex items-center gap-2.5">
            <svg className="h-5 w-5" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <path
                d={svgPaths.p29da7c00}
                stroke="#001F00"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            <p className="text-base font-medium text-[#001f00]">Daily Meal Allowance</p>
          </div>
        </div>
        <div className="absolute left-0 top-[93px] h-[192px] w-[360px] overflow-hidden rounded-[14px] bg-white shadow-[-0.8px_-3.2px_8.7px_0px_rgba(0,0,0,0.08)]">
          <div className="absolute left-[22px] top-[14px] flex w-[315px] flex-col gap-[22px]">
            <div className="flex items-center gap-2.5">
              <svg className="h-5 w-5" viewBox="0 0 17 19" fill="none" aria-hidden="true">
                <path
                  d={svgPaths.p39082180}
                  stroke="#001F00"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.26"
                />
              </svg>
              <p className="text-base font-medium text-[#001f00]">Pick Delivery Days</p>
            </div>
            <div className="flex h-[97px] flex-col justify-between">
              <div className="h-px w-full bg-[#f0f1f3]" />
              <div className="flex items-center justify-between gap-1.5 sm:gap-3">
                {WEEKDAYS.map((day, dayIndex) => (
                  <div key={day} className="flex flex-col items-center gap-3">
                    <p className="text-center text-xs font-medium text-[#001f00]">{day}</p>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        dayIndex < 4 ? "bg-[#024930]" : "bg-[#f0f1f3]"
                      }`}
                    >
                      {dayIndex < 4 && (
                        <svg className="h-3 w-3.5" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                          <path
                            d={svgPaths.p3dbc22d8}
                            stroke="#E6FFA9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.26"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function StepTwoVisual({ locale }: { locale: Locale }) {
  const statusText =
    locale === "de" ? "Team-Lunch ist unterwegs" : "Team lunch is on the way";

  return (
    <div className="relative h-[416px] w-full overflow-hidden rounded-[16px] bg-[#f2f0ee]">
      <div className="absolute -left-2 -top-[34px] h-[451px] w-[451px]">
        <Image
          src={FIGMA_IMAGES.stepsDelivery}
          alt=""
          fill
          sizes="451px"
          className="object-cover"
        />
      </div>
      <div className="absolute left-0 top-1/2 flex h-[430px] w-[430px] -translate-y-1/2 items-center justify-center">
        <div className="relative h-full w-full rotate-180 -scale-y-100">
          <Image
            src={FIGMA_IMAGES.stepsRoute}
            alt=""
            fill
            sizes="430px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute left-1/2 top-[315px] w-[362px] -translate-x-1/2">
        <div className="relative h-[50px] overflow-hidden rounded-full border border-[#f2e6e3] bg-white">
          <div className="absolute left-[53px] top-1/2 -translate-y-1/2 text-2xl font-medium leading-[0.9] text-black">
            {statusText}
          </div>
          <div className="absolute left-[5px] top-1/2 h-[42px] w-[42px] -translate-y-1/2">
            <svg className="h-full w-full" viewBox="0 0 42 42" fill="none" aria-hidden="true">
              <circle cx="20.83" cy="20.83" r="20.83" fill="#05442E" />
              <path d={svgPaths.p1de3e280} fill="#E6FC7D" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepThreeVisual() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[16px] bg-[#fff0ed] sm:h-[392px] md:h-[416px]">
      <div className="absolute left-1/2 top-12 -translate-x-1/2 origin-top max-md:scale-[0.86] sm:max-md:scale-[0.92] md:left-[83px] md:top-[49px] md:translate-x-0 md:scale-100">
        <div className="relative h-[309px] w-[325px]">
          <div className="absolute left-[111px] top-0 h-[199px] w-[181px] rounded-[13px] bg-white shadow-[-0.76px_-3px_8px_0px_rgba(0,0,0,0.08)]" />
          <div className="absolute left-[97px] top-[19px] h-[230px] w-[209px] rounded-[15px] bg-white shadow-[-0.87px_-3.5px_9.5px_0px_rgba(0,0,0,0.08)]" />
          <div className="absolute left-[83px] top-[43px] h-[266px] w-[242px] overflow-hidden rounded-[17px] bg-white shadow-[-1px_-4px_11px_0px_rgba(0,0,0,0.08)]">
            <div className="absolute left-1/2 top-[17px] flex -translate-x-1/2 flex-col items-center gap-7">
              <p className="text-[21px] font-medium leading-8 text-[#001f00]">Order frequency</p>
              <div className="relative h-[151px] w-[151px]">
                <svg className="absolute inset-[0_0.01%_0.03%_38.07%]" viewBox="0 0 94 152" fill="none" aria-hidden="true">
                  <path clipRule="evenodd" d={svgPaths.pf46e200} fill="#000" fillRule="evenodd" />
                </svg>
                <svg className="absolute inset-[37.5%_56.93%_1.51%_0.13%]" viewBox="0 0 65 93" fill="none" aria-hidden="true">
                  <path clipRule="evenodd" d={svgPaths.p12e6ee00} fill="#78B85F" fillRule="evenodd" />
                </svg>
                <svg className="absolute inset-[6.67%_62.37%_58.08%_2.41%]" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                  <path clipRule="evenodd" d={svgPaths.p6802a00} fill="#68BD99" fillRule="evenodd" />
                </svg>
                <svg className="absolute inset-[0_50.09%_72.36%_26.2%]" viewBox="0 0 36 42" fill="none" aria-hidden="true">
                  <path clipRule="evenodd" d={svgPaths.p27937100} fill="#FDA1AB" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
