"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Physique du tour, réglée par simulation : un tour complet en ~1 s, un
   dépassement de ~6° au retour, la carte posée vers 1,6 s. */
const IMPULSE = 600; // °/s donnés par le clic, au milieu de la carte
const FRICTION = 1.3; // /s : la carte perd son élan en tournant
const CATCH_ZONE = 75; // ° avant l'arrivée où le cran saisit la carte
const CATCH_FREQ = 10.5; // rad/s : raideur du cran
const CATCH_DAMPING = 0.5;
const CREEP = 240; // °/s² si la carte s'essouffle avant le cran
const LIFT = 42; // px vers le spectateur, à pleine vitesse
const RECEDE = 380; // px : recul de la voisine le temps du passage
const MAX_TURNS = 3;
const STEP = 1 / 240;
const TAP_SLOP = 6; // px : au-delà, c'est un glisser, pas une tape

type Spin = {
  card: HTMLElement;
  partner: HTMLElement | null;
  row: number;
  /** -1 : la carte de gauche tourne en sens inverse de celle de droite. */
  dir: 1 | -1;
  angle: number;
  velocity: number;
  target: number;
  lift: number;
  recede: number;
  recedeVelocity: number;
  /** Dernier état écrit dans le DOM : on n'y touche qu'aux changements. */
  back: boolean;
  ahead: boolean;
  aside: boolean;
};

const smoothstep = (from: number, to: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/**
 * Les cartes de « Notre différence » : au clic, la carte fait le tour du
 * faisceau central, comme une pancarte qu'on frappe, puis revient se poser.
 * L'élan vient du clic (plus fort loin de l'axe), le frottement le freine,
 * un cran magnétique la ramène avec un léger dépassement ; chaque clic
 * pendant le tour en ajoute un. La voisine de rangée recule le temps du
 * passage : les deux cartes ne se traversent jamais.
 * Transform et opacité uniquement, une boucle rAF qui s'arrête au repos.
 */
export function DifferenceDeck({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    const board = list?.parentElement;
    if (!list || !board) return;

    const scene = matchMedia("(min-width: 48rem)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pulse = board.querySelector<HTMLElement>("[data-pulse]");
    const flare = board.querySelector<HTMLElement>("[data-flare]");
    const spins = new Map<HTMLElement, Spin>();
    let press: { card: HTMLElement; x: number; y: number; at: number } | null =
      null;
    let frame = 0;
    let last = 0;

    const slots = () => [...list.children] as HTMLElement[];

    /** L'onde de lumière, là où le doigt a frappé le verre. */
    const ripple = (card: HTMLElement, x: number, y: number) => {
      const wave = card.querySelector<HTMLElement>("[data-ripple]");
      if (!wave) return;
      const rect = card.getBoundingClientRect();
      wave.style.left = `${x - rect.left}px`;
      wave.style.top = `${y - rect.top}px`;
      wave.animate(
        reduced.matches
          ? [{ opacity: 0 }, { opacity: 0.6, offset: 0.25 }, { opacity: 0 }]
          : [
              { transform: "translate(-50%, -50%) scale(0.12)", opacity: 0.9 },
              { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
            ],
        { duration: 760, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    };

    /** Le choc descend le faisceau jusqu'à l'orbe, qui s'embrase. */
    const surge = (card: HTMLElement) => {
      if (!pulse || !flare || reduced.matches) return;
      const deck = list.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      const from = rect.top + rect.height / 2 - deck.top;
      const to = deck.height / 2;
      pulse.animate(
        [
          { transform: `translate(-50%, calc(${from}px - 50%)) scaleY(0.3)`, opacity: 0 },
          {
            transform: `translate(-50%, calc(${from + (to - from) * 0.3}px - 50%)) scaleY(1)`,
            opacity: 1,
            offset: 0.3,
          },
          { transform: `translate(-50%, calc(${to}px - 50%)) scaleY(0.5)`, opacity: 0 },
        ],
        { duration: 520, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
      );
      flare.animate(
        [
          { transform: "scale(0.6)", opacity: 0 },
          { transform: "scale(1.12)", opacity: 0.85, offset: 0.28 },
          { transform: "scale(1.35)", opacity: 0 },
        ],
        { duration: 900, delay: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    };

    const render = (spin: Spin) => {
      const { card, partner } = spin;
      const turn = ((spin.angle % 360) + 360) % 360;
      card.style.setProperty("--spin", `${spin.angle * spin.dir}deg`);
      card.style.setProperty("--lift", `${spin.lift}px`);
      card.style.setProperty(
        "--sheen",
        Math.abs(Math.sin((spin.angle * Math.PI) / 180)).toFixed(3),
      );
      // De dos entre 90° et 270° ; devant l'axe sur la seconde moitié du tour.
      const back = turn > 90 && turn < 270;
      if (back !== spin.back) {
        spin.back = back;
        card.dataset.face = back ? "back" : "front";
      }
      const ahead = turn >= 180;
      if (ahead !== spin.ahead) {
        spin.ahead = ahead;
        card.style.zIndex = ahead ? "3" : "0";
      }
      if (partner) {
        partner.style.setProperty("--lift", `${-RECEDE * spin.recede}px`);
        partner.style.opacity = `${1 - 0.6 * spin.recede}`;
        const aside = spin.recede > 0.002;
        if (aside !== spin.aside) {
          spin.aside = aside;
          partner.style.zIndex = aside ? "-1" : "";
        }
      }
    };

    const integrate = (spin: Spin, dt: number) => {
      for (let left = dt; left > 1e-6; left -= STEP) {
        const h = Math.min(STEP, left);
        const rest = spin.target - spin.angle;
        const grip = smoothstep(spin.target - CATCH_ZONE, spin.target - 8, spin.angle);
        const creep = rest > CATCH_ZONE && spin.velocity < 160 ? CREEP : 0;
        const accel =
          creep +
          CATCH_FREQ * CATCH_FREQ * grip * rest -
          (FRICTION + 2 * CATCH_DAMPING * CATCH_FREQ * grip) * spin.velocity;
        spin.velocity += accel * h;
        spin.angle += spin.velocity * h;

        // La voisine recule dès le départ et revient quand la carte rentre.
        const goal =
          smoothstep(10, 70, spin.angle) *
          (1 - smoothstep(spin.target - 100, spin.target - 55, spin.angle));
        spin.recedeVelocity +=
          (256 * (goal - spin.recede) - 32 * spin.recedeVelocity) * h;
        spin.recede += spin.recedeVelocity * h;

        const lift = LIFT * smoothstep(40, 320, Math.abs(spin.velocity));
        spin.lift += (lift - spin.lift) * (1 - Math.exp(-h / 0.09));
      }
    };

    const settle = (spin: Spin) => {
      const { card, partner } = spin;
      for (const prop of ["--spin", "--lift", "--sheen", "z-index", "will-change"]) {
        card.style.removeProperty(prop);
      }
      delete card.dataset.face;
      delete card.dataset.spinning;
      if (partner) {
        for (const prop of ["--lift", "opacity", "z-index", "will-change"]) {
          partner.style.removeProperty(prop);
        }
      }
      spins.delete(card);
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;
      for (const spin of [...spins.values()]) {
        integrate(spin, dt);
        const done =
          Math.abs(spin.target - spin.angle) < 0.2 &&
          Math.abs(spin.velocity) < 3 &&
          spin.recede < 0.002 &&
          spin.lift < 0.3;
        if (done) settle(spin);
        else render(spin);
      }
      if (spins.size) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        last = 0;
      }
    };

    const tap = (card: HTMLElement, x: number) => {
      const all = slots();
      const index = all.indexOf(card);
      if (index < 0) return;
      const row = index >> 1;
      // La voisine est déjà en train de tourner : on la laisse finir.
      for (const spin of spins.values()) {
        if (spin.row === row && spin.card !== card) return;
      }
      surge(card);
      if (reduced.matches) return;

      // Bras de levier : une tape au bout de la carte la lance plus fort.
      const deck = list.getBoundingClientRect();
      const axis = deck.left + deck.width / 2;
      const leverage = Math.min(1, Math.abs(x - axis) / (deck.width / 2));

      const current = spins.get(card);
      if (current) {
        if (current.target < MAX_TURNS * 360) {
          current.target += 360;
          current.velocity += FRICTION * 360 * (0.9 + 0.2 * leverage);
        }
        return;
      }

      const partner = all[index ^ 1] ?? null;
      card.dataset.spinning = "";
      card.style.willChange = "transform";
      if (partner) partner.style.willChange = "transform, opacity";
      spins.set(card, {
        card,
        partner,
        row,
        dir: index % 2 === 0 ? -1 : 1,
        angle: 0,
        velocity: IMPULSE * (0.9 + 0.2 * leverage),
        target: 360,
        lift: 0,
        recede: 0,
        recedeVelocity: 0,
        back: false,
        ahead: false,
        aside: false,
      });
      card.style.zIndex = "0";
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const cardAt = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest("li");
      return card instanceof HTMLElement && card.parentElement === list
        ? card
        : null;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !scene.matches) return;
      const card = cardAt(event);
      if (!card) return;
      press = { card, x: event.clientX, y: event.clientY, at: event.timeStamp };
      ripple(card, event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      const start = press;
      press = null;
      if (!start || cardAt(event) !== start.card) return;
      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (moved > TAP_SLOP || event.timeStamp - start.at > 600) return;
      tap(start.card, start.x);
    };

    const onPointerCancel = () => {
      press = null;
    };

    list.addEventListener("pointerdown", onPointerDown);
    list.addEventListener("pointerup", onPointerUp);
    list.addEventListener("pointercancel", onPointerCancel);

    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("pointerdown", onPointerDown);
      list.removeEventListener("pointerup", onPointerUp);
      list.removeEventListener("pointercancel", onPointerCancel);
      for (const spin of [...spins.values()]) settle(spin);
    };
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
