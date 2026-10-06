'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { GoldDivider } from '../GoldDivider';
import { MarryMeCredit } from '../MarryMeCredit';
import { lineGroup } from '../RevealLines';

// Warm cream whatever the visitor's OS theme, so its ink is pinned (same
// reasoning as the sections above it).
const SECTION_COLORS = {
  '--invite-ink': '#2a1b3d',
  '--ink-muted': '#74627f',
  '--invite-metal': '#c08a2e',
} as CSSProperties;

const group = lineGroup(0.1);

// Each bouquet rises into its corner from slightly outside it.
const bloom = (x: number) => ({
  hidden: { opacity: 0, y: 48, x },
  shown: { opacity: 1, y: 0, x: 0, transition: { duration: 1.1, ease: EASE.entrance } },
});

/**
 * The last thing on the page: the shared <MarryMeCredit /> (a beating heart,
 * "Designed with Love by Marry Me"), and a bouquet in each bottom corner that
 * rises in and then sways. The
 * bottom padding is the clearance for the floating Order Now bar, so the credit
 * is never left sitting under it.
 */
export function KankotriClosing() {
  return (
    <section
      style={{ ...SECTION_COLORS, background: 'linear-gradient(to bottom, #fbf7ef, #f6ecd9)' }}
      className="relative overflow-hidden px-5 pt-4"
    >
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto w-full max-w-[420px] pb-[200px] text-center"
      >
        <GoldDivider />

        <MarryMeCredit />

        <m.div variants={bloom(-32)} aria-hidden className="pointer-events-none absolute bottom-[0] -left-5">
          <div className="amb-sway" style={{ animationDuration: '8s' }}>
            <Image
              src="/art/floral/hero-floral-left.webp"
              alt=""
              width={340}
              height={340}
              className="h-[170px] w-auto -scale-y-100"
            />
          </div>
        </m.div>
        <m.div variants={bloom(32)} aria-hidden className="pointer-events-none absolute bottom-[0] -right-5">
          <div className="amb-sway" style={{ animationDuration: '10s', animationDelay: '-3s' }}>
            <Image src="/art/floral/floral-corner.webp" alt="" width={340} height={340} className="h-[170px] w-auto" />
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
