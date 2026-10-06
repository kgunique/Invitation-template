/**
 * Motion tokens. The design system artifact cannot hold a motion family, so
 * these live in code and are mirrored in motion.css for the CSS side.
 * Change a value here AND there, or the two layers drift out of step.
 */

/** Seconds, because that is what Framer Motion takes. */
export const DURATION = {
  instant: 0.12,
  quick: 0.22,
  base: 0.4,
  slow: 0.7,
  gate: 1.5,
} as const;

/** Cubic beziers as coefficient tuples. */
export const EASE = {
  /** Most UI transitions: fast out, settles gently. */
  standard: [0.2, 0, 0, 1],
  /** Things arriving on screen. */
  entrance: [0, 0, 0.2, 1],
  /** Things leaving. Quicker than they arrived. */
  exit: [0.4, 0, 1, 1],
  /** The gate camera push. Slow start, long glide. */
  gate: [0.4, 0.02, 0.18, 1],
} as const;

/** How far something travels on a reveal, in px. */
export const TRAVEL = { sm: 8, md: 16, lg: 28 } as const;

/** Stagger between siblings in an orchestrated group, in seconds. */
export const STAGGER = { tight: 0.05, base: 0.09, loose: 0.16 } as const;
