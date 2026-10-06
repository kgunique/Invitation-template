'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteLocation } from '@/content/invites';
import { EASE } from '@/styles/motion';
import { GoldDivider } from './GoldDivider';
import { NavigationIcon } from './icons';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';
import { Starfield } from './Starfield';

const group = lineGroup(0.2);

const frameIn = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE.entrance } },
};

const CORNERS = [
  'left-2 top-2 border-l-2 border-t-2 rounded-tl-lg',
  'right-2 top-2 border-r-2 border-t-2 rounded-tr-lg',
  'bottom-2 left-2 border-b-2 border-l-2 rounded-bl-lg',
  'bottom-2 right-2 border-b-2 border-r-2 rounded-br-lg',
] as const;

const mapsSearch = (loc: InviteLocation) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name}, ${loc.address}`)}`;

/** The placeholder when a venue has no artwork: a palace on a starlit hill,
 * drawn in the section's gold (it follows `--invite-metal`). */
function StarryVenueArt() {
  return (
    <>
      <Starfield count={36} constellations={false} color="var(--invite-metal)" />
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="absolute inset-[0] h-full w-full text-invite-metal"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* The hill. */}
        <path d="M0 200C30 170 62 152 100 120c38 32 70 50 100 80" />
        <path d="M20 200c24-22 50-34 80-52 30 18 56 30 80 52" strokeOpacity="0.5" />
        {/* The palace: a tall centre tower and two shorter ones, roofs and a flag. */}
        <rect x="90" y="70" width="20" height="52" />
        <path d="M88 70l12-20 12 20z" />
        <path d="M100 50V40M100 40l10 3-10 3" />
        <rect x="66" y="92" width="18" height="30" />
        <path d="M64 92l11-16 11 16z" />
        <rect x="116" y="92" width="18" height="30" />
        <path d="M114 92l11-16 11 16z" />
        <path d="M84 108h6M110 108h6" />
        <path d="M95 122v-10a5 5 0 0 1 10 0v10" />
        <rect x="97" y="82" width="6" height="10" rx="3" />
        {/* A crescent moon, and a few stars. */}
        <path d="M160 30A14 14 0 1 0 172 52A11 11 0 1 1 160 30Z" />
        <g fill="currentColor" stroke="none">
          <path d="M40 40l1.5 3.5L45 45l-3.5 1.5L40 50l-1.5-3.5L35 45l3.5-1.5z" />
          <path d="M130 24l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
          <path d="M176 92l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
          <path d="M24 100l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
        </g>
        <path d="M30 70l16-12 18 8" strokeOpacity="0.5" />
      </svg>
    </>
  );
}

export interface VenueSectionProps {
  location: InviteLocation;
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  buttonLabel?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own sky. */
  background?: string;
  /** Palette. Defaults to the Silver cream/plum; a night page passes its own. */
  colors?: Partial<SectionColors>;
}

/**
 * The "Location" section: a heading, the venue's artwork in a framed square
 * (an illustration or photo you pass in, or a starlit palace drawn as a
 * placeholder), the venue's name and address, and a "View on Google Maps"
 * button. Reveals on scroll: the heading lines rise, the divider draws, the
 * frame floats up, then the name, address and button fade in. All of it follows
 * `colors`.
 */
export function VenueSection({
  location,
  eyebrow = 'The Venue',
  title = 'Location',
  buttonLabel = 'View on Google Maps',
  background = 'transparent',
  colors,
}: VenueSectionProps) {
  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-20 pt-16">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-[420px] text-center"
      >
        <m.p variants={fadeUp} className="label uppercase text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-3">
          <RevealLine className="display-lg text-invite-ink">{title}</RevealLine>
        </div>
        <GoldDivider className="mt-6" />

        <m.div
          variants={frameIn}
          className="relative mx-auto mt-10 aspect-square w-full max-w-[340px] rounded-[24px] border bg-surface-raised p-3 shadow-lg"
          style={{ borderColor: 'color-mix(in srgb, var(--invite-metal) 30%, transparent)' }}
        >
          {CORNERS.map((corner) => (
            <span
              key={corner}
              aria-hidden
              className={`pointer-events-none absolute z-content h-[20px] w-[20px] border-[color-mix(in_srgb,var(--invite-metal)_55%,transparent)] ${corner}`}
            />
          ))}
          <div className="relative h-full w-full overflow-hidden rounded-[16px]">
            {location.image ? (
              <Image
                src={location.image}
                alt={location.name}
                fill
                sizes="(min-width: 480px) 340px, 90vw"
                className="object-cover"
              />
            ) : (
              <StarryVenueArt />
            )}
          </div>
        </m.div>

        <m.p variants={fadeUp} className="display-md mt-8 uppercase tracking-[0.08em] text-invite-metal">
          {location.name}
        </m.p>
        <m.p variants={fadeUp} className="body mx-auto mt-2 max-w-[30ch] text-ink-body">
          {location.address}
        </m.p>

        <m.div variants={fadeUp} className="mt-8">
          <a
            href={location.mapsUrl ?? mapsSearch(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="action inline-flex items-center gap-2 rounded-pill border border-[color-mix(in_srgb,var(--invite-metal)_40%,transparent)] bg-[color-mix(in_srgb,var(--invite-ink)_6%,transparent)] px-8 py-4 uppercase tracking-[0.14em] text-invite-metal"
          >
            <NavigationIcon /> {buttonLabel}
          </a>
        </m.div>
      </m.div>
    </section>
  );
}
