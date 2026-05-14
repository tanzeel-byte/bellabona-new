import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { HeroStat } from "@/types/sanity";

type Props = {
  stats: HeroStat[];
  locale: Locale;
};

export function StatsSection({ stats, locale }: Props) {
  const items = stats
    .map((stat) => ({
      value: pickLocale(stat.value, locale),
      label: pickLocale(stat.label, locale),
    }))
    .filter((stat) => stat.value || stat.label);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="stats-heading" className="bg-white py-10 md:px-10 lg:px-20">
      <h2 id="stats-heading" className="sr-only">
        Key results
      </h2>
      <Container className="max-w-[1440px] px-4 py-5 md:px-10">
        <dl className="reveal mx-auto grid w-full grid-cols-1 gap-3.5 sm:max-w-none sm:gap-[30px] lg:grid-cols-3">
          {items.map((stat, index) => (
            <div
              key={`${stat.value ?? "stat"}-${index}`}
              className="flex min-h-[205px] flex-col justify-center rounded-[10px] bg-[#f8f7f6] px-8 py-6 sm:min-h-[170px] sm:rounded-[16px] sm:px-10 sm:py-[30px] lg:h-[316px] lg:items-center lg:px-10"
            >
              <div className="flex w-full max-w-[340px] flex-col gap-[54px] sm:gap-8 lg:h-[245px] lg:justify-between lg:gap-0">
                {stat.value && (
                  <dt className="text-[56px] font-medium leading-[0.95] tracking-[-2.82px] text-[#1a211e] sm:text-[72px] lg:text-[92px]">
                    {stat.value}
                  </dt>
                )}
                {stat.label && (
                  <dd className="whitespace-pre-wrap text-base font-normal leading-[1.35] text-black sm:text-[20px] lg:text-[24px] lg:leading-[1.5]">
                    {stat.label}
                  </dd>
                )}
              </div>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
