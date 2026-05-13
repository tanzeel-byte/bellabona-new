import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import type { CtaVariant } from "@/types/sanity";

type ButtonProps = {
  href: string;
  variant?: CtaVariant;
  children: ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-green)]";

  const variants: Record<CtaVariant, string> = {
    primary:
      "bg-[var(--color-brand-accent)] text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-accent-hover)]",
    secondary:
      "border border-[var(--color-brand-green)] text-[var(--color-brand-green)] hover:bg-[var(--color-brand-green)] hover:text-white",
    ghost:
      "text-[var(--color-brand-green)] hover:text-[var(--color-brand-ink)]",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href as Route} className={classes}>
      {children}
    </Link>
  );
}
