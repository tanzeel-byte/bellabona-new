import Link from "next/link";

import { DEFAULT_LOCALE } from "@/lib/i18n";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-start gap-4 px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-brand-green)]">
        404
      </p>
      <h1 className="text-4xl font-bold text-[var(--color-ink)]">
        Page not found
      </h1>
      <p className="text-[var(--color-ink-muted)]">
        The page you were looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href={`/${DEFAULT_LOCALE}`}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--color-brand-accent)] px-5 py-3 text-sm font-medium text-[var(--color-brand-ink)] transition-colors hover:bg-[var(--color-brand-accent-hover)]"
      >
        Back to home
      </Link>
    </section>
  );
}
