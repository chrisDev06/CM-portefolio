import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.pages.legal.title,
    description: dict.pages.legal.lead,
    urls: { fr: path("legal", "fr"), en: path("legal", "en") },
  });
}

export default async function Page() {
  const dict = await getDictionary(await getLocale());
  const page = dict.pages.legal;
  return (
    <LegalPage title={page.title} lead={page.lead} sections={page.sections} />
  );
}
