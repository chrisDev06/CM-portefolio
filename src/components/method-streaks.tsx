import type { CSSProperties } from "react";
import styles from "./method.module.css";

/* Traînées néon de la section « Notre méthode » (accueil).
   Les tracés sont relevés sur la maquette (1401 × 789) : chaque viewBox est
   exprimé dans ses coordonnées, et method.module.css ancre le SVG de gauche
   au bord gauche de la frise, celui de droite à son bord droit. Au-delà des
   bords de la maquette, les traits se prolongent et s'éteignent : sur un
   écran plus large, ils sortent toujours du cadre. */

/** Arrêt de dégradé : couleur (variable du module) et opacité. */
function Stop({
  at,
  color,
  opacity = 1,
}: {
  at: number;
  color: string;
  opacity?: number;
}) {
  return (
    <stop
      offset={at}
      style={{ stopColor: `var(${color})`, stopOpacity: opacity } as CSSProperties}
    />
  );
}

/** Lueur néon : deux flous de la forme elle-même, sous la forme nette. */
function Glow({ id, box }: { id: string; box: [number, number, number, number] }) {
  const [x, y, width, height] = box;
  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      x={x}
      y={y}
      width={width}
      height={height}
      colorInterpolationFilters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="near" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="far" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="bloom" />
      <feMerge>
        <feMergeNode in="bloom" />
        <feMergeNode in="far" />
        <feMergeNode in="far" />
        <feMergeNode in="near" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/** Point lumineux : un halo en dégradé, un cœur clair. */
function Spark({
  x,
  y,
  halo,
  core = 3,
  gradient,
}: {
  x: number;
  y: number;
  halo: number;
  core?: number;
  gradient: string;
}) {
  return (
    <>
      <circle cx={x} cy={y} r={halo} fill={`url(#${gradient})`} />
      <circle cx={x} cy={y} r={core} className={styles.sparkCore} />
    </>
  );
}

/** Halo radial d'un point lumineux, de sa teinte vers la transparence. */
function Halo({ id, color }: { id: string; color: string }) {
  return (
    <radialGradient id={id}>
      <Stop at={0} color="--m-white" />
      <Stop at={0.18} color={color} opacity={0.9} />
      <Stop at={0.5} color={color} opacity={0.28} />
      <Stop at={1} color={color} opacity={0} />
    </radialGradient>
  );
}

export function MethodStreaks() {
  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        className={`${styles.streaks} ${styles.streaksLeft}`}
        viewBox="-420 100 1100 720"
      >
        <defs>
          <Glow id="method-glow-l" box={[-420, 100, 1100, 720]} />
          <Halo id="method-halo-pink" color="--m-pink" />
          {/* Traînée qui entre par le bord et rejoint la pastille 01. */}
          <linearGradient
            id="method-l1"
            gradientUnits="userSpaceOnUse"
            x1="-320"
            y1="160"
            x2="186"
            y2="453"
          >
            <Stop at={0} color="--m-pink" opacity={0} />
            <Stop at={0.45} color="--m-pink" opacity={0.75} />
            <Stop at={0.63} color="--m-pink" />
            <Stop at={0.9} color="--m-pink-light" />
          </linearGradient>
          {/* Orbite fine, derrière la carte 01. */}
          <linearGradient
            id="method-l2"
            gradientUnits="userSpaceOnUse"
            x1="20"
            y1="425"
            x2="215"
            y2="725"
          >
            <Stop at={0} color="--m-pink" opacity={0.55} />
            <Stop at={0.6} color="--m-pink" opacity={0.4} />
            <Stop at={1} color="--m-pink" opacity={0} />
          </linearGradient>
          {/* Arc du sol, sous le coin de la carte 01. */}
          <linearGradient
            id="method-l3"
            gradientUnits="userSpaceOnUse"
            x1="-200"
            y1="0"
            x2="360"
            y2="0"
          >
            <Stop at={0} color="--m-pink" opacity={0} />
            <Stop at={0.3} color="--m-pink" opacity={0.9} />
            <Stop at={0.44} color="--m-pink-light" />
            <Stop at={0.5} color="--m-white" opacity={0.9} />
            <Stop at={0.75} color="--m-pink" opacity={0.55} />
            <Stop at={1} color="--m-pink" opacity={0} />
          </linearGradient>
          <linearGradient
            id="method-d1"
            gradientUnits="userSpaceOnUse"
            x1="389"
            y1="0"
            x2="640"
            y2="0"
          >
            <Stop at={0} color="--m-lavender" opacity={0.75} />
            <Stop at={0.6} color="--m-lavender" opacity={0.45} />
            <Stop at={1} color="--m-lavender" opacity={0} />
          </linearGradient>
        </defs>

        <path
          d="M300 440A195 150 0 1 0 215 725"
          stroke="url(#method-l2)"
          strokeWidth="1"
        />
        <path
          d="M389 453C420 443 470 436 525 434C560 433 600 432 640 433"
          stroke="url(#method-d1)"
          className={`${styles.dotted} ${styles.nodeOrbit}`}
        />
        <g filter="url(#method-glow-l)">
          <path d="M-320 160L186 453" stroke="url(#method-l1)" strokeWidth="2.4" />
          <path
            d="M-200 600C-50 675 220 786 360 800"
            stroke="url(#method-l3)"
            strokeWidth="3.4"
          />
        </g>
        <Spark x={23} y={549} halo={13} gradient="method-halo-pink" />
      </svg>

      <svg
        aria-hidden="true"
        focusable="false"
        className={`${styles.streaks} ${styles.streaksRight}`}
        viewBox="760 -20 1140 820"
      >
        <defs>
          <Glow id="method-glow-r" box={[760, -20, 1140, 820]} />
          <Halo id="method-halo-violet" color="--m-violet" />
          <Halo id="method-halo-magenta" color="--m-magenta" />
          {/* Grand arc principal : du point lumineux au bord droit. */}
          <linearGradient
            id="method-r1"
            gradientUnits="userSpaceOnUse"
            x1="1083"
            y1="252"
            x2="1510"
            y2="620"
          >
            <Stop at={0} color="--m-violet-light" />
            <Stop at={0.4} color="--m-lavender" />
            <Stop at={0.72} color="--m-blue-light" />
            <Stop at={1} color="--m-blue" opacity={0} />
          </linearGradient>
          {/* Ses prolongements vers la gauche : un fil, des pointillés. */}
          <linearGradient
            id="method-r1-left"
            gradientUnits="userSpaceOnUse"
            x1="1083"
            y1="0"
            x2="800"
            y2="0"
          >
            <Stop at={0} color="--m-lavender" opacity={0.7} />
            <Stop at={1} color="--m-lavender" opacity={0} />
          </linearGradient>
          {/* Grands arcs qui tombent du haut, par l'éclat. */}
          <linearGradient
            id="method-r2"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="-15"
            x2="0"
            y2="360"
          >
            <Stop at={0} color="--m-violet" opacity={0.2} />
            <Stop at={0.25} color="--m-magenta-light" />
            <Stop at={0.6} color="--m-violet-light" opacity={0.85} />
            <Stop at={1} color="--m-magenta-light" opacity={0.7} />
          </linearGradient>
          <linearGradient
            id="method-r3"
            gradientUnits="userSpaceOnUse"
            x1="1040"
            y1="0"
            x2="1500"
            y2="0"
          >
            <Stop at={0} color="--m-violet" opacity={0} />
            <Stop at={0.35} color="--m-violet-light" opacity={0.55} />
            <Stop at={0.6} color="--m-magenta-light" />
            <Stop at={1} color="--m-violet" opacity={0} />
          </linearGradient>
          <linearGradient
            id="method-r4"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="-15"
            x2="0"
            y2="345"
          >
            <Stop at={0} color="--m-violet-light" opacity={0.1} />
            <Stop at={0.45} color="--m-violet-light" opacity={0.35} />
            <Stop at={1} color="--m-violet-light" opacity={0} />
          </linearGradient>
          {/* Orbite en pointillés autour de la carte 04. */}
          <linearGradient
            id="method-d3"
            gradientUnits="userSpaceOnUse"
            x1="880"
            y1="0"
            x2="1395"
            y2="0"
          >
            <Stop at={0} color="--m-lavender" opacity={0} />
            <Stop at={0.2} color="--m-lavender" opacity={0.7} />
            <Stop at={1} color="--m-blue-light" opacity={0.6} />
          </linearGradient>
          {/* Reflet au sol, sous le coin de la carte 04. */}
          <linearGradient
            id="method-r5"
            gradientUnits="userSpaceOnUse"
            x1="1180"
            y1="0"
            x2="1500"
            y2="0"
          >
            <Stop at={0} color="--m-blue" opacity={0} />
            <Stop at={0.5} color="--m-blue-light" />
            <Stop at={1} color="--m-blue" opacity={0} />
          </linearGradient>
        </defs>

        <path
          d="M1190 -15A85 230 0 0 1 1260 345"
          stroke="url(#method-r4)"
          strokeWidth="1"
        />
        <path
          d="M1083 252C1000 237 900 210 800 182"
          stroke="url(#method-r1-left)"
          strokeWidth="1"
        />
        <path
          d="M1083 252C1060 225 1020 185 945 160C905 150 865 146 820 146"
          stroke="url(#method-r1-left)"
          className={styles.dotted}
        />
        <path
          d="M880 423C940 426 985 438 1009 456"
          stroke="url(#method-d3)"
          className={`${styles.dotted} ${styles.nodeOrbit}`}
        />
        <path
          d="M1049 455C1090 437 1130 428 1180 427C1260 426 1330 440 1365 478C1395 510 1392 600 1370 690"
          stroke="url(#method-d3)"
          className={`${styles.dotted} ${styles.nodeOrbit}`}
        />
        <g filter="url(#method-glow-r)">
          <path
            d="M1040 -5C1150 10 1260 40 1313 84C1350 115 1390 140 1500 235"
            stroke="url(#method-r3)"
            strokeWidth="1.6"
          />
          <path
            d="M1190 -15A155 230 0 0 1 1310 360"
            stroke="url(#method-r2)"
            strokeWidth="2.6"
          />
          <path
            d="M1083 252C1190 272 1325 322 1401 427C1440 480 1480 545 1510 620"
            stroke="url(#method-r1)"
            strokeWidth="2.6"
          />
          <path
            d="M1180 772C1260 757 1330 745 1500 700"
            stroke="url(#method-r5)"
            strokeWidth="2.2"
          />
        </g>
        <Spark x={1318} y={328} halo={26} core={2} gradient="method-halo-magenta" />
        <Spark x={1083} y={252} halo={18} core={3.5} gradient="method-halo-violet" />
        <Spark x={1313} y={84} halo={46} core={5.5} gradient="method-halo-magenta" />
      </svg>
    </>
  );
}
