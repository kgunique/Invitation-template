'use client';

import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Wraps the invite tree once.
 *
 * `domAnimation` is the small feature bundle — transforms, opacity, variants,
 * gestures — rather than the full `domMax`. Layout animations and drag-to-
 * reorder are not in it, and this product does not need them.
 *
 * `strict` makes `motion.div` throw at runtime, forcing every call site to use
 * `m.div`. That is the point: importing `motion` would pull the whole bundle
 * back in and quietly undo the saving. The strict flag is what keeps it honest.
 *
 * `reducedMotion="user"` makes every Framer Motion animation respect the OS
 * setting. The CSS ambient loops are handled by the media query in motion.css.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
