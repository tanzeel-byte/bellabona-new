import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/Container";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage, PricingResultCard } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["pricingSection"]>;
  locale: Locale;
};

/** Static demo positions: min/max from design; thumb matches Figma at ~702px width. */
const PRICING_SLIDER = {
  employees: { min: 20, max: 130, value: 50 },
  subsidyEuro: { min: 3, max: 6, value: 4.4 },
} as const;

function thumbPercent(min: number, max: number, value: number): number {
  if (max <= min) return 0;
  const t = (value - min) / (max - min);
  return Math.min(100, Math.max(0, t * 100));
}

const DAY_OPTIONS = [
  { value: "1", label: { en: "Day", de: "Tag" } },
  { value: "2", label: { en: "Days", de: "Tage" } },
  { value: "3", label: { en: "Days", de: "Tage" } },
  { value: "4", label: { en: "Days", de: "Tage" } },
  { value: "5", label: { en: "Days", de: "Tage" } },
] as const;

export function PricingSection({ section, locale }: Props) {
  const heading = pickLocale(section.heading, locale);
  const daysQuestion = pickLocale(section.daysQuestion, locale);
  const employeesQuestion = pickLocale(section.employeesQuestion, locale);
  const subsidyQuestion = pickLocale(section.subsidyQuestion, locale);
  const emailPrompt = pickLocale(section.emailPrompt, locale);
  const employeeResult = section.employeeResult;
  const companyResult = section.companyResult;
  const ctaLabel = pickLocale(section.cta?.label, locale);
  const ctaHref = section.cta?.href;

  if (!heading && !daysQuestion && !employeesQuestion && !subsidyQuestion) return null;

  return (
    <section aria-labelledby="pricing-heading" className="bg-[#e6ffa9] py-20">
      <Container className="max-w-[1440px] px-5 md:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-16 rounded-[23px] bg-white px-5 py-[60px] md:px-10 lg:px-20">
          {heading && (
            <h2
              id="pricing-heading"
              className="reveal max-w-[1018px] text-center text-[40px] font-semibold leading-[1.2] text-black sm:text-[52px] lg:text-[60px]"
            >
              {heading}
            </h2>
          )}

          {daysQuestion && (
            <div className="reveal flex w-full max-w-[1200px] flex-col items-center gap-[30px]">
              <div className="flex w-full items-start gap-5 px-0 md:px-10 lg:px-20">
                <PricingIcon />
                <p className="text-2xl leading-none tracking-[-0.6px] text-[#1b1b1b] md:text-[30px]">
                  {daysQuestion}
                </p>
              </div>
              <div className="flex w-full max-w-[1200px] flex-wrap justify-center gap-3">
                {DAY_OPTIONS.map((option, index) => (
                  <DayOption
                    key={option.value}
                    value={option.value}
                    label={pickLocale(option.label, locale) ?? option.label.en}
                    selected={index === 2}
                  />
                ))}
              </div>
            </div>
          )}

          {employeesQuestion && (
            <PricingSliderRow
              question={employeesQuestion}
              minLabel="20"
              valueLabel={locale === "de" ? "50 Mitarbeitende" : "50 Employees"}
              maxLabel="250"
              thumbPercent={thumbPercent(
                PRICING_SLIDER.employees.min,
                PRICING_SLIDER.employees.max,
                PRICING_SLIDER.employees.value,
              )}
            />
          )}

          {subsidyQuestion && (
            <PricingSliderRow
              question={subsidyQuestion}
              minLabel="3 €"
              valueLabel={locale === "de" ? "4,40 € Zuschuss" : "4.40 € Subsidy"}
              maxLabel="10 €"
              thumbPercent={thumbPercent(
                PRICING_SLIDER.subsidyEuro.min,
                PRICING_SLIDER.subsidyEuro.max,
                PRICING_SLIDER.subsidyEuro.value,
              )}
            />
          )}

          {(employeeResult || companyResult) && (
            <div className="reveal grid w-full max-w-[1200px] grid-cols-1 gap-3.5 lg:grid-cols-2">
              {employeeResult && (
                <ResultCard card={employeeResult} locale={locale} variant="dark" />
              )}
              {companyResult && (
                <ResultCard card={companyResult} locale={locale} variant="light" />
              )}
            </div>
          )}

          {emailPrompt && (
            <div className="reveal flex w-full max-w-[1200px] flex-col gap-8 px-0 md:px-10 lg:px-20">
              <p className="text-2xl leading-none tracking-[-0.6px] text-[#1b1b1b] md:text-[30px]">
                {emailPrompt}
              </p>
              <div
                aria-hidden
                className="h-[59px] rounded-xl border border-[#bfbfbf]"
              />
            </div>
          )}

          {ctaLabel && ctaHref && (
            <div className="reveal flex h-12 w-full items-center justify-center">
              <Link
                href={ctaHref as Route}
                className="inline-flex h-12 items-center justify-center rounded-[77.707px] bg-[#024930] px-6 text-lg font-medium tracking-[0.216px] text-white transition-colors hover:bg-[var(--color-brand-green)]"
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

function PricingIcon() {
  return (
    <svg className="h-[30px] w-[30px] shrink-0" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path
        d={svgPaths.p29da7c00}
        stroke="#001F00"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PricingSliderRow({
  question,
  minLabel,
  valueLabel,
  maxLabel,
  thumbPercent: thumbPct,
}: {
  question: string;
  minLabel: string;
  valueLabel: string;
  maxLabel: string;
  thumbPercent: number;
}) {
  return (
    <div className="reveal flex w-full max-w-[1200px] flex-col gap-[30px] lg:flex-row lg:items-center lg:gap-10">
      <div className="flex w-full max-w-[469px] items-center gap-5">
        <svg className="h-[30px] w-[30px] shrink-0" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <path
            d={svgPaths.p1d4725b2}
            stroke="#001F00"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <p className="min-w-0 text-2xl leading-[1.2] tracking-[-0.6px] text-[#1b1b1b] md:text-[30px] lg:text-balance">
          {question}
        </p>
      </div>
      <div className="flex w-full min-w-0 max-w-[702px] flex-1 flex-col">
        <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-2 gap-y-[22px] sm:gap-x-4">
          <div className="col-start-1 row-start-1" aria-hidden />
          <div className="relative col-start-2 row-start-1 h-5 w-full min-w-0">
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#FEACCF]"
              aria-hidden
            />
            <div
              className="absolute top-1/2 size-[14px] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${thumbPct}%` }}
              aria-hidden
            >
              <svg className="h-full w-full" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="7" fill="#FEACCF" />
              </svg>
            </div>
          </div>
          <div className="col-start-3 row-start-1" aria-hidden />

          <p className="col-start-1 row-start-2  text-left md:text-xl leading-none tracking-[-0.4px] tabular-nums text-[#1b1b1b]">
            {minLabel}
          </p>
          <div className="relative col-start-2 row-start-2 z-10 min-h-6 w-full min-w-0 self-end">
            <p
              className="pointer-events-none absolute bottom-0 z-10 min-w-0 max-w-full -translate-x-1/2 text-center text-sm font-semibold leading-tight tracking-[-0.4px] text-[#1b1b1b] whitespace-normal sm:whitespace-nowrap sm:text-xl "
              style={{ left: `${thumbPct}%` }}
            >
              {valueLabel}
            </p>
          </div>
          <p className="col-start-3 row-start-2  text-right md:text-xl leading-none tracking-[-0.4px] tabular-nums text-[#1b1b1b]">
            {maxLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function DayOption({
  value,
  label,
  selected,
}: {
  value: string;
  label: string;
  selected: boolean;
}) {
  return (
    <div
      className={`flex min-h-[216px] min-w-[140px] flex-1 flex-col items-center justify-center rounded-[14px] px-8 py-6 ${
        selected ? "bg-[#024930] text-[#f9ffe9]" : "border border-[#024930] text-[#024930]"
      }`}
    >
      <div className="flex h-[124px] flex-col items-start justify-between">
        <p className="text-[81px] font-medium leading-[0.95] tracking-[-2.43px]">{value}</p>
        <p className="text-[26px] font-semibold leading-[1.5]">{label}</p>
      </div>
    </div>
  );
}

function ResultCard({
  card,
  locale,
  variant,
}: {
  card: PricingResultCard;
  locale: Locale;
  variant: "dark" | "light";
}) {
  const heading = pickLocale(card.heading, locale);
  const value = pickLocale(card.value, locale);
  const caption = pickLocale(card.caption, locale);
  const note = pickLocale(card.note, locale);

  if (!heading && !value && !caption && !note) return null;

  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-2xl p-[30px] ${
        isDark ? "bg-[#024930] text-[#f9ffe9]" : "bg-[#e6ffa9] text-[#024930]"
      }`}
    >
      <div className="flex flex-col gap-10">
        <div className="flex min-h-[144px] flex-col justify-between text-center">
          {heading && <p className="text-2xl leading-[1.5]">{heading}</p>}
          {(value || caption) && (
            <div className="flex flex-col gap-3 text-left">
              {value && (
                <p className="text-[45px] font-medium leading-[0.95] tracking-[-1.35px]">
                  {value}
                </p>
              )}
              {caption && <p className="text-xl leading-[1.5]">{caption}</p>}
            </div>
          )}
        </div>
        {note && (
          <div className="rounded-xl bg-white p-5 text-black">
            <div className="flex gap-[25px]">
              <div className="relative flex size-[39.5px] shrink-0 items-center justify-center rounded-full border border-[#024930] text-xl text-[#024930]">
                !
              </div>
              <p className="text-xl leading-[1.5]">{note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
