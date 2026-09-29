import Link from "next/link";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MethodStreaks } from "./method-streaks";
import { Container, Eyebrow, Icon, type IconName } from "./ui";
import styles from "./method.module.css";

/** Icônes des atouts, dans l'ordre de `home.method.features`. */
const FEATURE_ICONS: IconName[] = ["calendar", "circleCheck", "users", "signal"];

/** Icônes des étapes, dans l'ordre de `home.method.steps`. */
const STEP_ICONS: IconName[] = [
  "messageCircle",
  "listRows",
  "codeXml",
  "rocketLaunch",
];

/**
 * « Notre méthode » : le titre et le bouton vers la page détaillée, quatre
 * atouts, puis la frise des quatre étapes, du rose (01) au bleu (04), posée
 * sur un sol brillant. Le décor est aria-hidden : il reste une liste ordonnée.
 */
export function MethodSection({
  content,
  locale,
}: {
  content: Dictionary["home"]["method"];
  locale: Locale;
}) {
  const last = content.steps.length - 1;

  return (
    <section
      aria-labelledby="method-title"
      className={`hairline ${styles.section}`}
    >
      <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.floor} />
      </div>

      <Container>
        <div className={styles.head}>
          <div>
            <Eyebrow neon>{content.eyebrow}</Eyebrow>
            <h2 id="method-title" className={styles.title}>
              {content.titleStart}
              <br />
              {content.titleEnd}{" "}
              <span className={styles.highlight}>{content.titleHighlight}</span>
            </h2>
            <p className={styles.lead}>{content.lead}</p>
          </div>
          <Link href={path("method", locale)} className={`${styles.cta} group`}>
            {content.cta}
            <Icon
              name="arrow"
              className="size-5.5 transition-transform duration-200 ease-brand group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ul className={styles.features}>
          {content.features.map((feature, index) => (
            <li key={feature} className={styles.feature}>
              <span aria-hidden="true" className={styles.badge}>
                <Icon name={FEATURE_ICONS[index] ?? "check"} className="size-7" />
              </span>
              <p className={styles.featureText}>{feature}</p>
            </li>
          ))}
        </ul>

        <div className={styles.timeline}>
          <MethodStreaks />
          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <div className={styles.card}>
                  <span aria-hidden="true" className={styles.edge} />
                  <span aria-hidden="true" className={styles.tile}>
                    <Icon
                      name={STEP_ICONS[index] ?? "check"}
                      className="size-8"
                    />
                  </span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                  <ul className={styles.tags}>
                    {step.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Filet de la frise, numéro et flèche : posés sur le bord
                    haut de la carte, au-dessus d'elle. */}
                <span aria-hidden="true" className={styles.rail} />
                {index === 0 ? (
                  <span aria-hidden="true" className={styles.spark} />
                ) : null}
                <span aria-hidden="true" className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < last ? (
                  <span aria-hidden="true" className={styles.next}>
                    <Icon name="arrow" className="size-4" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
