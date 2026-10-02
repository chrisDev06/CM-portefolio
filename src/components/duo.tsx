import Link from "next/link";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CoinPortrait } from "./coin-portrait";
import { Icon, type IconName } from "./ui";
import styles from "./duo.module.css";

type Duo = Dictionary["home"]["duo"];

type Side = {
  className: string;
  /** Icônes des savoir-faire, dans l'ordre de `skills`. */
  skills: IconName[];
  /** Portrait détouré de la séance photo (docs/ASSETS.md §5), par exemple
      "/images/team/manon.webp". En attendant, le médaillon porte l'initiale :
      jamais de visage généré à la place d'une vraie photo. */
  portrait?: string;
};

/** Un côté par personne, dans l'ordre de `home.duo.people` : Manon à gauche
    (magenta), Christopher à droite (indigo). */
const SIDES: [Side, Side] = [
  { className: styles.left, skills: ["message", "list", "users", "heart"] },
  { className: styles.right, skills: ["codeXml", "database", "bars", "wrench"] },
];

/** Icônes des engagements, dans l'ordre de `home.duo.stats`. */
const STAT_ICONS: IconName[] = ["bolt", "users", "shield"];

function Person({
  person,
  side,
  spin,
}: {
  person: Duo["people"][number];
  side: Side;
  /** Nom accessible du médaillon, « {name} » remplacé par le prénom. */
  spin: string;
}) {
  return (
    <div className={`${styles.person} ${side.className}`}>
      <span aria-hidden="true" className={styles.arc} />
      <span aria-hidden="true" className={styles.bubble} />
      <span aria-hidden="true" className={styles.plate} />
      <span aria-hidden="true" className={styles.beam} />
      <span aria-hidden="true" className={styles.ring} />

      <CoinPortrait
        className={styles.portrait}
        name={person.name}
        legend={`${person.name} · ${person.role} ·`}
        label={spin.replace("{name}", person.name)}
        portrait={side.portrait}
      />

      <div className={styles.card}>
        <span aria-hidden="true" className={styles.edge} />
        <h3 className="text-[1.75rem] leading-none font-bold sm:text-[1.875rem]">
          {person.name}
        </h3>
        <p className={`${styles.role} mt-2.5 text-[1.0625rem] font-medium`}>
          {person.role}
        </p>
        <p className="mt-4 text-[0.9375rem] leading-[1.6] text-ink/80 sm:text-base">
          {person.text}
        </p>
        {/* Deux colonnes dès que « Compréhension » tient dans sa pastille. */}
        <div className="@container mt-5">
          <ul className="grid gap-3 @min-[19rem]:grid-cols-2">
            {person.skills.map((skill, index) => (
              <li key={skill} className={styles.skill}>
                <Icon
                  name={side.skills[index] ?? "check"}
                  className="size-6.5 shrink-0"
                />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Câble néon d'un côté : un faisceau part du médaillon, un autre du flanc de
 * la carte, tous deux fondent vers l'anneau ; entre eux, le fil de la flèche.
 * Dessiné pour la gauche, la droite en est le miroir (CSS). Tracés étirés
 * (preserveAspectRatio none), traits d'épaisseur fixe (non-scaling-stroke).
 */
function Cable({ id, className }: { id: string; className: string }) {
  return (
    <div aria-hidden="true" className={`${styles.cable} ${className}`}>
      <svg
        className={styles.cableUp}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={id}
            x1="0"
            x2="100"
            y1="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style={{ stopColor: "var(--cable-from)" }} />
            <stop offset="1" style={{ stopColor: "var(--cable-to)" }} />
          </linearGradient>
        </defs>
        <g stroke={`url(#${id})`}>
          <path className={styles.strandFaint} d="M0-9C48-9 50 100 100 100" />
          <path className={styles.strandSoft} d="M0 6C40 6 56 98 100 99" />
          <path className={styles.strand} d="M0 0C42 0 52 100 100 100" />
        </g>
        <path className={styles.spark} d="M37.9 32.4h.01" />
      </svg>
      <span className={styles.cableLine} />
      <svg
        className={styles.cableDown}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g stroke={`url(#${id})`}>
          <path className={styles.strandFaint} d="M0 109C48 109 50 0 100 0" />
          <path className={styles.strandSoft} d="M0 93C40 93 56 2 100 1" />
          <path className={styles.strand} d="M0 100C42 100 52 0 100 0" />
        </g>
        <path className={styles.spark} d="M31 78.4h.01" />
      </svg>
      <span className={styles.arrow}>
        <Icon name="arrow" className="size-4.5" />
      </span>
    </div>
  );
}

/**
 * « Votre binôme » : Manon et Christopher de part et d'autre, reliés par des
 * câbles néon à l'anneau « Vous ». Le décor est aria-hidden : il reste deux
 * profils, une liste d'engagements et un lien.
 */
export function DuoSection({
  content,
  locale,
}: {
  content: Duo;
  locale: Locale;
}) {
  const [manon, christopher] = content.people;

  return (
    <section className={`hairline ${styles.section}`}>
      <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.floorGlow} />
        <svg
          className={styles.floor}
          viewBox="0 0 1600 220"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="duo-floor-left"
              x1="0"
              x2="660"
              y1="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" style={{ stopColor: "var(--floor-left)" }} />
              <stop
                offset="1"
                style={{ stopColor: "var(--floor-left)", stopOpacity: 0 }}
              />
            </linearGradient>
            <linearGradient
              id="duo-floor-right"
              x1="1600"
              x2="940"
              y1="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" style={{ stopColor: "var(--floor-right)" }} />
              <stop
                offset="1"
                style={{ stopColor: "var(--floor-right)", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>
          <g stroke="url(#duo-floor-left)">
            <path d="M0 14C280 44 520 86 820 110" />
            <path className={styles.floorBright} d="M0 38C240 66 470 104 800 124" />
            <path d="M0 70C220 94 440 124 780 140" />
            <path d="M0 116C200 134 400 154 760 164" />
          </g>
          <g stroke="url(#duo-floor-right)">
            <path d="M1600 14C1320 44 1080 86 780 110" />
            <path className={styles.floorBright} d="M1600 38C1360 66 1130 104 800 124" />
            <path d="M1600 70C1380 94 1160 124 820 140" />
            <path d="M1600 116C1400 134 1200 154 840 164" />
          </g>
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className="eyebrow-dot size-1.5 rounded-full" />
            <span className={styles.eyebrowText}>{content.eyebrow}</span>
            <span aria-hidden="true" className="eyebrow-dot size-1.5 rounded-full" />
          </p>
          {/* Une ligne par bloc : l'équilibrage se fait ligne à ligne, jamais
              « projet. » seul sous le reste. */}
          <h2 className="mt-6 text-[clamp(2.25rem,2vw+1.5rem,3.5rem)] leading-[1.08] font-bold tracking-[-0.025em] xl:mt-5">
            <span className="block">{content.titleStart}</span>{" "}
            <span className="block">
              {content.titleEnd}{" "}
              <span className={styles.highlight}>
                {content.titleHighlight}
              </span>
            </span>
          </h2>
          <p className="mt-5 max-w-[47rem] text-lg leading-[1.7] text-ink/70">
            {content.lead}
          </p>
        </div>

        <div className={styles.stage}>
          <Person person={manon} side={SIDES[0]} spin={content.spin} />

          <div className={styles.flow}>
            <Cable id="duo-cable-left" className={styles.cableLeft} />
            <Cable id="duo-cable-right" className={styles.cableRight} />
            <div className={styles.hub}>
              <span aria-hidden="true" className={styles.hubRings} />
              <Icon name="user" className={styles.hubIcon} />
              <p className={styles.hubTitle}>{content.hub.title}</p>
              <p className={styles.hubText}>{content.hub.text}</p>
            </div>
          </div>

          <Person person={christopher} side={SIDES[1]} spin={content.spin} />

          {/* En ligne ou en liste selon la place : voir le conteneur. */}
          <div className={styles.stats}>
            <ul className={styles.statsList}>
              {content.stats.map((stat, index) => (
                <li key={stat.title} className={styles.stat}>
                  <span aria-hidden="true" className={styles.statIcon}>
                    <Icon
                      name={STAT_ICONS[index] ?? "check"}
                      className="size-5.5"
                    />
                  </span>
                  <div>
                    <p className="text-[0.9375rem] font-semibold text-ink min-[90rem]:text-sm">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-sm text-ink/65 min-[90rem]:text-[0.8125rem]">
                      {stat.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.action}>
            <Link
              href={path("agency", locale)}
              className={`${styles.cta} sheen group`}
            >
              {content.cta}
              <Icon
                name="arrow"
                className="size-5 transition-transform duration-200 ease-brand group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <p className={styles.tagline}>{content.tagline}</p>
      </div>
    </section>
  );
}
