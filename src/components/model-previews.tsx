import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ModelId } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { modelAssets, PREVIEW_PALETTES } from "@/lib/model-assets";
import { Icon } from "./ui";
import styles from "./model-previews.module.css";

/**
 * Aperçus des démos mises en avant sur l'accueil : des maquettes en HTML, pas
 * des captures. Chacune est annoncée comme une seule image (role="img") ; le
 * détail reste décoratif. Remplaçables par la vraie capture de la démo dès
 * qu'elle est en ligne (docs/ASSETS.md §4).
 */

/** Largeur affichée : une carte sur deux colonnes, pleine largeur en dessous. */
const SIZES = "(min-width: 1024px) 640px, 100vw";

const HZ = PREVIEW_PALETTES["horizon-travel"];
const FZ = PREVIEW_PALETTES.fitzone;

const vars = (entries: Record<string, string>) => entries as CSSProperties;

/* --- Pictogrammes internes aux maquettes -------------------------------------
 * Hors de la famille d'icônes du site (ui.tsx) : ils appartiennent aux démos.
 */

const GLYPHS = {
  lock: "M7.5 11V8a4.5 4.5 0 019 0v3M6 11h12v9.5H6z",
  dumbbell: "M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11",
  apple:
    "M12 7.5c-1.6-1.8-6.5-1.6-6.5 3.2 0 4.3 2.8 9.3 6.5 9.3s6.5-5 6.5-9.3c0-4.8-4.9-5-6.5-3.2zM12 7.5c0-2 1-3.6 3-4.5",
  lotus:
    "M12 20c-4 0-7.5-2.5-8.5-6 3.4 0 6.4 1.3 8.5 4 2.1-2.7 5.1-4 8.5-4-1 3.5-4.5 6-8.5 6zM12 18c-2-2.3-2.6-6.3 0-11 2.6 4.7 2 8.7 0 11",
  home: "M3.5 11 12 4l8.5 7v8.5a1 1 0 01-1 1H15V15H9v5.5H4.5a1 1 0 01-1-1z",
  activity:
    "M8 11a3 3 0 100-6 3 3 0 000 6zM16 11a3 3 0 100-6 3 3 0 000 6zM3.5 20a4.5 4.5 0 019 0M11.5 20a4.5 4.5 0 019 0",
  progress: "M4 19.5h16M5 15l4-4 3 3 7-7",
  profile: "M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5a7.5 7.5 0 0115 0",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
} as const;

function Glyph({ name }: { name: keyof typeof GLYPHS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={GLYPHS[name]} />
    </svg>
  );
}

/** Silhouettes des vignettes de séances : des pictogrammes, pas de visages. */
const POSES: { head: [number, number]; body: string }[] = [
  // HIIT : saut écart.
  {
    head: [12, 4.4],
    body: "M12 7.3v6.5M12 9.3 6.8 5.2M12 9.3l5.2-4.1M12 13.8 7.6 20.4M12 13.8l4.4 6.6",
  },
  // Renforcement : squat, haltère tenu devant.
  {
    head: [8.6, 5],
    body: "M9.2 7.8 10.6 13.6l4.6.9-.5 5.9M9.8 9.6l5.4.5M15.2 8.1v4M17.4 8.1v4M15.2 10.1h2.2M10.6 13.6 7.4 20.2",
  },
  // Yoga : posture de l'arbre.
  {
    head: [12, 4],
    body: "M12 6.9v7.6M12 9 8.6 4.6M12 9l3.4-4.4M12 14.5v6.3M12 14.5l3.6 1.6-3.1 1.6",
  },
  // Cardio boxe : garde haute.
  {
    head: [8.8, 5],
    body: "M9.3 7.8l1.6 6.2M10.9 14 7.8 20.4M10.9 14l4.2 6.4M9.8 9.6l4.6.4 2-2M10 10.3l2.6 2.4 1.9-1.4",
  },
];

function Athlete({ index }: { index: number }) {
  const pose = POSES[index % POSES.length];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={pose.head[0]} cy={pose.head[1]} r="2" fill="currentColor" stroke="none" />
      <path d={pose.body} />
    </svg>
  );
}

/* --- Horizon Travel : site vitrine dans une fenêtre de navigateur ----------- */

export function HorizonTravelPreview({ dict }: { dict: Dictionary }) {
  const model = dict.models.items["horizon-travel"];
  const copy = model.preview;
  const assets = modelAssets("horizon-travel");

  return (
    <div
      role="img"
      aria-label={`${model.name} — ${dict.common.viewDesktop}`}
      className={styles.browser}
      style={vars({
        "--hz-accent": HZ.accent,
        "--hz-accent-2": HZ.accent2,
        "--hz-on-accent": HZ.onAccent,
      })}
    >
      <div aria-hidden="true">
        <div className={styles.bar}>
          {PREVIEW_PALETTES.browserDots.map((color) => (
            <span
              key={color}
              className={styles.dot}
              style={vars({ "--dot": color })}
            />
          ))}
          <span className={styles.url}>
            <Glyph name="lock" />
            {assets.demoHost}
          </span>
        </div>

        <div className={styles.site}>
          <Image
            src={assets.scene}
            alt=""
            fill
            sizes={SIZES}
            className="object-cover"
          />
          <div className={styles.shade} />

          <div className={styles.nav}>
            <span className={styles.logo}>{model.name}</span>
            <span className={styles.links}>
              {copy.nav.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </span>
            <span className={styles.book}>{copy.book}</span>
          </div>

          <div className={styles.hero}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <p className={styles.title}>
              {copy.titleStart}
              <br />
              {copy.titleEnd}{" "}
              <span className={styles.titleAccent}>{copy.titleHighlight}</span>
            </p>
            <p className={styles.lead}>{copy.lead}</p>
            <span className={styles.cta}>
              {copy.cta}
              <Icon name="arrow" className="" />
            </span>
          </div>

          <div className={styles.highlights}>
            {copy.highlights.map((text, index) => (
              <div key={text} className={styles.highlight}>
                <p className={styles.highlightIndex}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={styles.highlightText}>{text}</p>
              </div>
            ))}
          </div>

          <div className={styles.spot}>
            <div className={styles.spotPhoto}>
              {/* Même fichier que le fond (même `sizes`, donc aucune requête
                  de plus), recadré sur le couchant et le bord du village. */}
              <Image
                src={assets.scene}
                alt=""
                fill
                sizes={SIZES}
                className="origin-[66%_44%] scale-[2.2] object-cover"
              />
            </div>
            <div className={styles.spotBody}>
              <div>
                <p className={styles.spotName}>{copy.spot.name}</p>
                <p className={styles.spotPlace}>{copy.spot.place}</p>
              </div>
              <span className={styles.spotGo}>
                <Icon name="arrow" className="" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- FitZone : deux écrans d'application posés sur la roche ----------------- */

function StatusBar() {
  return (
    <div className={styles.status}>
      <span>9:41</span>
      <span className={styles.statusIcons}>
        <svg viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 12 5.6 9.3a3.4 3.4 0 014.8 0zM3.4 6.9a6.6 6.6 0 019.2 0l1.5-1.7a8.9 8.9 0 00-12.2 0zM.2 3.4a11.2 11.2 0 0115.6 0L16 1.7A13.5 13.5 0 000 1.7z" />
        </svg>
        <svg viewBox="0 0 27 12">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3.2"
            fill="none"
            stroke="currentColor"
            opacity="0.5"
          />
          <rect x="2.2" y="2.2" width="18.6" height="7.6" rx="1.8" fill="currentColor" />
          <rect x="23.8" y="4" width="2.2" height="4" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

function Phone({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={`${styles.phone} ${className}`}>
      <div className={styles.screen}>
        <span className={styles.island} />
        <StatusBar />
        {children}
      </div>
    </div>
  );
}

/** Anneau de progression : circonférence 2π × 42 ≈ 263,9. */
const RING = 2 * Math.PI * 42;

const TAB_GLYPHS = ["dumbbell", "apple", "lotus"] as const;
const NAV_GLYPHS = ["home", "activity", "progress", "profile"] as const;

export function FitZonePreview({ dict }: { dict: Dictionary }) {
  const model = dict.models.items.fitzone;
  const copy = model.preview;
  const assets = modelAssets("fitzone");
  const progress = Number(copy.score) / 100;

  return (
    <div
      role="img"
      aria-label={`${model.name} — ${dict.common.viewMobile}`}
      className={styles.stage}
      style={vars({
        "--fz-accent": FZ.accent,
        "--fz-on-accent": FZ.onAccent,
        "--fz-screen": FZ.screen,
        "--fz-panel": FZ.panel,
        "--fz-island": FZ.island,
        "--fz-silhouette": FZ.silhouette,
      })}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={assets.scene}
          alt=""
          fill
          sizes={SIZES}
          className="object-cover"
        />
        {/* Lumière au pied des téléphones : ils posent sur la roche. */}
        <span className={styles.pool} />

        {/* Derrière : la liste des séances. */}
        <Phone className={styles.phoneBack}>
          <div className={styles.sessions}>
            <div className={styles.sessionsHead}>
              <p className={styles.sessionsTitle}>{copy.sessionsTitle}</p>
              <span className={styles.search}>
                <Glyph name="search" />
              </span>
            </div>
            <div className={styles.chips}>
              {copy.filters.map((filter, index) => (
                <span
                  key={filter}
                  className={`${styles.chip} ${index === 0 ? styles.active : ""}`}
                >
                  {filter}
                </span>
              ))}
            </div>
            <div className={styles.list}>
              {copy.sessions.map((session, index) => (
                <div key={session.name} className={styles.item}>
                  <span
                    className={styles.thumb}
                    style={vars({
                      "--from": FZ.thumbs[index % FZ.thumbs.length][0],
                      "--to": FZ.thumbs[index % FZ.thumbs.length][1],
                    })}
                  >
                    <Athlete index={index} />
                  </span>
                  <div>
                    <p className={styles.itemName}>{session.name}</p>
                    <p className={styles.itemMeta}>{session.meta}</p>
                  </div>
                  <span className={styles.play}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 4.5v15L19.5 12z" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Phone>

        {/* Devant : l'accueil de l'application. */}
        <Phone className={styles.phoneFront}>
          <div className={styles.home}>
            <p className={styles.hello}>{copy.greeting} 👋</p>
            <p className={styles.prompt}>{copy.prompt}</p>

            <div className={styles.tabs}>
              {copy.tabs.map((tab, index) => (
                <span
                  key={tab}
                  className={`${styles.tab} ${index === 0 ? styles.active : ""}`}
                >
                  <Glyph name={TAB_GLYPHS[index % TAB_GLYPHS.length]} />
                  {tab}
                </span>
              ))}
            </div>

            <p className={styles.label}>{copy.progress}</p>
            <div className={styles.ring}>
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="42" strokeWidth="7" stroke="currentColor" opacity="0.1" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="13"
                  stroke="var(--fz-accent)"
                  opacity="0.18"
                  strokeLinecap="round"
                  strokeDasharray={`${RING * progress} ${RING}`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="7"
                  stroke="var(--fz-accent)"
                  strokeLinecap="round"
                  strokeDasharray={`${RING * progress} ${RING}`}
                />
              </svg>
              <div className={styles.ringValue}>
                <p className={styles.ringScore}>
                  {copy.score}
                  <small>%</small>
                </p>
                <p className={styles.ringGoal}>{copy.goal}</p>
              </div>
            </div>

            <div className={styles.stats}>
              {copy.stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div className={styles.start}>
              {copy.start}
              <Icon name="arrow" className="" />
            </div>
          </div>

          <div className={styles.tabbar}>
            {copy.nav.map((item, index) => (
              <span
                key={item}
                className={`${styles.tabbarItem} ${index === 0 ? styles.tabbarActive : ""}`}
              >
                <Glyph name={NAV_GLYPHS[index % NAV_GLYPHS.length]} />
                {item}
              </span>
            ))}
          </div>
        </Phone>
      </div>
    </div>
  );
}

/* --- Icônes d'application ---------------------------------------------------- */

/** Icône de la démo, à côté de son nom : un coucher de soleil, une feuille. */
export function ModelAppIcon({ id, className = "" }: { id: ModelId; className?: string }) {
  if (id === "fitzone") {
    return (
      <svg viewBox="0 0 56 56" aria-hidden="true" className={className}>
        <defs>
          <linearGradient id="fz-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={FZ.accent} />
            <stop offset="1" stopColor={FZ.accent} stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={FZ.screen} />
        <path
          d="M41 13C25 13 15 21.5 15 34.5c0 3.6 1.1 6.4 2.6 8.3C31.8 42.6 41 32 41 13z"
          fill="url(#fz-leaf)"
        />
        <path d="M30.5 20.5 22 32.5h6l-2.2 9 8.8-12.6h-6.1z" fill={FZ.screen} />
      </svg>
    );
  }

  const icon = HZ.icon;
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={icon.sky} />
          <stop offset="0.55" stopColor={icon.dusk} />
          <stop offset="1" stopColor={HZ.accent} />
        </linearGradient>
        <radialGradient id="hz-sun" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor={icon.sun} />
          <stop offset="1" stopColor={HZ.accent} />
        </radialGradient>
      </defs>
      <rect width="56" height="56" fill="url(#hz-sky)" />
      <circle cx="24" cy="36" r="11" fill="url(#hz-sun)" />
      <path d="M0 40c10-7 21-5 30-1s18 3 26-1v18H0z" fill={icon.hills} />
      <path d="M0 47c12-4 24-3 34 0s16 2 22 0v9H0z" fill={icon.shore} />
    </svg>
  );
}
