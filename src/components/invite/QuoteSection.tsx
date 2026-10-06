'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const group = lineGroup(0.1);

// The scene at the foot rises into place after the words.
const rise = {
  hidden: { opacity: 0, y: 36 },
  shown: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE.entrance, delay: DURATION.slow } },
};

export interface QuoteSectionProps {
  /** The words. */
  quote: string;
  /** The tracked line under them, after a dash. */
  label?: string;
  /** Decoration standing at the card's two sides (trees, say): absolutely placed children of the card's frame, which is `relative`. */
  sides?: ReactNode;
  /** Artwork along the foot of the section, full width and flush with its bottom edge (a skyline, say). */
  scene?: ReactNode;
  /** What the card is filled with: any CSS background. Defaults to a translucent wash of `colors.raised`, so the page shows through. */
  cardBackground?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own paper. */
  background?: string;
  /** Palette. */
  colors?: Partial<SectionColors>;
}

/**
 * A pulled quote: a few lines of italic serif in a frosted, softly outlined
 * card with a tracked "— A divine promise" under them, decoration standing at
 * either side of the card, and a scene along the section's foot. Reveals on
 * scroll: the card rises, the label follows, then the scene rises behind them.
 * The sides, the scene, the card fill and the palette are all props.
 */
export function QuoteSection({
  quote,
  label = 'A Divine Promise',
  sides,
  scene,
  cardBackground,
  background = 'transparent',
  colors,
}: QuoteSectionProps) {
  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pt-16">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto w-full max-w-[360px]"
      >
        {sides}

        <m.figure
          variants={fadeUp}
          className="relative rounded-xl border px-8 py-8 text-center backdrop-blur-sm"
          style={{
            background: cardBackground ?? 'color-mix(in srgb, var(--surface-raised) 55%, transparent)',
            borderColor: 'color-mix(in srgb, var(--invite-metal) 22%, transparent)',
          }}
        >
          <blockquote className="body-lg italic text-invite-ink" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
            “{quote}”
          </blockquote>
          <figcaption className="invite-eyebrow mt-5 text-invite-metal">— {label}</figcaption>
        </m.figure>
      </m.div>

      {scene && (
        <m.div
          variants={rise}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
          className="-mx-5 mt-12"
        >
          {scene}
        </m.div>
      )}
    </section>
  );
}
