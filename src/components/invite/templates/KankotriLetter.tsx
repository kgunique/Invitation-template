'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { GoldDivider } from '../GoldDivider';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { TornEdge } from '../TornEdge';

const ARCH_IMAGE = '/art/couple/floral-archway-with-lilac-peach-blossoms.png';

// Same reasoning as the hero: this is a light paper sheet whatever the visitor's
// OS theme, so its ink is pinned.
const LETTER_COLORS = {
  '--invite-ink': '#2a1b3d',
  '--ink-body': '#574263',
  '--invite-metal': '#c08a2e',
} as CSSProperties;

const arch = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE.entrance } },
};

const letterGroup = lineGroup(0.2);

export interface KankotriLetterProps {
  /** The archway (or any frame) the text is set in: a transparent PNG/WebP,
   * 4:3, with an opening for the heading near the top. */
  image?: string;
  /** Heading, one entry per line. */
  heading?: string[];
  /** Body, one entry per paragraph (each fades up in turn). */
  paragraphs?: string[];
}

/**
 * "Dear friends and family" note, set inside a floral archway on a cream
 * sheet. The hero's white page lies over it and is torn along its bottom edge,
 * so the white space under the picture reads as the torn paper itself rather
 * than as a gap. Reveals on scroll: arch first, then the heading line by line,
 * the paragraphs, and last the gold divider drawing outward from its diamond.
 */
export function KankotriLetter({
  image = ARCH_IMAGE,
  heading =['Dear Friends and', 'Family,'],
  paragraphs = [
    'As we get ready to say “I do,” we feel grateful for the wonderful people in our lives.',
    'Your support means the world to us, and we would be honored to have you with us as we begin our life together.',
  ],
}: KankotriLetterProps) {
  return (
    // -mt-16 pulls the section up over the hero's 64px bottom padding, so the
    // tear lands right under the picture instead of far below it.
    // The cream fades to white over its last 64px, so the white countdown
    // section below it begins without a hard line.
    <section
      style={{ ...LETTER_COLORS, background: 'linear-gradient(to bottom, #fbf7ef calc(100% - 64px), #ffffff)' }}
      className="relative -mt-16 overflow-hidden"
    >
      {/* The torn white sheet: the hero's white, so it merges upward with no seam,
          and the shadow falls on the cream below. */}
      <TornEdge sheet="#ffffff" rim="#efe5d3" />

      {/* pt-16: starts the arch below the deepest bite of the tear. pb-20 also
          leaves the divider clear of the floating bar if this is ever the last
          section on the page. */}
      <div className="relative pb-20 pt-16">
        <m.div
          variants={letterGroup}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.25 }}
          className="relative mx-auto w-full max-w-[480px] text-center"
        >
          {/* The arch dissolves toward its base — legs and the artwork's own
              mist cloud (a mint blob that would sit behind the paragraph)
              included — so the text can run past the frame instead of off a
              cliff. */}
          <m.div
            variants={arch}
            className="relative aspect-[4/3] w-full"
            style={{
              maskImage: 'linear-gradient(to bottom, #000 56%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 56%, transparent 90%)',
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 480px) 480px, 100vw"
              className="object-contain"
            />
          </m.div>

          {/* Pulled up so the heading starts inside the arch opening, under
              the hanging ornament (-45% of the column width = 30% of it). */}
          <div className="relative -mt-[45%] px-[15%]">
            {heading.map((line) => (
              <RevealLine key={line} className="display-lg text-invite-ink">
                {line}
              </RevealLine>
            ))}

            <div className="mt-5 space-y-2">
              {paragraphs.map((text) => (
                <m.p key={text} variants={fadeUp} className="body text-ink-body">
                  {text}
                </m.p>
              ))}
            </div>

            <GoldDivider className="mt-8" />
          </div>
        </m.div>
      </div>
    </section>
  );
}
