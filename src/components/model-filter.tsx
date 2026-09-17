"use client";

import { useState, type ReactNode } from "react";

type Item = { id: string; filter: string; card: ReactNode };

export function ModelFilter({
  items,
  labels,
}: {
  items: Item[];
  labels: Record<string, string>;
}) {
  const [active, setActive] = useState("all");
  const available = ["all", ...new Set(items.map((item) => item.filter))];
  const shown = items.filter(
    (item) => active === "all" || item.filter === active,
  );

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group">
        {available.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            aria-pressed={active === key}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ease-brand ${
              active === key
                ? "border-violet bg-violet/15 text-ink"
                : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {shown.map((item) => (
          <div key={item.id}>{item.card}</div>
        ))}
      </div>
    </>
  );
}
