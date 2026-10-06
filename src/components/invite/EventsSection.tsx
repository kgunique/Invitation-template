'use client';

import { Fragment } from 'react';
import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { EventCard, type EventScene } from './EventCard';
import { GoldDivider } from './GoldDivider';
import { HangingDiyas, type HangingDiyasColors } from './HangingDiyas';
import { LineArtBackdrop } from './LineArtBackdrop';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const group = lineGroup(0.2);

export interface EventsSectionProps {
  events: InviteEvent[];
  /** IANA zone the times are shown in. */
  timeZone?: string;
  /** The art for the cards, by name: an event whose `art` names one gets it. An event without one (or with a name not here) takes the scenes in turn, in this object's order. */
  scenes?: Record<string, EventScene>;
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  /** The lamps hanging over the heading: colours, or `false` to leave them out. */
  diyas?: false | Partial<HangingDiyasColors>;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own paper. */
  background?: string;
  /** Palette. */
  colors?: Partial<SectionColors>;
}

/**
 * "Wedding events": a heading under lamps that hang from the top of the section
 * and sway left and right (`HangingDiyas`), a very faint shadow of palm leaves
 * across the paper, then one card for each event (`EventCard`), each dressed
 * in its own artwork (`scenes`) and parted from the next by a small gold
 * divider. The heading rises line by line as it scrolls into view and each card
 * rises on its own turn. Every card is the same height. Palette, background and lamp colours are props.
 */
export function EventsSection({
  events,
  timeZone = 'Asia/Kolkata',
  scenes = {},
  eyebrow = 'The Celebration',
  title = 'Wedding Events',
  diyas = {},
  background = 'transparent',
  colors,
}: EventsSectionProps) {
  const names = Object.keys(scenes);

  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden pb-24">
      {/* The paper is printed with paisleys and flowers, fading in below the heading. */}
      <LineArtBackdrop ornaments={false} fadeFrom={150} opacity={0.15} color="var(--invite-metal)" />

      {/* The shadow of palm leaves, far too faint to be a picture. */}
      <svg
        aria-hidden
        viewBox="0 0 200 260"
        className="pointer-events-none absolute -left-[6%] top-[60px] h-[260px] w-[200px]"
        style={{ filter: 'blur(3px)' }}
        fill="#5f8a5a"
        fillOpacity="0.08"
      >
        <path d="M-10 250C30 190 70 110 150 40C130 110 90 190 40 262Z" />
        <path d="M20 262C70 210 120 160 196 120C170 170 120 230 70 270Z" />
        <path d="M-20 200C10 150 40 100 90 50C80 100 50 160 10 220Z" />
      </svg>

      {diyas && <HangingDiyas colors={diyas} className="absolute inset-x-[0] top-[0] h-auto w-full" />}

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        className="relative flex flex-col items-center px-5 pt-[116px] text-center"
      >
        <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-4">
          <RevealLine className="display-lg italic text-invite-ink">{title}</RevealLine>
        </div>
      </m.div>

      <div className="relative mt-12 px-3">
        {events.map((event, i) => (
          <Fragment key={`${event.startsAt}-${event.title}`}>
            {i > 0 && (
              <m.div
                variants={group}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 1 }}
                className="my-8"
              >
                <GoldDivider />
              </m.div>
            )}
            <EventCard
              event={event}
              index={i}
              timeZone={timeZone}
              scene={scenes[event.art ?? ''] ?? (names.length ? scenes[names[i % names.length]] : undefined)}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
