"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react";
import styles from "./coin.module.css";

/** Facettes de la tranche : assez pour un bord rond, peu pour rester léger. */
const FACETS = 48;

/** Lumière rasante sur la tranche, venue d'en haut à gauche : angle dans le
    plan de la pièce (0° à droite, sens horaire, comme rotateZ). */
const EDGE_LIGHT = 225;

/** Chaque facette reçoit son éclairage une fois pour toutes. */
const EDGE = Array.from({ length: FACETS }, (_, index) => {
  const angle = (360 / FACETS) * index;
  const light = Math.max(0, Math.cos(((angle - EDGE_LIGHT) * Math.PI) / 180));
  return { angle, shade: Math.round(30 + 70 * light) };
});

const rad = (deg: number) => (deg * Math.PI) / 180;
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Orientation d'une face vers le spectateur, ramenée dans [-180°, 180°[. */
const facing = (angle: number) => (((angle % 360) + 540) % 360) - 180;

/** Reflet : une bande claire balaie la face quand elle passe devant la
    lumière, un peu à gauche du spectateur. */
function gloss(rel: number) {
  const r = rad(rel + 30);
  return {
    opacity: +(0.9 * Math.max(0, Math.cos(r)) ** 8).toFixed(3),
    x: +(Math.sin(r) * 70).toFixed(2),
  };
}

/** Ombre propre : la face s'assombrit à mesure qu'elle se détourne. */
const shade = (rel: number) =>
  +(0.8 * (1 - Math.max(0, Math.cos(rad(rel))))).toFixed(3);

/** Repos : face au spectateur, reflet discret sur la droite. */
const REST = gloss(0);
const REST_GLOSS: CSSProperties = {
  opacity: REST.opacity,
  transform: `translateX(${REST.x}%)`,
};

/** Un lancer : angle et élévation de départ, tours à faire, durée (ms). */
type Motion = { from: number; lift0: number; total: number; duration: number };

/** Un tour et demi au moins, et toujours retomber sur le recto. */
function motion(from: number, lift0: number): Motion {
  const total = Math.ceil((from + 600) / 360) * 360 - from;
  return { from, lift0, total, duration: 1200 + total * 1.35 };
}

/**
 * Une pièce lancée d'une pichenette : départ vif, freinage progressif, léger
 * dépassement puis retour. Elle se soulève en basculant un peu vers
 * l'arrière (on voit sa tranche), et se repose en oscillant à peine.
 */
function sample(m: Motion, t: number) {
  const main = 1 - (1 - t) ** 3.1;
  const settle = 9 * Math.sin(Math.PI * clamp01((t - 0.6) / 0.4)) ** 2;
  const lift =
    t < 0.45
      ? m.lift0 + (1 - m.lift0) * Math.sin((Math.PI / 2) * (t / 0.45))
      : t < 0.9
        ? Math.cos((Math.PI / 2) * ((t - 0.45) / 0.45)) ** 1.5
        : 0;
  const v = clamp01((t - 0.86) / 0.14);
  const rock = t > 0.86 ? 3.5 * Math.sin(3 * Math.PI * v) * (1 - v) ** 2 : 0;
  return { angle: m.from + m.total * main + settle, lift, tilt: 9 * lift + rock };
}

/** Pistes d'un lancer, échantillonnées toutes les 24 ms : l'interpolation
    linéaire entre deux échantillons ne se voit pas, et le reflet ne saute
    aucun passage devant la lumière. */
function tracks(m: Motion) {
  const steps = Math.round(m.duration / 24);
  const frames = Array.from({ length: steps + 1 }, (_, i) =>
    sample(m, i / steps),
  );
  const face = (offset: number) => ({
    gloss: frames.map((f): Keyframe => {
      const g = gloss(facing(f.angle - offset));
      return { opacity: g.opacity, transform: `translateX(${g.x}%)` };
    }),
    shade: frames.map(
      (f): Keyframe => ({ opacity: shade(facing(f.angle - offset)) }),
    ),
  });
  const front = face(0);
  const back = face(180);
  return {
    coin: frames.map(
      (f): Keyframe => ({ transform: `rotateY(${f.angle.toFixed(2)}deg)` }),
    ),
    lift: frames.map(
      (f): Keyframe => ({
        transform: `translateY(${(-9 * f.lift).toFixed(2)}px) rotateX(${f.tilt.toFixed(2)}deg) scale(${(1 + 0.045 * f.lift).toFixed(4)})`,
      }),
    ),
    frontGloss: front.gloss,
    frontShade: front.shade,
    backGloss: back.gloss,
    backShade: back.shade,
    // Lumière sous la pièce quand elle s'élève, plus étroite de profil.
    floor: frames.map((f): Keyframe => {
      const c = Math.abs(Math.cos(rad(f.angle)));
      return {
        opacity: +(0.85 * f.lift * (0.4 + 0.6 * c)).toFixed(3),
        transform: `scaleX(${(0.3 + 0.7 * c).toFixed(3)})`,
      };
    }),
    halo: frames.map(
      (f): Keyframe => ({
        opacity: +(0.7 + 0.3 * Math.abs(Math.cos(rad(f.angle)))).toFixed(3),
        transform: `scale(${(1 + 0.1 * f.lift).toFixed(3)})`,
      }),
    ),
  };
}

type Throw = { motion: Motion; tracks: ReturnType<typeof tracks> };

/** Le lancer depuis le repos, de loin le plus fréquent : calculé une fois. */
let restingThrow: Throw | null = null;
function fromRest(): Throw {
  if (!restingThrow) {
    const m = motion(0, 0);
    restingThrow = { motion: m, tracks: tracks(m) };
  }
  return restingThrow;
}

const reducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Médaillon-pièce : au clic, il tourne sur lui-même comme une pièce de
 * monnaie. Recto : le portrait (ou l'initiale) ; revers : le « & » de la
 * marque, le nom et le rôle gravés sur le pourtour. Tout le mouvement est
 * calculé d'avance et joué sur transform et opacity : il ne dépend pas du
 * fil principal.
 */
export function CoinPortrait({
  className = "",
  name,
  legend,
  label,
  portrait,
}: {
  className?: string;
  /** Son initiale occupe le recto tant qu'il n'y a pas de photo. */
  name: string;
  /** Gravé sur le pourtour du revers. */
  legend: string;
  /** Nom accessible du bouton. */
  label: string;
  portrait?: string;
}) {
  const legendId = useId();
  const coin = useRef<HTMLSpanElement>(null);
  const lift = useRef<HTMLSpanElement>(null);
  const tilt = useRef<HTMLSpanElement>(null);
  const halo = useRef<HTMLSpanElement>(null);
  const floor = useRef<HTMLSpanElement>(null);
  const frontGloss = useRef<HTMLSpanElement>(null);
  const frontShade = useRef<HTMLSpanElement>(null);
  const backGloss = useRef<HTMLSpanElement>(null);
  const backShade = useRef<HTMLSpanElement>(null);
  const current = useRef<{ motion: Motion; animations: Animation[] } | null>(
    null,
  );

  // Préchauffage pendant un temps mort : les pistes du lancer depuis le
  // repos, et un premier animate() à vide, le plus lent de la page. Sans
  // lui, le premier clic démarre avec un temps de retard.
  useEffect(() => {
    const warm = () => {
      fromRest();
      coin.current?.animate([{ transform: "none" }, { transform: "none" }], 1)
        .cancel();
    };
    if ("requestIdleCallback" in window) {
      const handle = requestIdleCallback(warm, { timeout: 3000 });
      return () => cancelIdleCallback(handle);
    }
    const handle = setTimeout(warm, 1500);
    return () => clearTimeout(handle);
  }, []);

  function spin() {
    const el = coin.current;
    if (!el) return;

    // Mouvement réduit : la pièce se retourne d'un coup, sans animation.
    if (reducedMotion()) {
      el.dataset.side = el.dataset.side === "back" ? "front" : "back";
      return;
    }
    delete el.dataset.side;

    // Relancée en plein vol : elle repart de là où elle en est.
    let from = 0;
    let lift0 = 0;
    const running = current.current;
    if (running) {
      const time = Number(
        running.animations[0]?.currentTime ?? running.motion.duration,
      );
      const t = clamp01(time / running.motion.duration);
      if (t < 1) {
        const state = sample(running.motion, t);
        from = state.angle;
        lift0 = state.lift;
      }
      running.animations.forEach((animation) => animation.cancel());
    }

    let next: Throw;
    if (from === 0 && lift0 === 0) {
      next = fromRest();
    } else {
      const m = motion(from, lift0);
      next = { motion: m, tracks: tracks(m) };
    }
    const { tracks: t } = next;
    const timing = { duration: next.motion.duration, easing: "linear" };

    // La rotation d'abord : sa progression sert de référence à une relance.
    const pairs: [HTMLElement | null, Keyframe[]][] = [
      [el, t.coin],
      [lift.current, t.lift],
      [frontGloss.current, t.frontGloss],
      [frontShade.current, t.frontShade],
      [backGloss.current, t.backGloss],
      [backShade.current, t.backShade],
      [floor.current, t.floor],
      [halo.current, t.halo],
    ];
    current.current = {
      motion: next.motion,
      animations: pairs.flatMap(([target, keyframes]) =>
        target ? [target.animate(keyframes, timing)] : [],
      ),
    };
  }

  // Survol : la pièce s'incline sous le curseur et montre son épaisseur.
  function lean(event: PointerEvent<HTMLButtonElement>) {
    const el = tilt.current;
    if (!el || event.pointerType !== "mouse" || reducedMotion()) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-24 * y).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(30 * x).toFixed(2)}deg`);
    event.currentTarget.style.setProperty(
      "--light-x",
      `${((x + 0.5) * 100).toFixed(1)}%`,
    );
    event.currentTarget.style.setProperty(
      "--light-y",
      `${((y + 0.5) * 100).toFixed(1)}%`,
    );
  }

  function settle(event: PointerEvent<HTMLButtonElement>) {
    tilt.current?.style.removeProperty("--tilt-x");
    tilt.current?.style.removeProperty("--tilt-y");
    event.currentTarget.style.removeProperty("--light-x");
    event.currentTarget.style.removeProperty("--light-y");
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={`${styles.root} ${className}`}
      onClick={spin}
      onPointerMove={lean}
      onPointerLeave={settle}
    >
      <span ref={halo} aria-hidden="true" className={styles.halo} />
      <span ref={floor} aria-hidden="true" className={styles.floor} />
      <span ref={lift} aria-hidden="true" className={styles.lift}>
        <span ref={tilt} className={styles.tilt}>
          <span ref={coin} className={styles.coin}>
            <span className={styles.edge}>
              {EDGE.map(({ angle, shade: light }) => (
                <span
                  key={angle}
                  className={styles.facet}
                  style={
                    { "--a": `${angle}deg`, "--l": `${light}%` } as CSSProperties
                  }
                />
              ))}
            </span>

            <span className={`${styles.face} ${styles.front}`}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt=""
                  fill
                  sizes="(min-width: 80rem) 16.5rem, 12rem"
                  className="object-cover"
                />
              ) : (
                <span className={styles.initial}>{name.charAt(0)}</span>
              )}
              <span ref={frontGloss} className={styles.gloss} style={REST_GLOSS} />
              <span ref={frontShade} className={styles.shade} />
            </span>

            <span className={`${styles.face} ${styles.back}`}>
              <svg className={styles.legend} viewBox="0 0 100 100">
                <defs>
                  <path id={legendId} d="M11 50a39 39 0 1 1 78 0a39 39 0 1 1-78 0" />
                </defs>
                <text>
                  <textPath
                    href={`#${legendId}`}
                    textLength="243"
                    lengthAdjust="spacing"
                  >
                    {legend}
                  </textPath>
                </text>
              </svg>
              <span className={styles.mark}>&amp;</span>
              <span ref={backGloss} className={styles.gloss} style={REST_GLOSS} />
              <span ref={backShade} className={styles.shade} />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
