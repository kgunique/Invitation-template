'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE, STAGGER } from '@/styles/motion';

/**
 * Line-by-line reveal: each line rises out of its own clip, one after the
 * next. Put the lines inside any motion element whose `variants` is
 * `lineGroup(...)` and whose `animate` (or `whileInView`) flips to "shown";
 * other motion children with hidden/shown variants join the same stagger.
 * The step is deliberately wide (2x the loose stagger) so each line reads as
 * its own beat rather than a ripple.
 */
export function lineGroup(delayChildren = 0) {
  return {
    hidden: {},
    shown: { transition: { staggerChildren: STAGGER.loose * 2, delayChildren } },
  };
}

export const lineRise = {
  hidden: { y: '115%' },
  shown: { y: '0%', transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

/** For blocks that aren't a single line (a paragraph, a card): a short rise
 * and fade that joins the same stagger as the lines around it. */
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

/** One line of text, clipped so it can rise into view. The padding/negative
 * margin pair widens the clip box (display type has a tight line-height that
 * would otherwise shave ascenders and descenders) without moving the layout. */
export function RevealLine({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className="-my-2 block overflow-hidden py-2">
      <m.span variants={lineRise} className={`block ${className}`}>
        {children}
      </m.span>
    </span>
  );
}
