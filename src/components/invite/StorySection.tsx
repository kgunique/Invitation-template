'use client';

import { Fragment, type ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteMilestone } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { fadeUp, lineGroup, RevealLine } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';
import { WireLink } from './WireLink';

// How much of the screen's height the couple stand: they are pinned to its foot.
const PINNED = '66svh';

// The gap between two cards, which the wires span.
const WIRE = 44;

const header = lineGroup(0.1);

// A card slides in from the right, where the column is.
const cardIn = {
  hidden: { opacity: 0, x: 44 },
  shown: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

// The couple step in from the left edge they are cut off by.
const coupleIn = {
  hidden: { opacity: 0, x: -48 },
  shown: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE.entrance } },
};

export interface StorySectionProps {
  /** The milestones, in order, each a card. */
  milestones: InviteMilestone[];
  /** The couple's illustration: a transparent PNG/WebP of the pair standing side by side, any size. Omit and a labelled placeholder is drawn. */
  image?: string;
  /** What it shows, for screen readers. */
  imageAlt?: string;
  /** Where the picture's box sits and how wide it is: Tailwind classes for an absolutely placed box at the foot of the pinned column (the column is 64% of the section wide). The default pushes a pair standing side by side off the left edge so the one on the right, and both faces, stay clear of the cards. Re-tune for art with another composition. */
  imageClassName?: string;
  /** What the placeholder says when there is no `image`. */
  placeholder?: string;
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  /** Artwork printed on the paper behind everything (`LineArtBackdrop`, say): it fills the section. */
  backdrop?: ReactNode;
  /** Hang two glowing golden wires between each card and the next. */
  wires?: boolean;
  /** What the cards are filled with: any CSS background. Defaults to a translucent wash of `colors.raised`. */
  cardBackground?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own paper. */
  background?: string;
  /** Palette. */
  colors?: Partial<SectionColors>;
}

/**
 * "How we met": a title over a column of milestone cards down the right of the
 * screen — a year in gold italic, a bold heading, a justified paragraph, each
 * card frosted so the printed paper shows through — and the couple's
 * illustration standing at the left, cut off by the screen's edge and tucked
 * behind the cards. The illustration is pinned to the bottom of the screen
 * (`position: sticky`) while the cards scroll past it, and comes to rest at the
 * foot of the last card. Reveals on scroll: the header lines rise, each card
 * slides in from the right as it arrives, the couple step in from the left.
 *
 * Sticky needs every ancestor to leave overflow alone (`hidden` would stop it),
 * so this section clips sideways with `overflow-x: clip` and so must the page
 * around it.
 */
export function StorySection({
  milestones,
  image,
  imageAlt = 'The couple',
  imageClassName = '-left-[46%] w-[140%]',
  placeholder = 'Couple Vector',
  eyebrow = 'Our Journey',
  title = 'How We Met',
  backdrop,
  wires = true,
  cardBackground,
  background = 'transparent',
  colors,
}: StorySectionProps) {
  const card = cardBackground ?? 'color-mix(in srgb, var(--surface-raised) 72%, transparent)';

  return (
    <section
      style={{ ...sectionVars(colors), background, overflowX: 'clip' }}
      className="relative pb-20 pt-16"
    >
      {backdrop}

      <m.div
        variants={header}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        className="relative flex flex-col items-center px-5 text-center"
      >
        <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-4">
          <RevealLine className="display-xl italic text-invite-ink">{title}</RevealLine>
        </div>
      </m.div>

      <div className="relative mt-12">
        {/* The couple: an absolute column the height of the cards, with a box in it
            that is pinned to the foot of the screen while the cards scroll (and
            stops at the foot of the last card). It holds the picture. */}
        <aside aria-hidden={!image} className="pointer-events-none absolute inset-y-[0] left-[0] w-[64%]">
          <div className="sticky" style={{ top: `calc(100svh - ${PINNED})`, height: `min(${PINNED}, 100%)` }}>
            <m.div
              variants={coupleIn}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.2 }}
              className={`absolute bottom-[0] h-full ${imageClassName}`}
            >
              {image ? (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 480px) 480px, 140vw"
                  className="object-contain object-left-bottom"
                />
              ) : (
                <div className="flex h-full items-end pl-[16%]">
                  <div
                    className="flex h-[86%] w-[58%] items-center justify-center rounded-t-pill border-2 border-dashed px-2 text-center"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--invite-metal) 45%, transparent)',
                      background: 'color-mix(in srgb, var(--invite-metal) 8%, transparent)',
                    }}
                  >
                    <span className="display-md italic text-invite-metal">{placeholder}</span>
                  </div>
                </div>
              )}
            </m.div>
          </div>
        </aside>

        <ol className="relative ml-[34%] mr-4">
          {milestones.map((item, i) => (
            <Fragment key={`${item.year}-${item.title}`}>
              {i > 0 && (wires ? <WireLink height={WIRE} /> : <li aria-hidden style={{ height: 12 }} />)}
              <m.li
                variants={cardIn}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.35 }}
                className="rounded-md border p-4 shadow-sm backdrop-blur-sm"
                style={{ background: card, borderColor: 'color-mix(in srgb, var(--invite-metal) 20%, transparent)' }}
              >
                <p className="display-md italic text-invite-metal" style={{ fontWeight: 400 }}>
                  {item.year}
                </p>
                <p className="body mt-1 font-bold text-invite-ink" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.title}
                </p>
                <p
                  lang="en"
                  className="body-sm mt-2 text-ink-body"
                  style={{ textAlign: 'justify', hyphens: 'auto' }}
                >
                  {item.text}
                </p>
              </m.li>
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
