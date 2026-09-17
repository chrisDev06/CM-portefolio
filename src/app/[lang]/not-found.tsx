import Link from "next/link";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import { path } from "@/i18n/config";

export default async function NotFound() {
  const locale = await resolveLocale();
  const dict = await getDictionary(locale);

  return (
    <section className="mx-auto flex max-w-[1320px] flex-col items-start px-4 py-32 sm:px-8">
      <p className="font-display text-6xl font-bold text-gradient">404</p>
      <p className="mt-6 max-w-md text-lg text-ink-muted">
        {locale === "fr"
          ? "Cette page n'existe pas ou a été déplacée."
          : "This page does not exist or has been moved."}
      </p>
      <Link
        href={path("home", locale)}
        className="mt-8 rounded-full border border-line-strong px-6 py-3 text-sm font-medium transition-colors duration-200 ease-brand hover:bg-surface-2"
      >
        {dict.meta.siteName}
      </Link>
    </section>
  );
}
