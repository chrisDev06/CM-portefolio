"use client";

import { useEffect, useState } from "react";
import styles from "./typewriter.module.css";

/** Délai avant la touche suivante, en ms : jamais deux frappes au même rythme. */
function keyDelay(char: string) {
  const jitter = (min: number, max: number) => min + Math.random() * (max - min);
  // Fin de phrase : le temps de penser à la suivante.
  if (char === "." || char === "!" || char === "?") return jitter(380, 620);
  if (char === "," || char === ":") return jitter(180, 280);
  if (char === " ") return jitter(70, 150);
  // Une hésitation de temps en temps, sinon des rafales plus ou moins rapides.
  if (Math.random() < 0.08) return jitter(220, 340);
  return jitter(35, 125);
}

/** Temps de lecture de la phrase complète avant de l'effacer, en ms. */
const HOLD = 1500;

/**
 * Texte tapé lettre à lettre, comme dans une barre d'adresse, puis effacé et
 * réécrit en boucle. Le texte complet
 * reste réservé (invisible) dessous : la mise en page ne bouge pas pendant la
 * frappe, et les lecteurs d'écran lisent la phrase entière d'un coup.
 */
export function Typewriter({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  /** Attente avant la première frappe, en secondes. */
  delay?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  // Le curseur clignote quand rien ne s'écrit ni ne s'efface.
  const [idle, setIdle] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Mouvement réduit : la phrase apparaît entière, sans frappe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => setCount(text.length), 0);
      return () => clearTimeout(timer);
    }

    let typed = 0;
    const type = () => {
      typed += 1;
      setCount(typed);
      setIdle(false);
      if (typed < text.length) {
        timer = setTimeout(type, keyDelay(text[typed - 1]));
      } else {
        setIdle(true);
        timer = setTimeout(erase, HOLD);
      }
    };
    // Touche Suppr maintenue : plus rapide que la frappe, jamais régulière.
    const erase = () => {
      typed -= 1;
      setCount(typed);
      setIdle(false);
      if (typed > 0) {
        timer = setTimeout(erase, 25 + Math.random() * 45);
      } else {
        setIdle(true);
        timer = setTimeout(type, 450 + Math.random() * 300);
      }
    };
    timer = setTimeout(type, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className={`${styles.root} ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={styles.ghost}>
        {text}
      </span>
      <span aria-hidden="true" className={styles.typed}>
        {text.slice(0, count)}
        <span className={`${styles.caret} ${idle ? styles.idle : ""}`} />
      </span>
    </span>
  );
}
