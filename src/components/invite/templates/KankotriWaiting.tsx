'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { GoldDivider } from '../GoldDivider';
import { Petals } from '../Petals';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { SwingArt } from '../SwingArt';

// White paper (the couple illustration has a baked-in white background that
// has to melt into it), so the ink is pinned to light like the sections around.
const SECTION_COLORS = {
  '--invite-ink': '#2a1b3d',
  '--ink-body': '#574263',
  '--invite-metal': '#c08a2e',
} as CSSProperties;

const PETALS = ['#f2c879', '#d97aa0', '#e8b4c0'];

const SWING_MASK = 'linear-gradient(to bottom, transparent 0%, #000 13%)';

const group = lineGroup(0.2);

const artIn = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  shown: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.1, ease: EASE.entrance } },
};

export interface KankotriWaitingProps {
  bride: string;
  groom: string;
  /** The couple's artwork, shown whole and edge to edge. Omit and the section is text and petals. */
  image?: string;
  /** Rock the artwork forward and back like a swing (same as the hero). For swing artwork; turn off for anything else. */
  swing?: boolean;
}

/**
 * "We will wait for you": the couple's artwork under a heading, a sign-off in
 * their names, and petals drifting slowly upward behind it all. The artwork is
 * the couple on a flower swing, so it rocks forward and back like the hero's. Sits between
 * the RSVP and the closing credit — cream at both ends, white in the middle so
 * the illustration's white margins merge with the page. Reveals on scroll: the
 * heading lines rise, the divider draws, the artwork floats up into place.
 */
export function KankotriWaiting({ bride, groom, image, swing = true }: KankotriWaitingProps) {
  const picture = image && (
    <Image
      src={image}
      alt={`${bride} and ${groom}`}
      fill
      sizes="(min-width: 480px) 480px, 100vw"
      className="object-contain"
    />
  );

  return (
    <section
      style={{
        ...SECTION_COLORS,
        background: 'linear-gradient(to bottom, #fbf7ef, #ffffff 72px, #ffffff calc(100% - 96px), #fbf7ef)',
      }}
      className="relative overflow-hidden pb-24 pt-16"
    >
      <Petals color={PETALS} count={9} speed={0.55} direction="up" size={[9, 15]} />

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto w-full max-w-[480px] text-center"
      >
        <div className="px-5">
          <RevealLine className="display-xl text-invite-ink">We Will Wait</RevealLine>
          <RevealLine className="display-xl text-invite-ink">For You</RevealLine>
          <m.p variants={fadeUp} className="body mx-auto mt-4 max-w-[30ch] text-ink-body">
            Our day is incomplete without you. We will keep a seat, a smile and a place in our hearts just for you.
          </m.p>
          <GoldDivider className="mt-6" />
        </div>

        {image && (
          <m.div
            variants={artIn}
            className="relative mt-4 aspect-square w-full"
            // The ropes are cut off flat by the picture's top edge. This mask
            // dissolves their tops upward, so they read as hanging from somewhere
            // above rather than ending in a hard line under the divider.
            style={swing ? { maskImage: SWING_MASK, WebkitMaskImage: SWING_MASK } : undefined}
          >
            {swing ? <SwingArt>{picture}</SwingArt> : picture}
          </m.div>
        )}

        <m.p variants={fadeUp} className="mt-2 px-5">
          <span className="festive-md block text-invite-metal">With love,</span>
          <span className="display-lg block text-invite-ink">
            {bride} &amp; {groom}
          </span>
        </m.p>
      </m.div>
    </section>
  );
}
