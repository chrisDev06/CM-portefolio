"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Case anti-robot Cloudflare Turnstile (sans cookie publicitaire).
 * Un jeton ne sert qu'une fois : changer `resetKey` redessine le widget.
 */
export function Turnstile({
  siteKey,
  locale,
  onToken,
  resetKey,
}: {
  siteKey: string;
  locale: string;
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const api = window.turnstile;
    if (!ready || !api || !container.current) return;

    const id = api.render(container.current, {
      sitekey: siteKey,
      language: locale,
      theme: "dark",
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => {
      api.remove(id);
      onToken("");
    };
  }, [ready, siteKey, locale, onToken, resetKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setReady(true)}
      />
      <div ref={container} />
    </>
  );
}
