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
    title: dict.pages.privacy.title,
    description: dict.pages.privacy.lead,
    urls: { fr: path("privacy", "fr"), en: path("privacy", "en") },
  });
}

export default async function Page() {
  const dict = await getDictionary(await getLocale());
  const page = dict.pages.privacy;
  return (
    <LegalPage title={page.title} lead={page.lead} sections={page.sections} />
  );
}
