"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";

type FormCopy = {
  nameLabel: string;
  namePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  companySizeLabel: string;
  companySizePlaceholder: string;
  commentsLabel: string;
  commentsPlaceholder: string;
};

const SUCCESS_COPY = {
  en: {
    title: "Thank you",
    body: "We received your message and will get back to you shortly.",
    dismiss: "Close",
  },
  de: {
    title: "Vielen Dank",
    body: "Wir haben Ihre Nachricht erhalten und melden uns in Kürze.",
    dismiss: "Schließen",
  },
} as const;

const fieldClassName =
  "h-10 w-full rounded-[3px] border border-[#cbd6e2] bg-[#f5f8fa] px-4 text-[15px] text-[#1a211e] placeholder:text-[#bfbfbf] focus:border-[#024930] focus:outline-none";

type Props = {
  locale: Locale;
  formCopy: FormCopy;
  consentText?: string | null;
  submitLabel?: string | null;
};

export function ContactLeadForm({ locale, formCopy, consentText, submitLabel }: Props) {
  const [successOpen, setSuccessOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const success = SUCCESS_COPY[locale];

  useEffect(() => {
    if (!successOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSuccessOpen(false);
        formRef.current?.reset();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [successOpen]);

  return (
    <>
      <form
        ref={formRef}
        className="reveal flex w-full flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (!form.reportValidity()) return;
          setSuccessOpen(true);
        }}
      >
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

      {successOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4 py-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSuccessOpen(false);
              formRef.current?.reset();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-2xl"
          >
            <h3
              id={titleId}
              className="text-2xl font-bold leading-tight text-[#024930] sm:text-[28px]"
            >
              {success.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-[#1a211e]/85">{success.body}</p>
            <button
              type="button"
              className="mt-8 h-12 w-full rounded-[43px] bg-[rgba(0,38,22,0.9)] text-base font-medium text-white transition-colors hover:bg-[#024930]"
              onClick={() => {
                setSuccessOpen(false);
                formRef.current?.reset();
              }}
            >
              {success.dismiss}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
