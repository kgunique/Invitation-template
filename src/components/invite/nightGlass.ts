import type { CSSProperties } from 'react';

/**
 * The palette of a "night glass" section: dark translucent cards with gold
 * outlines on a starry page (the Ganesha Blessings look). A section merges its
 * `colors` prop over `NIGHT_GLASS` and puts `nightGlassVars(c)` on its root; its
 * classes read `var(--ng-…)`, so any of these sections can be re-coloured
 * without a copy. A fainter shade is `color-mix(in_srgb,var(--ng-gold)_30%,transparent)`
 * (Tailwind's `/30` does nothing on a variable).
 */
export interface NightGlassColors {
  /** Outlines, headings, accents. */
  gold: string;
  /** The brighter gold: pills, captions, sparks. */
  bright: string;
  /** The strongest text. */
  ink: string;
  /** Running text. */
  body: string;
  /** Quieter lines. */
  muted: string;
  /** The cards' glass. */
  card: string;
  /** The darkest panels, inside a card. */
  deep: string;
  /** A coloured light at the top of a card. */
  glow: string;
}

export const NIGHT_GLASS: NightGlassColors = {
  gold: '#e6be60',
  bright: '#ffd875',
  ink: '#fff9eb',
  body: '#e8d5b5',
  muted: '#d4c3a3',
  card: '#061229',
  deep: '#040c1e',
  glow: '#a855f7',
};

export function nightGlassVars(c: NightGlassColors): CSSProperties {
  return {
    '--ng-gold': c.gold,
    '--ng-bright': c.bright,
    '--ng-ink': c.ink,
    '--ng-body': c.body,
    '--ng-muted': c.muted,
    '--ng-card': c.card,
    '--ng-deep': c.deep,
    '--ng-glow': c.glow,
  } as CSSProperties;
}
