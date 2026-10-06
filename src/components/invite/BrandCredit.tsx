'use client';

import Link from 'next/link';
import { m } from 'motion/react';
import { BRAND_NAME } from '@/content/site';
import { DURATION, EASE } from '@/styles/motion';
import { HeartIcon } from './icons';
import { RevealLine, fadeUp } from './RevealLines';

const pop = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

export interface BrandCreditProps {
  /** The beating heart above the credit. */
  heart?: boolean;
  /** A smaller brand name (for a credit tucked inside a frame). */
  compact?: boolean;
}

/**
 * "Designed with Love by {BRAND_NAME}": an optional beating heart, the tracked
 * line, and the brand in the festive face, linking to the site. It is the
 * closing credit of every invite, so it lives here once.
 *
 * It renders as a fragment of motion children, so put it inside a motion group
 * (`variants={lineGroup(…)}` with `whileInView="shown"`) and it joins that
 * group's stagger; centre it with `text-center` on the parent. Colours: the
 * tracked text is `--ink-muted`, the brand `--invite-metal`, the heart rani —
 * the section around it decides the first two.
 */
export function BrandCredit({ heart = true, compact = false }: BrandCreditProps) {
  return (
    <>
      {heart && (
        <m.span variants={pop} className="mt-6 inline-block text-rani-500">
          {/* HeartIcon is an outline; the arbitrary variant fills it. */}
          <span className="amb-beat block [&_svg]:[fill:currentColor]">
            <HeartIcon className="h-[30px] w-[30px]" />
          </span>
        </m.span>
      )}

      <div className={heart ? 'mt-4' : ''}>
        <RevealLine className="body-sm font-bold uppercase tracking-[0.2em] text-ink-muted">
          Designed with Love
        </RevealLine>
      </div>
      <m.p variants={fadeUp} className="mt-1">
        <span className="caption mr-2 uppercase tracking-[0.2em] text-ink-muted">by</span>
        <Link href="/" target="_blank" className={`${compact ? 'festive-md' : 'festive-xl'} text-invite-metal`}>
          {BRAND_NAME}
        </Link>
      </m.p>
    </>
  );
}
