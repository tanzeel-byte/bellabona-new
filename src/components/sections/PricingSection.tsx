"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { CtaPopupButton } from "@/components/ui/CtaPopup";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage, PricingResultCard } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["pricingSection"]>;
  locale: Locale;
};

const DEFAULT_CALCULATOR = {
  defaultDays: 3,
  employeesMin: 20,
  employeesMax: 250,
  defaultEmployees: 50,
  subsidyMin: 3,
  subsidyMax: 10,
  defaultSubsidy: 4.4,
  mealPriceMin: 7.9,
  mealPriceMax: 9.9,
  participationRate: 0.85,
  weeksPerMonth: 4.33,
} as const;

function thumbPercent(min: number, max: number, value: number): number {
  if (max <= min) return 0;
  const t = (value - min) / (max - min);
  return Math.min(100, Math.max(0, t * 100));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cleanNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function pricingConfig(section: NonNullable<Homepage["pricingSection"]>) {
  const employeesMin = cleanNumber(section.employeesMin, DEFAULT_CALCULATOR.employeesMin);
  const employeesMax = Math.max(
    employeesMin,
    cleanNumber(section.employeesMax, DEFAULT_CALCULATOR.employeesMax),
  );
  const subsidyMin = cleanNumber(section.subsidyMin, DEFAULT_CALCULATOR.subsidyMin);
  const subsidyMax = Math.max(
    subsidyMin,
    cleanNumber(section.subsidyMax, DEFAULT_CALCULATOR.subsidyMax),
  );

  return {
    defaultDays: clamp(
      Math.round(cleanNumber(section.defaultDays, DEFAULT_CALCULATOR.defaultDays)),
      1,
      5,
    ),
    employeesMin,
    employeesMax,
    defaultEmployees: clamp(
      cleanNumber(section.defaultEmployees, DEFAULT_CALCULATOR.defaultEmployees),
      employeesMin,
      employeesMax,
    ),
    subsidyMin,
    subsidyMax,
    defaultSubsidy: clamp(
      cleanNumber(section.defaultSubsidy, DEFAULT_CALCULATOR.defaultSubsidy),
      subsidyMin,
      subsidyMax,
    ),
    mealPriceMin: cleanNumber(section.mealPriceMin, DEFAULT_CALCULATOR.mealPriceMin),
    mealPriceMax: cleanNumber(section.mealPriceMax, DEFAULT_CALCULATOR.mealPriceMax),
    participationRate: clamp(
      cleanNumber(section.participationRate, DEFAULT_CALCULATOR.participationRate),
      0,
      1,
    ),
    weeksPerMonth: DEFAULT_CALCULATOR.weeksPerMonth,
  };
}

function formatEuro(value: number, locale: Locale, fractionDigits = 2): string {
  const number = new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

  return `${number} €`;
}

const DAY_OPTIONS = [
  { value: "1", label: { en: "Day", de: "Tag" } },
  { value: "2", label: { en: "Days", de: "Tage" } },
  { value: "3", label: { en: "Days", de: "Tage" } },
  { value: "4", label: { en: "Days", de: "Tage" } },
  { value: "5", label: { en: "Days", de: "Tage" } },
] as const;

export function PricingSection({ section, locale }: Props) {
  const config = pricingConfig(section);
  const [days, setDays] = useState(config.defaultDays);
  const [employees, setEmployees] = useState(config.defaultEmployees);
  const [subsidy, setSubsidy] = useState(config.defaultSubsidy);

  const heading = pickLocale(section.heading, locale);
  const daysQuestion = pickLocale(section.daysQuestion, locale);
  const employeesQuestion = pickLocale(section.employeesQuestion, locale);
  const subsidyQuestion = pickLocale(section.subsidyQuestion, locale);
  const emailPrompt = pickLocale(section.emailPrompt, locale);
  const employeeResult = section.employeeResult;
  const companyResult = section.companyResult;
  const ctaLabel = pickLocale(section.cta?.label, locale);
  const ctaHref = section.cta?.href;
  const employeeMealMin = Math.max(0, config.mealPriceMin - subsidy);
  const employeeMealMax = Math.max(employeeMealMin, config.mealPriceMax - subsidy);
  const companyMonthlyCost =
    employees * days * config.weeksPerMonth * subsidy * config.participationRate;
  const employeeResultValue = `${formatEuro(employeeMealMin, locale)} - ${formatEuro(
    employeeMealMax,
    locale,
  )} / ${locale === "de" ? "Gericht" : "dish"}`;
  const companyResultValue = `${formatEuro(
    Math.round(companyMonthlyCost),
    locale,
    0,
  )} / ${locale === "de" ? "Monat" : "mo"}`;

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
                {DAY_OPTIONS.map((option) => (
                  <DayOption
                    key={option.value}
                    value={option.value}
                    label={pickLocale(option.label, locale) ?? option.label.en}
                    selected={days === Number(option.value)}
                    onSelect={() => setDays(Number(option.value))}
                  />
                ))}
              </div>
            </div>
          )}

          {employeesQuestion && (
            <PricingSliderRow
              question={employeesQuestion}
              min={config.employeesMin}
              max={config.employeesMax}
              step={1}
              value={employees}
              onChange={(value) => setEmployees(Math.round(value))}
              minLabel={String(config.employeesMin)}
              valueLabel={`${employees} ${locale === "de" ? "Mitarbeitende" : "Employees"}`}
              maxLabel={String(config.employeesMax)}
            />
          )}

          {subsidyQuestion && (
            <PricingSliderRow
              question={subsidyQuestion}
              min={config.subsidyMin}
              max={config.subsidyMax}
              step={0.1}
              value={subsidy}
              onChange={(value) => setSubsidy(Number(value.toFixed(1)))}
              minLabel={formatEuro(config.subsidyMin, locale, 0)}
              valueLabel={`${formatEuro(subsidy, locale)} ${
                locale === "de" ? "Zuschuss" : "Subsidy"
              }`}
              maxLabel={formatEuro(config.subsidyMax, locale, 0)}
            />
          )}

          {(employeeResult || companyResult) && (
            <div className="reveal grid w-full max-w-[1200px] grid-cols-1 gap-3.5 lg:grid-cols-2">
              {employeeResult && (
                <ResultCard
                  card={employeeResult}
                  locale={locale}
                  valueOverride={employeeResultValue}
                  variant="dark"
                />
              )}
              {companyResult && (
                <ResultCard
                  card={companyResult}
                  locale={locale}
                  valueOverride={companyResultValue}
                  variant="light"
                />
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
              <CtaPopupButton
                href={ctaHref}
                label={ctaLabel}
                className="inline-flex h-12 items-center justify-center rounded-[77.707px] bg-[#024930] px-6 text-lg font-medium tracking-[0.216px] text-white transition-colors hover:bg-[var(--color-brand-green)]"
              >
                {ctaLabel}
              </CtaPopupButton>
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
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  valueLabel,
  maxLabel,
}: {
  question: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  valueLabel: string;
  maxLabel: string;
}) {
  const thumbPct = thumbPercent(min, max, value);

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
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              aria-label={question}
              aria-valuetext={valueLabel}
              onChange={(event) => onChange(Number(event.currentTarget.value))}
              className="pricing-range absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2 cursor-pointer bg-transparent"
            />
          </div>
          <div className="col-start-3 row-start-1" aria-hidden />

          <p className="col-start-1 row-start-2  text-left md:text-xl leading-none tracking-[-0.4px] tabular-nums text-[#1b1b1b]">
            {minLabel}
          </p>
          <div className="relative col-start-2 row-start-2 z-10 w-full min-w-0 px-[96px] sm:px-[120px]">
            <p
              className="pointer-events-none text-center text-sm font-semibold leading-tight tracking-[-0.4px] text-[#1b1b1b] whitespace-nowrap sm:text-xl"
              style={{
                transform: `translateX(calc(${thumbPct}% - 50%))`,
              }}
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
  onSelect,
}: {
  value: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex min-h-[216px] min-w-[140px] flex-1 flex-col items-center justify-center rounded-[14px] px-8 py-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#024930] ${
        selected ? "bg-[#024930] text-[#f9ffe9]" : "border border-[#024930] text-[#024930]"
      }`}
    >
      <div className="flex h-[124px] flex-col items-start justify-between">
        <p className="text-[81px] font-medium leading-[0.95] tracking-[-2.43px]">{value}</p>
        <p className="text-[26px] font-semibold leading-[1.5]">{label}</p>
      </div>
    </button>
  );
}

function ResultCard({
  card,
  locale,
  valueOverride,
  variant,
}: {
  card: PricingResultCard;
  locale: Locale;
  valueOverride?: string;
  variant: "dark" | "light";
}) {
  const heading = pickLocale(card.heading, locale);
  const value = valueOverride ?? pickLocale(card.value, locale);
  const caption = pickLocale(card.caption, locale);
  const note = pickLocale(card.note, locale);

  if (!heading && !value && !caption && !note) return null;

  const isDark = variant === "dark";

  return (
    <div
      className={`min-h-[205px] rounded-[10px] p-8 sm:rounded-2xl sm:p-[30px] lg:min-h-0 ${
        isDark ? "bg-[#024930] text-[#f9ffe9]" : "bg-[#e6ffa9] text-[#024930]"
      }`}
    >
      <div className="flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-[54px] text-left sm:min-h-[144px] sm:justify-between sm:gap-0 sm:text-center">
          {heading && <p className="text-base font-semibold leading-[1.35] sm:text-2xl sm:font-normal sm:leading-[1.5]">{heading}</p>}
          {(value || caption) && (
            <div className="flex flex-col gap-3 text-left">
              {value && (
                <p className="text-[56px] font-medium leading-[0.95] tracking-[-2.82px] sm:text-[45px] sm:tracking-[-1.35px]">
                  {value}
                </p>
              )}
              {caption && <p className="text-base font-semibold leading-[1.35] sm:text-xl sm:font-normal sm:leading-[1.5]">{caption}</p>}
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
