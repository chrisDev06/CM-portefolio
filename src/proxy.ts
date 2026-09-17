import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/** Choisit la meilleure langue d'après l'en-tête Accept-Language. */
function negotiate(header: string | null): Locale {
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isLocale(pathname.split("/")[1])) return;

  const locale = negotiate(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Tout sauf les internes Next, les routes API et les fichiers statiques.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

