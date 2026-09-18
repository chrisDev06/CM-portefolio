"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Amplitude du plan net en px ; le plan lointain en reçoit une fraction. */
const POINTER = { x: 16, y: 9 };
const FAR_RATIO = 0.35;
/** Fraction du défilement absorbée : plus elle est grande, plus le plan paraît loin. */
const SCROLL = { near: 0.14, far: 0.28 };
/** Inertie de la caméra, en secondes : lourde, jamais nerveuse. */
const TAU = 1.1;

/**
 * Caméra du hero : parallaxe au curseur et au défilement, appliquée sur deux
 * plans à des vitesses différentes pour créer la profondeur. Transform
 * uniquement, une seule boucle rAF qui s'arrête dès que la caméra est posée.
 */
export function HeroCamera({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const host = root?.closest<HTMLElement>("[data-hero]");
    const near = root?.querySelector<HTMLElement>('[data-plane="near"]');
    const far = root?.querySelector<HTMLElement>('[data-plane="far"]');
    const img = root?.querySelector<HTMLImageElement>("img[data-hero-img]");
    if (!root || !host || !near || !far || !img) return;

    // Révélation après décodage : le script inline s'en charge au premier
    // chargement, ceci couvre les navigations côté client.
    if (host.dataset.state !== "ready") {
      const reveal = () => (host.dataset.state = "ready");
      if (img.complete && img.naturalWidth) img.decode().then(reveal, reveal);
      else
        img.addEventListener("load", () => img.decode().then(reveal, reveal), {
          once: true,
        });
    }

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const finePointer = matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    let target = { x: 0, y: 0 };
    let cam = { x: 0, y: 0 };
    let scroll = 0;
    let heroHeight = host.offsetHeight;
    let visible = true;
    let frame = 0;
    let last = 0;

    const render = () => {
      const nx = cam.x * POINTER.x;
      const ny = cam.y * POINTER.y;
      near.style.transform = `translate3d(${nx}px, ${ny + scroll * SCROLL.near}px, 0)`;
      far.style.transform = `translate3d(${nx * FAR_RATIO}px, ${ny * FAR_RATIO + scroll * SCROLL.far}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      // Lissage exponentiel indépendant de la fréquence d'affichage.
      const k = 1 - Math.exp(-dt / TAU);
      cam = {
        x: cam.x + (target.x - cam.x) * k,
        y: cam.y + (target.y - cam.y) * k,
      };
      render();

      const settled =
        Math.abs(target.x - cam.x) < 0.0004 &&
        Math.abs(target.y - cam.y) < 0.0004;
      if (settled) {
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // La scène glisse à l'opposé du curseur, comme vue par une fenêtre.
      target = {
        x: -((event.clientX / innerWidth) * 2 - 1),
        y: -((event.clientY / innerHeight) * 2 - 1),
      };
      wake();
    };
    const onPointerLeave = () => {
      target = { x: 0, y: 0 };
      wake();
    };
    const onScroll = () => {
      scroll = Math.min(Math.max(scrollY, 0), heroHeight);
      if (!frame) requestAnimationFrame(render);
    };
    const onResize = () => {
      heroHeight = host.offsetHeight;
      onScroll();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    observer.observe(host);

    if (finePointer) {
      addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
