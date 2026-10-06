'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { DURATION, EASE, TRAVEL, STAGGER } from '@/styles/motion';

/**
 * Scroll reveal. INTERACTIVE — it depends on where the viewer has scrolled, so
 * it belongs to Framer Motion rather than CSS.
 *
 * `once` is deliberate: an invite is read top to bottom, and re-animating a
 * section when someone scrolls back up is distracting.
 *
 * The section is visible in the page source and only the transform is animated,
 * so nothing is stranded at opacity 0 if the observer never fires.
 */
export function Reveal({
  children,
  delay = 0,
  travel = TRAVEL.md,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  travel?: number;
  as?: 'div' | 'section';
}) {
  const Tag = as === 'section' ? m.section : m.div;
  return (
    <Tag
      initial={{ opacity: 0, y: travel }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: '0px 0px -10% 0px' }}
      transition={{ duration: DURATION.slow, ease: EASE.entrance, delay }}
    >
      {children}
    </Tag>
  );
}

/** Parent for a group whose children arrive one after another. */
export function RevealGroup({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ shown: { transition: { staggerChildren: STAGGER.base } } }}
    >
      {children}
    </m.div>
  );
}

/** Child of RevealGroup. Timing comes from the parent, not from a hand-set delay. */
export function RevealItem({ children }: { children: ReactNode }) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: TRAVEL.md },
        shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
      }}
    >
      {children}
    </m.div>
  );
}
