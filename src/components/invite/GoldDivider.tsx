'use client';

import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';

const parts = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.15 } },
};

const growLine = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const popDiamond = {
  hidden: { scale: 0 },
  shown: { scale: 1, transition: { duration: DURATION.base, ease: EASE.entrance } },
};

/** A gold line, a diamond, a line. Sits inside a motion group that animates
 * hidden -> shown and joins its stagger: the diamond pops, then the lines draw
 * outward from it. Colour comes from `--invite-metal`, so the section around it
 * decides (and pins) the gold. */
export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <m.div variants={parts} className={`flex items-center justify-center gap-2 ${className}`}>
      <m.span
        variants={growLine}
        className="block h-[1px] w-16 origin-right"
        style={{ background: 'linear-gradient(to right, transparent, var(--invite-metal))' }}
      />
      <m.span variants={popDiamond} className="block">
        <span className="block h-[8px] w-[8px] rotate-45 bg-[var(--invite-metal)]" />
      </m.span>
      <m.span
        variants={growLine}
        className="block h-[1px] w-16 origin-left"
        style={{ background: 'linear-gradient(to left, transparent, var(--invite-metal))' }}
      />
    </m.div>
  );
}
