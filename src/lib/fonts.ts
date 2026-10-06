import { Fraunces, Ubuntu, Baloo_2, Playfair_Display } from 'next/font/google';

/**
 * The three families from the design system. Each binds to the custom property
 * the token CSS expects, so `var(--font-display)` resolves to the hosted face
 * with its declared fallback stack behind it.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display-face',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans-face',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const baloo = Baloo_2({
  subsets: ['latin', 'devanagari'],
  weight: ['500', '600', '700'],
  variable: '--font-festive-face',
  display: 'swap',
  fallback: ['Trebuchet MS', 'sans-serif'],
});

/** The "Regal Sapphire & Gold" theme's display face — see tokens.json
 * `type.families.display.regal`. Loaded globally like the others so the
 * theme toggle needs no extra network round-trip when it switches. */
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-regal-face',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const fontVariables = [fraunces.variable, ubuntu.variable, baloo.variable, playfair.variable].join(
  ' '
);
