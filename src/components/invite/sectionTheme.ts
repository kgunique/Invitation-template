import type { CSSProperties } from 'react';

/**
 * The colours a section needs, as one small object, so the same section can sit
 * on a cream page or a night sky without a copy. A section calls
 * `sectionVars(colors)` on its root: that pins the CSS variables the shared
 * pieces read (`text-invite-ink`, `text-ink-body`, `bg-surface-raised`,
 * `border-line-firm`, `text-signal-danger`…), which also stops an OS-dark visitor
 * getting dark tokens on a light page.
 *
 * The defaults are the cream/plum look the Silver sections were made with, so a
 * section that gets no `colors` looks exactly as it always did.
 */
export interface SectionColors {
  /** Headings and the strongest text. */
  ink: string;
  /** Running text. */
  body: string;
  /** Captions and placeholders. */
  muted: string;
  /** The gold: eyebrows, accents, outlines. */
  accent: string;
  /** Cards and inputs. */
  raised: string;
  /** Borders on inputs and cards. */
  line: string;
  /** Validation errors. */
  danger: string;
}

export const LIGHT_SECTION: SectionColors = {
  ink: '#2a1b3d',
  body: '#574263',
  muted: '#74627f',
  accent: '#c08a2e',
  raised: '#ffffff',
  line: '#e2caa4',
  danger: '#c0392b',
};

export function sectionVars(colors?: Partial<SectionColors>): CSSProperties {
  const c = { ...LIGHT_SECTION, ...colors };
  return {
    '--invite-ink': c.ink,
    '--ink-strong': c.ink,
    '--ink-body': c.body,
    '--ink-muted': c.muted,
    '--invite-metal': c.accent,
    '--surface-raised': c.raised,
    '--line-firm': c.line,
    '--signal-danger': c.danger,
  } as CSSProperties;
}
