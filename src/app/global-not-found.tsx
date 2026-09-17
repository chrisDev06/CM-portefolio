/* global-not-found court hors du routeur : next/link n'a pas de contexte ici,
   d'où les liens en <a>. */
/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 — C&M Agency",
  description: "Cette page n'existe pas. / This page does not exist.",
};

/** Bypasse le layout : aucune langue connue ici, la page est donc bilingue. */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="min-h-dvh antialiased">
        <section className="mx-auto flex min-h-dvh max-w-[1320px] flex-col justify-center px-4 py-24 sm:px-8">
          <p className="font-display text-6xl font-bold text-gradient">404</p>
          <p className="mt-6 max-w-md text-lg text-ink-muted">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
          <p lang="en" className="mt-1 max-w-md text-lg text-ink-muted">
            This page does not exist or has been moved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/fr"
              className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium transition-colors duration-200 ease-brand hover:bg-surface-2"
            >
              Accueil
            </a>
            <a
              href="/en"
              hrefLang="en"
              className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-ink-muted transition-colors duration-200 ease-brand hover:bg-surface-2 hover:text-ink"
            >
              Home
            </a>
          </div>
        </section>
      </body>
    </html>
  );
}
