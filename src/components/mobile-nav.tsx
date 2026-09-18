"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./ui";

export type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  openLabel,
  closeLabel,
  ctaLabel,
  ctaHref,
}: {
  links: NavLink[];
  openLabel: string;
  closeLabel: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        className="flex size-10 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:text-ink lg:hidden"
      >
        <span aria-hidden="true" className="space-y-1.5">
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-100 flex flex-col bg-canvas lg:hidden">
          <div className="flex h-16 items-center justify-end px-4 sm:px-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="flex size-10 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:text-ink"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ×
              </span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-display text-2xl transition-colors hover:text-violet"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet to-magenta px-6 py-4 text-sm font-medium"
            >
              {ctaLabel}
              <Icon name="arrow" className="size-4" />
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
