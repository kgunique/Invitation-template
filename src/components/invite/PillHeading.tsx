'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { fadeUp, lineGroup } from './RevealLines';

const group = lineGroup(0.1);

export interface PillHeadingProps {
  eyebrow?: string;
  /** The small ornament in the pill. */
  eyebrowIcon?: ReactNode;
  /** Draw the eyebrow as plain tracked text in the accent colour, without the pill round it. */
  plainEyebrow?: boolean;
  title: string;
  subtitle?: string;
  /** The faces for the title and for the pill and subtitle (see `hindiFonts.ts` for Hindi). */
  displayClassName?: string;
  bodyClassName?: string;
  /** The pill's colour (and its outline), the title's, and the subtitle's: any CSS colours. */
  accent?: string;
  line?: string;
  ink?: string;
  body?: string;
}

/**
 * The opening of a section: a small pill (white, softly outlined, a tracked line in the accent colour), a large
 * serif title and a short subtitle, rising one after another as they scroll into view. The words, the faces and
 * the colours are props, so it serves any language.
 */
export function PillHeading({
  eyebrow,
  eyebrowIcon,
  plainEyebrow = false,
  title,
  subtitle,
  displayClassName = '',
  bodyClassName = '',
  accent = '#0f77b5',
  line = '#cfe6f5',
  ink = '#1c2540',
  body = '#3d4966',
}: PillHeadingProps) {
  return (
    <m.div
      variants={group}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      {eyebrow && (
        <m.span
          variants={fadeUp}
          className={`${bodyClassName} inline-flex items-center gap-2 text-[13px] font-semibold ${plainEyebrow ? 'tracking-[0.22em]' : 'rounded-pill border bg-white px-5 py-[7px] tracking-[0.1em] shadow-sm'}`}
          style={plainEyebrow ? { color: accent } : { color: accent, borderColor: line }}
        >
          {eyebrowIcon}
          {eyebrow}
        </m.span>
      )}
      <m.h2 variants={fadeUp} className={`${displayClassName} mt-5 text-[32px] font-semibold leading-[1.3]`} style={{ color: ink }}>
        {title}
      </m.h2>
      {subtitle && (
        <m.p variants={fadeUp} className={`${bodyClassName} mt-2 max-w-[32ch] text-[15px] leading-[1.7]`} style={{ color: body }}>
          {subtitle}
        </m.p>
      )}
    </m.div>
  );
}
