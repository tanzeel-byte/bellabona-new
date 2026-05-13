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
      <Container className="max-w-[1440px] px-6 py-5 md:px-10">
        <dl className="reveal grid grid-cols-1 gap-[30px] lg:grid-cols-3">
          {items.map((stat, index) => (
            <div
              key={`${stat.value ?? "stat"}-${index}`}
              className="flex h-[316px] flex-col items-center justify-center rounded-[16px] bg-[#f8f7f6] px-10 py-[30px]"
            >
              <div className="flex h-[245px] w-full max-w-[340px] flex-col justify-between">
                {stat.value && (
                  <dt className="text-[72px] font-medium leading-[0.95] tracking-[-2.82px] text-[#1a211e] lg:text-[92px]">
                    {stat.value}
                  </dt>
                )}
                {stat.label && (
                  <dd className="whitespace-pre-wrap text-[20px] font-normal leading-[1.5] text-black lg:text-[24px]">
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
