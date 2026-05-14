"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import type { Locale } from "@/lib/i18n";

type PopupRequest = {
  label?: string;
  href?: string;
};

type CtaPopupContextValue = {
  open: (request: PopupRequest) => void;
};

type CtaPopupButtonProps = {
  href?: string;
  /** Visible CTA copy; also used as the dialog heading (except menu CTAs, which use the menu title). */
  label?: string;
  children: ReactNode;
  className?: string;
  onOpen?: () => void;
};

const CtaPopupContext = createContext<CtaPopupContextValue | null>(null);

const POPUP_COPY = {
  en: {
    defaultTitle: "Tell us about your lunch plans",
    menuTitle: "Download our Menu",
    firstName: "First name",
    email: "Email",
    phone: "Phone number",
    country: "Country",
    consent:
      "I agree to receiving communications from Bella&Bona as a follow-up to this request.",
    submitDefault: "Send request",
    submitMenu: "Get full menu",
    close: "Close popup",
    success: "Thanks. We'll be in touch shortly.",
  },
  de: {
    defaultTitle: "Erzählen Sie uns von Ihren Lunch-Plänen",
    menuTitle: "Menü herunterladen",
    firstName: "Vorname",
    email: "E-Mail",
    phone: "Telefonnummer",
    country: "Land",
    consent:
      "Ich stimme zu, von Bella&Bona als Rückmeldung zu dieser Anfrage kontaktiert zu werden.",
    submitDefault: "Anfrage senden",
    submitMenu: "Menü erhalten",
    close: "Popup schließen",
    success: "Danke. Wir melden uns in Kürze.",
  },
} as const;

const COUNTRY_OPTIONS = [
  { label: "Germany", dialCode: "+49" },
  { label: "Austria", dialCode: "+43" },
  { label: "Switzerland", dialCode: "+41" },
  { label: "Pakistan", dialCode: "+92" },
] as const;

export function CtaPopupProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const [request, setRequest] = useState<PopupRequest | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [countryIndex, setCountryIndex] = useState(0);
  const titleId = useId();
  const copy = POPUP_COPY[locale];

  const isMenuRequest = useMemo(() => {
    const text = `${request?.label ?? ""} ${request?.href ?? ""}`;
    return /menu|menü/i.test(text);
  }, [request]);

  const dialogTitle = useMemo(() => {
    if (!request) return "";
    if (isMenuRequest) return copy.menuTitle;
    const fromLabel = request.label?.trim();
    if (fromLabel) return fromLabel;
    return copy.defaultTitle;
  }, [request, isMenuRequest, copy.menuTitle, copy.defaultTitle]);

  useEffect(() => {
    if (!request) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRequest(null);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [request]);

  const contextValue = useMemo<CtaPopupContextValue>(
    () => ({
      open(nextRequest) {
        setSubmitted(false);
        setRequest(nextRequest);
      },
    }),
    [],
  );

  const close = () => setRequest(null);
  const selectedCountry = COUNTRY_OPTIONS[countryIndex] ?? COUNTRY_OPTIONS[0];

  return (
    <CtaPopupContext.Provider value={contextValue}>
      {children}

      {request && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[calc(100vh-48px)] w-full max-w-[690px] overflow-y-auto bg-white px-7 py-10 shadow-2xl sm:px-10"
          >
            <button
              type="button"
              aria-label={copy.close}
              onClick={close}
              className="absolute right-6 top-6 inline-flex size-10 items-center justify-center text-[#7089aa] transition-colors hover:text-[#024930]"
            >
              <span aria-hidden="true" className="text-5xl font-light leading-none">
                ×
              </span>
            </button>

            <h2
              id={titleId}
              className="pr-12 text-[34px] font-bold leading-tight text-[#024930]"
            >
              {dialogTitle}
            </h2>

            {submitted ? (
              <p className="mt-8 text-xl leading-7 text-[#024930]">{copy.success}</p>
            ) : (
              <form
                className="mt-7 flex flex-col gap-7"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <input type="hidden" name="sourceHref" value={request.href ?? ""} />
                <input type="hidden" name="sourceLabel" value={request.label ?? ""} />

                <label className="flex flex-col gap-2 text-2xl text-[#008060]">
                  <span>{copy.firstName}</span>
                  <input
                    name="firstName"
                    autoComplete="given-name"
                    className="h-[60px] rounded-[3px] border border-[#9aa0a6] bg-[#f5f8fa] px-4 text-xl text-[#1a211e] outline-none focus:border-[#024930]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-2xl text-[#008060]">
                  <span>
                    {copy.email} <span className="text-[#b00020]">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="h-[60px] rounded-[3px] border border-[#9aa0a6] bg-[#f5f8fa] px-4 text-xl text-[#1a211e] outline-none focus:border-[#024930]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-2xl text-[#008060]">
                  <span>
                    {copy.phone} <span className="text-[#b00020]">*</span>
                  </span>
                  <div className="grid grid-cols-[minmax(124px,150px)_1fr] gap-2">
                    <select
                      name="country"
                      value={countryIndex}
                      onChange={(event) => setCountryIndex(Number(event.target.value))}
                      className="h-[60px] min-w-0 rounded-[3px] border border-[#9aa0a6] bg-[#f5f8fa] px-4 text-xl text-[#1f3654] outline-none focus:border-[#024930]"
                      aria-label={copy.country}
                    >
                      {COUNTRY_OPTIONS.map((option, index) => (
                        <option key={option.dialCode} value={index}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder={selectedCountry.dialCode}
                      className="h-[60px] min-w-0 rounded-[3px] border border-[#9aa0a6] bg-[#f5f8fa] px-4 text-xl text-[#1f3654] outline-none focus:border-[#024930]"
                    />
                  </div>
                </label>

                <label className="flex items-start gap-3 text-xl leading-7 text-[#697386]">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 size-[18px] shrink-0"
                  />
                  <span>
                    {copy.consent} <span className="text-[#b00020]">*</span>
                  </span>
                </label>

                <button
                  type="submit"
                  className="h-16 w-fit min-w-[237px] rounded-[5px] bg-[#024930] px-9 text-[28px] font-bold text-white transition-colors hover:bg-[#013724]"
                >
                  {isMenuRequest ? copy.submitMenu : copy.submitDefault}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </CtaPopupContext.Provider>
  );
}

export function CtaPopupButton({
  href,
  label,
  children,
  className = "",
  onOpen,
}: CtaPopupButtonProps) {
  const popup = useContext(CtaPopupContext);

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={className}
      onClick={() => {
        if (!popup) {
          if (href) window.location.assign(href);
          return;
        }

        popup.open({ href, label });
        onOpen?.();
      }}
    >
      {children}
    </button>
  );
}
