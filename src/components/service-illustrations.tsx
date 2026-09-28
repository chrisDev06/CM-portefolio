import type { ComponentType, CSSProperties } from "react";
import type { ServiceId } from "@/i18n/config";

/*
 * Illustrations des cartes de la section Services : de petites scènes en verre,
 * inclinées face au texte (bord droit vers nous). Pur décor, sans image : nettes
 * à toutes les tailles et sans poids réseau. Matières dans globals.css (illus-).
 */

/** Plan incliné : rotation dans le plan, puis vers le texte, puis perspective. */
function tilt(rotateY: number, rotateZ = 0, rotateX = 0): CSSProperties {
  return {
    transform: `perspective(640px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
  };
}

/** Trait de texte factice. */
function Bar({ w, tone = "bg-ink/20" }: { w: string; tone?: string }) {
  return <span className={`block h-[3px] shrink-0 rounded-full ${w} ${tone}`} />;
}

/** Ligne de liste : puce + trait. */
function Row({ w, accent = false }: { w: string; accent?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className={`size-1 shrink-0 rounded-full ${accent ? "bg-violet-bright" : "bg-ink/30"}`}
      />
      <Bar w={w} tone={accent ? "bg-violet-bright/50" : "bg-ink/20"} />
    </span>
  );
}

/* --- Site vitrine : un écran de site, paysage en vedette ------------------- */

/** Photo de montagnes, stylisée : ciel de nuit, crêtes éclairées par la
    lueur de l'horizon, vallée dans l'ombre. */
function Landscape() {
  return (
    <svg
      viewBox="0 0 120 68"
      preserveAspectRatio="xMidYMid slice"
      className="block h-[58px] w-full rounded-xs"
    >
      <defs>
        <linearGradient id="illus-web-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-canvas)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--color-violet)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-magenta)" }} />
        </linearGradient>
        <radialGradient id="illus-web-glow" cx="0.72" cy="0.62" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-ink)", stopOpacity: 0.7 }} />
          <stop offset="0.3" style={{ stopColor: "var(--color-magenta)", stopOpacity: 0.5 }} />
          <stop offset="1" style={{ stopColor: "var(--color-magenta)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="illus-web-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-violet-bright)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-violet)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-surface)" }} />
        </linearGradient>
        <linearGradient id="illus-web-near" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-violet)" }} />
          <stop offset="0.45" style={{ stopColor: "var(--color-surface-2)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-canvas)" }} />
        </linearGradient>
      </defs>
      <rect width="120" height="68" fill="url(#illus-web-sky)" />
      <rect width="120" height="68" fill="url(#illus-web-glow)" />
      {[
        [12, 8],
        [30, 14],
        [52, 6],
        [100, 10],
        [112, 20],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.6" className="fill-ink/70" />
      ))}
      {/* Crêtes lointaines, puis le massif éclairé, puis la vallée. */}
      <path d="M0 46 14 36l8 5 12-11 10 9 8-6 12 10 14-14 12 12 10-6 20 10v35H0z" fill="url(#illus-web-far)" opacity="0.7" />
      <path d="M8 68 34 30l7 7 9-12 12 14 6-5 16 34z" fill="url(#illus-web-near)" />
      <path d="M34 30l-5 7 4-1 3 2 2-3 3 2zM50 25l-4 6 3-1 2 2 2-2 3 1z" className="fill-ink/80" />
      <path d="M58 68 84 38l8 6 10-9 18 15v18z" fill="url(#illus-web-near)" />
      <path d="M0 68v-8l18-6 22 10 26-8 24 9 30-7v10z" className="fill-canvas/90" />
    </svg>
  );
}

function WebsiteScene() {
  return (
    <>
      {/* Second écran, en retrait : la profondeur. */}
      <div
        className="illus-glass absolute top-[26%] left-[22%] h-[78%] w-[24%] rounded-md opacity-40"
        style={tilt(-32, -4)}
      />
      <span className="illus-streak absolute top-[24%] -right-[8%] w-[42%] -rotate-[22deg]" />
      <div
        className="illus-screen absolute top-[5%] -right-[16%] h-[112%] w-[80%] overflow-hidden rounded-md p-3"
        style={tilt(-30, -5)}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-[7px] leading-none font-bold text-ink/85">
            C<span className="text-magenta">&amp;</span>M
            <span className="ml-1 font-normal tracking-[0.2em] text-ink/45">
              AGENCY
            </span>
          </span>
          <span className="flex gap-1">
            <Bar w="w-2.5" />
            <Bar w="w-2.5" />
            <Bar w="w-2.5" />
          </span>
        </div>
        <div className="mt-2.5 grid grid-cols-[30%_1fr] gap-2">
          <div className="space-y-2 pt-0.5">
            <Row w="w-6" accent />
            <Row w="w-8" />
            <Row w="w-5" />
            <Row w="w-7" />
            <Row w="w-4" />
          </div>
          <div>
            <Landscape />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <span className="illus-glass block h-6 rounded-xs" />
              <span className="illus-glass block h-6 rounded-xs" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* --- E-commerce : deux fiches produit, le panier en néon ------------------- */

/** Panier néon : trait dégradé, du blanc rosé au violet. */
function NeonCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="illus-neon size-14">
      <defs>
        <linearGradient id="illus-shop-cart" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-ink)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-violet-bright)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-magenta)" }} />
        </linearGradient>
      </defs>
      <path
        d="M3 4h2l2.5 11h10L20 7H6M9 21.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM17 21.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM10 9.5v3.5M13.2 9.5v3.5M16.4 9.5 16 13"
        stroke="url(#illus-shop-cart)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShopScene() {
  return (
    <>
      <span className="illus-flare absolute top-[16%] -right-[18%] size-44 rounded-full" />
      <div
        className="illus-glass absolute top-[22%] right-[4%] h-[58%] w-[74%] rounded-md opacity-70"
        style={tilt(-26, 7)}
      >
        <span className="absolute top-2 left-2.5 flex items-center gap-1">
          <span className="size-1 rounded-full bg-ink/40" />
          <Bar w="w-6" />
        </span>
      </div>
      <div
        className="illus-glass absolute top-[40%] right-[15%] flex h-[50%] w-[50%] items-center justify-center rounded-md"
        style={tilt(-22, 7)}
      >
        <NeonCart />
      </div>
    </>
  );
}

/* --- Application mobile : un téléphone, iOS et Android --------------------- */

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
      <path d="M12 7.6c1.2-.9 2.6-1.3 4-1 2.5.5 3.9 2.9 3.6 6-.3 3.4-2.4 7-4.6 7.2-.9.1-1.6-.3-2.3-.5a2 2 0 00-1.4 0c-.7.2-1.4.6-2.3.5C6.8 19.6 4.7 16 4.4 12.6c-.3-3.1 1.1-5.5 3.6-6 1.4-.3 2.8.1 4 1z" />
      <path d="M12.4 6.6c.2-1.9 1.5-3.4 3.3-3.8-.1 1.9-1.4 3.5-3.3 3.8z" />
    </svg>
  );
}

function AndroidGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        d="M8.4 7.4 7 5.2M15.6 7.4 17 5.2"
        className="stroke-current"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M5.5 12a6.5 6.5 0 0113 0z" className="fill-current" />
      <path
        d="M5.5 13.2h13v5.3a1.5 1.5 0 01-1.5 1.5H7a1.5 1.5 0 01-1.5-1.5z"
        className="fill-current"
      />
      <circle cx="9.3" cy="9.6" r=".9" className="fill-canvas" />
      <circle cx="14.7" cy="9.6" r=".9" className="fill-canvas" />
    </svg>
  );
}

/** Éclats de lumière autour de l'orbite, au-dessus de la description. */
const SPARKS = [
  "top-[18%] right-[50%]",
  "top-[36%] right-[45%]",
  "top-[42%] right-[58%]",
  "top-[26%] right-[70%]",
];

function MobileScene() {
  return (
    <>
      <span className="illus-flare absolute top-[18%] right-[36%] size-24 rounded-full opacity-80" />
      {/* Orbite et planète : l'écho de la scène du hero. */}
      <svg
        viewBox="0 0 160 48"
        className="absolute top-[34%] right-[22%] w-[66%] -rotate-12"
      >
        <defs>
          <linearGradient id="illus-mobile-orbit" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--color-violet)", stopOpacity: 0 }} />
            <stop offset="0.5" style={{ stopColor: "var(--color-magenta)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-ink)" }} />
          </linearGradient>
        </defs>
        <ellipse
          cx="80"
          cy="24"
          rx="78"
          ry="20"
          fill="none"
          stroke="url(#illus-mobile-orbit)"
          strokeWidth="1.4"
        />
      </svg>
      <span
        className="absolute top-[16%] right-[62%] size-3.5 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, var(--color-ink), var(--color-violet-bright) 30%, var(--color-violet) 60%, var(--color-canvas))",
        }}
      />
      {SPARKS.map((position) => (
        <span
          key={position}
          className={`absolute size-1 rounded-full bg-ink shadow-[0_0_6px_2px_var(--color-magenta)] ${position}`}
        />
      ))}
      <div
        className="illus-phone absolute top-[4%] right-[2%] h-[118%] w-[46%] rounded-lg p-2.5"
        style={tilt(-24, 9)}
      >
        <span className="mx-auto block h-1.5 w-9 rounded-full bg-ink/20" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="illus-glass flex aspect-square items-center justify-center rounded-sm text-ink/90">
            <AppleGlyph />
          </span>
          <span className="illus-glass flex aspect-square items-center justify-center rounded-sm text-ink/90">
            <AndroidGlyph />
          </span>
        </div>
        <div className="illus-glass mt-2 space-y-1.5 rounded-sm p-2">
          <Bar w="w-3/4" tone="bg-violet-bright/50" />
          <Bar w="w-1/2" />
          <Bar w="w-2/3" />
        </div>
      </div>
    </>
  );
}

/* --- Solution sur mesure : un tableau de bord ------------------------------ */

function Donut() {
  return (
    <svg viewBox="0 0 40 40" className="size-11 shrink-0">
      <defs>
        <linearGradient id="illus-custom-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-indigo)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-violet-bright)" }} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="15" fill="none" strokeWidth="4" className="stroke-ink/10" />
      <circle
        cx="20"
        cy="20"
        r="15"
        fill="none"
        stroke="url(#illus-custom-ring)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="71.6 94.3"
        transform="rotate(-90 20 20)"
      />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        className="fill-ink font-display text-[9px] font-bold"
      >
        76%
      </text>
    </svg>
  );
}

const CHART = [40, 65, 50, 80, 60, 92, 72];

function DashboardScene() {
  return (
    <>
      <span className="illus-streak absolute top-[10%] -right-[6%] w-[38%] -rotate-[28deg]" />
      <div
        className="illus-screen absolute top-[9%] -right-[12%] h-[94%] w-[86%] rounded-md p-2.5"
        style={tilt(-28, -3)}
      >
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-violet-bright" />
          <Bar w="w-8" />
          <span className="ml-auto flex gap-1">
            <Bar w="w-3" />
            <Bar w="w-3" />
          </span>
        </div>
        <div className="mt-2 grid grid-cols-[26%_1fr] gap-2">
          <div className="space-y-2 pt-1">
            <Row w="w-5" accent />
            <Row w="w-6" />
            <Row w="w-4" />
            <Row w="w-6" />
            <Row w="w-5" />
          </div>
          <div>
            <div className="illus-glass flex items-center gap-2.5 rounded-sm p-2">
              <Donut />
              <div className="flex-1 space-y-1.5">
                <Bar w="w-full" tone="bg-violet-bright/60" />
                <Bar w="w-3/4" />
                <Bar w="w-1/2" />
              </div>
            </div>
            <div className="mt-2 flex h-9 items-end gap-1">
              {CHART.map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-xs bg-violet/45"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* --- Refonte & optimisation : des pages en pile, la courbe qui monte ------- */

function Sheet({ className }: { className: string }) {
  return (
    <div
      className={`illus-glass absolute space-y-2 rounded-sm p-2 ${className}`}
      style={tilt(-28, -5)}
    >
      <Row w="w-8" accent />
      <Row w="w-6" />
      <Row w="w-7" />
      <Row w="w-5" />
    </div>
  );
}

function RedesignScene() {
  return (
    <>
      <Sheet className="top-[16%] right-[48%] h-[64%] w-[30%] opacity-60" />
      <Sheet className="top-[26%] right-[8%] h-[52%] w-[46%]" />
      <Sheet className="top-[54%] right-[26%] h-[46%] w-[40%]" />
      <svg
        viewBox="0 0 120 80"
        className="illus-neon absolute top-[12%] right-[6%] h-[58%] w-[60%]"
      >
        <defs>
          <linearGradient
            id="illus-redesign-arrow"
            gradientUnits="userSpaceOnUse"
            x1="8"
            y1="72"
            x2="108"
            y2="13"
          >
            <stop offset="0" style={{ stopColor: "var(--color-violet)", stopOpacity: 0 }} />
            <stop offset="0.55" style={{ stopColor: "var(--color-magenta)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-ink)" }} />
          </linearGradient>
        </defs>
        <path
          d="M8 72 96 20"
          fill="none"
          stroke="url(#illus-redesign-arrow)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M108 12.9 100.6 27.7 91.4 12.3z" className="fill-ink" />
      </svg>
    </>
  );
}

/* --- Maintenance & évolution : la baie, le nuage qui se met à jour --------- */

function CloudUpload({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className}>
      <defs>
        <linearGradient id="illus-maintenance-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-violet-bright)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-violet)" }} />
        </linearGradient>
      </defs>
      <path
        d="M13 33h23a8.5 8.5 0 001.4-16.9A11.5 11.5 0 0015 12.4 10.3 10.3 0 0013 33z"
        fill="url(#illus-maintenance-cloud)"
        fillOpacity="0.55"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M24 29V17.5M19.5 22 24 17.5l4.5 4.5"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-magenta"
      />
    </svg>
  );
}

const RACK = ["w-5", "w-6", "w-4", "w-5"];

function MaintenanceScene() {
  return (
    <>
      <div
        className="absolute top-[30%] right-[37%] w-[18%] space-y-1.5 opacity-60"
        style={tilt(-26)}
      >
        {RACK.map((w, index) => (
          <div
            key={index}
            className="illus-glass flex h-6 items-center gap-1.5 rounded-xs px-1.5"
          >
            <span className="size-1 shrink-0 rounded-full bg-violet-bright" />
            <Bar w={w} />
          </div>
        ))}
      </div>
      <div
        className="illus-glass absolute top-[14%] right-[4%] h-[68%] w-[46%] rounded-md"
        style={tilt(-26, -3)}
      >
        <span className="absolute top-2 left-2.5 flex items-center gap-1">
          <span className="size-1 rounded-full bg-ink/40" />
          <Bar w="w-6" />
        </span>
        <CloudUpload className="illus-neon absolute inset-x-0 top-[26%] mx-auto w-[62%]" />
      </div>
    </>
  );
}

const SCENES: Record<ServiceId, ComponentType> = {
  "site-web": WebsiteScene,
  "e-commerce": ShopScene,
  mobile: MobileScene,
  "sur-mesure": DashboardScene,
  refonte: RedesignScene,
  maintenance: MaintenanceScene,
};

/** Scène décorative d'une carte service, calée sur son bord droit. Masquée
    sur téléphone : la carte n'y loge pas texte et scène côte à côte. */
export function ServiceIllustration({ id }: { id: ServiceId }) {
  const Scene = SCENES[id];
  return (
    <div aria-hidden="true" className="illus hidden sm:block">
      <Scene />
    </div>
  );
}
