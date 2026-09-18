// Généré par scripts/prepare-hero.mjs — ne pas modifier à la main.
export const HERO_INTRINSIC = { width: 1672, height: 941 } as const;

/** Largeurs disponibles ; au-delà de 1672, agrandies au build. */
export const HERO_WIDTHS = [960, 1280, 1672, 2240, 2880] as const;
export const HERO_NATIVE_WIDTH = 1672;

/** La scène floutée sur le fond du site : plan lointain, halo lumineux. */
export const HERO_BACKDROP =
  "data:image/webp;base64,UklGRqADAABXRUJQVlA4IJQDAACQNQCdASq4AWoBPrlcp1CzMzSioXaImpAXCWlu4XaeABmg15elwCE18n6QO01S6qfFCzYdqIHYkUN4LiP65iRQ3guI/rmEG9PihZsO01S6qfFCzYdpql1U+KFmw7TVLqp8ULNh2mqXVT4oWbDtNUuqnxQs2HaapdVPihZsO01S6qfFCzYdpql1U+KFmw7TVLqp8ULNh2mqW9xPEsANFCqXVT4oWdA8WscBTUxtS+go+VoyTzg3p8ULTuQ81GMC63Mf1KPVptFDPGWLopRDp+kDtNUuqoYqz0gdK6wmAD3ioYPcqveSUABsO01S36uvJ5UMEjHhAqbFGeaAEHWEOyHmtL/EBS6qfFBslP5H4H1T9MvzOxHAD82whxwHFLqp8UK2NwgXb6N62u3n+SHiy94azMmJaft5TVT4oWbMy3bYaMG4EZwswArnkiSiAA2Haapd562Y28kIl/R5yucDLWfLxdoOkDtNUuqnxR+Qo1AnrqIfFCzYdpql1U+KFmw7TVLqp8ULNh2mqXVT4oWbDtNUuqnxQs2HaapdVPihZsO01S6qfFCzYdpql1U+KFmw7TVLqp8IAAD+99J9q/UVXtKZb8StF7bdu3bt27du3bt27du3bt27dsp07XlQgAAA7BfUQAS74QAKIIAOeQAU4QAc8gApwkrEqIjnxpR6JLEilVTaVLNebJVGYe+3heHso5/hzphsPAl3LVst3cA9L5hvUzrK6w3Wd33oEO4hvPHXvkw6h8PJD849DdFuR7zNrm3wo8ob05sdvlqudPziAl9f+aUlC57lNR0QpqQKBBuZpVlkLKYdOUYhWnKsrErjZ0VKbRIWENdETqS9sQT1wgbsgRaoqo72s7P681t3/2fmI7IEIWxHHW77Um4X5TqgaJnEhx7HnkXEK2t7UeI79Ul9VfocvX6xFKJtqB7KO/np18xClVuqijU8Nm8GSSQCXbuERC6K9uCPilu53fYRhV0TqiYfUo8sdeCm7H8qj7jDnZg6rVKY1mKCsYV0Liuosvr9aJjBCoOiY6G2JgcSZ/oo38PeLp4LN73ncc6yxKlx3sYAsp5302xojvB+jmpZY5BRvAsvvgzSoO+RiMcp1mTGcfdStlHg02f3IpVOHMeq66pumEQH7JKgQqr2PkhEVWwA+xSbpKlvInyy3RAf2XHSs3QTo6/un0q67sFVVKINEAAAAFvEAIqIAL2IARUQAXsQAAAA";

/** Marges du plan lointain, en fraction de la taille de l'image. */
export const HERO_BACKDROP_PAD = {
  left: 0.6,
  right: 0.6,
  top: 1.3009,
  bottom: 0.9027,
} as const;
