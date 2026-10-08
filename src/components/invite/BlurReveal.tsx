'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';

const blurIn = {
  hidden: { opacity: 0, y: 18, scale: 0.94, filter: 'blur(12px)' },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.slow * 1.6, ease: EASE.entrance },
  },
};

/**
 * Text that comes into focus: it starts soft, small and a little low, then
 * sharpens and settles. For names, which want an entrance of their own rather
 * than `RevealLine`'s rise out of a clip. Like `RevealLine` it is a motion child
 * with hidden/shown variants, so put it inside a motion group (`lineGroup(…)`
 * with `animate="shown"`) and it joins that group's stagger.
 */
export function BlurReveal({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <m.span variants={blurIn} className={`block ${className}`}>
      {children}
    </m.span>
  );
}
