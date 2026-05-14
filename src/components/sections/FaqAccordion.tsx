"use client";

import { useCallback, useMemo, useState } from "react";

import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

function FaqToggleIcon({ open }: { open: boolean }) {
  return (
    <div className="relative size-6 shrink-0 rounded-xl" aria-hidden="true">
      <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-solid border-[#5f6563]" />
      <div className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-[#5f6563]" />
      {!open && (
        <div className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-[#5f6563]" />
      )}
    </div>
  );
}

type Props = {
  section: NonNullable<Homepage["faqSection"]>;
  locale: Locale;
};

export function FaqAccordion({ section, locale }: Props) {
  const items = useMemo(
    () =>
      section.items
        ?.map((item) => ({
          question: pickLocale(item.question, locale),
          answer: pickLocale(item.answer, locale),
        }))
        .filter((item) => item.question || item.answer) ?? [],
    [section.items, locale],
  );

  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set());

  const toggle = useCallback((index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  return (
    <div className="reveal mx-auto flex w-full max-w-[1200px] flex-col gap-2">
      {items.map((item, index) => {
        const isOpen = openIndices.has(index);
        const panelId = `faq-panel-${index}`;
        return (
          <div key={`${item.question ?? "faq"}-${index}`}>
            <article className="w-full">
              <div
                role="button"
                tabIndex={0}
                className="flex cursor-pointer items-start gap-12 px-10 py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#024930] focus-visible:ring-offset-2"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(index);
                  }
                }}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-5 text-2xl leading-[30px] tracking-[-0.1px]">
                  {item.question && (
                    <h3 className="font-medium text-[#1a211e]">{item.question}</h3>
                  )}
                  <div
                    id={panelId}
                    hidden={!isOpen || !item.answer}
                    className="font-normal text-[#5f6563]"
                  >
                    {item.answer && <p>{item.answer}</p>}
                  </div>
                </div>
                <FaqToggleIcon open={isOpen} />
              </div>
            </article>
            {index < items.length - 1 && (
              <div className="flex w-full items-center overflow-clip">
                <div className="h-px min-w-px flex-1 bg-[#5f6563]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
