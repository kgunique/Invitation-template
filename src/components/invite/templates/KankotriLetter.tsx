'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { GoldDivider } from '../GoldDivider';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';

const ARCH_IMAGE = '/art/couple/floral-archway-with-lilac-peach-blossoms.png';

/** Deterministic 0..1 hash of an integer — integer ops only, so the server
 * and every browser engine produce byte-identical clip-paths (no Math.random,
 * and no Math.sin, whose last bits can differ between engines). */
function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/** Smooth 1-D value noise in -0.5..0.5: random lattice values, eased between. */
function noise(t: number, freq: number, seed: number) {
  const p = t * freq;
  const i = Math.floor(p);
  const f = p - i;
  const u = f * f * (3 - 2 * f);
  const a = hash(i + seed * 7919);
  const b = hash(i + 1 + seed * 7919);
  return a + (b - a) * u - 0.5;
}

/** A ragged BOTTOM edge as a clip-path polygon (flat top, torn bottom). Four
 * octaves of smooth noise — broad swells down to a fine fibre fray — so it
 * wanders like real torn paper rather than repeating like a saw. `base` is the
 * mean depth of the tear in px; `amp` is how far it strays either side. */
function tornBottom(seed: number, base: number, amp: number, steps = 160) {
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const wander =
      noise(t, 6, seed) + 0.55 * noise(t, 17, seed + 1) + 0.3 * noise(t, 47, seed + 2) + 0.15 * noise(t, 130, seed + 3);
    points.push(`${(t * 100).toFixed(2)}% ${(base + amp * wander).toFixed(1)}px`);
  }
  // Top corners first, then the ragged edge back from right to left.
  return `polygon(0% 0px, 100% 0px, ${points.reverse().join(', ')})`;
}

// The hero's white page, torn: SHEET_EDGE is the white's own tear (about 4–44px
// deep in a 48px band); RIM_EDGE is the paper's darker fibrous core, torn ~5px
// lower with its own noise, so a thin uneven band of it shows under the white
// along the whole edge.
const SHEET_EDGE = tornBottom(1, 24, 20);
const RIM_EDGE = tornBottom(5, 29, 20);

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
      {/* The torn white sheet. The shadow filter is on this wrapper, not the
          clipped layers: a filter on the same element as a clip-path would be
          clipped away with it. The sheet's white is the hero's white, so it
          merges upward with no seam and the shadow falls on the cream below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[0] top-[0] h-[56px]"
        style={{ filter: 'drop-shadow(0 4px 5px rgba(74, 50, 30, 0.22))' }}
      >
        <div
          className="absolute inset-x-[0] top-[0] h-[56px]"
          style={{ clipPath: RIM_EDGE, background: '#efe5d3' }}
        />
        <div
          className="absolute inset-x-[0] top-[0] h-[50px]"
          style={{ clipPath: SHEET_EDGE, background: '#ffffff' }}
        />
      </div>

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
