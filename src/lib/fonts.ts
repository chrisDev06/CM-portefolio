import { Inter, Space_Grotesk } from "next/font/google";

/**
 * next/font auto-héberge les fichiers au build : aucune requête vers Google
 * depuis le navigateur, donc pas de sujet RGPD.
 *
 * Space Grotesk est un PLACEHOLDER pour le display. À remplacer par
 * Clash Display / General Sans (woff2 dans public/fonts) via next/font/local
 * dès que la licence est acquise — voir docs/ASSETS.md §2.
 */
export const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700"],
});

export const fontVariables = `${body.variable} ${display.variable}`;
