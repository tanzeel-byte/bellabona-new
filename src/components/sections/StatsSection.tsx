import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { HeroStat } from "@/types/sanity";

type Props = {
  stats: HeroStat[];
  locale: Locale;
};

/**
 * Stats section — Figma "Stats section" frame (1440×476 export).
 *
 * Pixel anchors from the source SVG:
 *   - Three equal cards in a row with 30px gutters inside 80px page padding
 *   - Card: 406×316, 16px radius, fill #F8F7F6
 *   - Value: #1A211E, display weight, anchored to the top of the card
 *   - Label: black body copy, anchored to the bottom of the card
 */
export function StatsSection({ stats, locale }: Props) {
  const items = stats
    .map((stat) => ({
      value: pickLocale(stat.value, locale),
      label: pickLocale(stat.label, locale),
    }))
    .filter((stat) => stat.value || stat.label);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="stats-heading" className="bg-white pb-20 md:pb-20">
      <h2 id="stats-heading" className="sr-only">
        Key results
      </h2>
      <Container>
        <dl className="reveal grid grid-cols-1 gap-[30px] md:grid-cols-3">
          {items.map((stat, index) => (
            <div
              key={`${stat.value ?? "stat"}-${index}`}
              className="flex min-h-[316px] flex-col justify-between rounded-[16px] bg-[#F8F7F6] px-9 py-10 sm:px-10"
            >
              {stat.value && (
                <dt
                  className="text-[56px] font-normal leading-[1.05] tracking-[-0.01em] text-[#1A211E] sm:text-[64px] lg:text-[68px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </dt>
              )}
              {stat.label && (
                <dd className="text-base leading-[1.5] text-black">{stat.label}</dd>
              )}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
