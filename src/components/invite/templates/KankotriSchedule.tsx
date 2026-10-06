'use client';

import type { CSSProperties } from 'react';
import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { formatDay, formatTime } from '../dates';
import { GoldDivider } from '../GoldDivider';
import { ArrowUpRightIcon, PinIcon } from '../icons';
import { Medallion } from '../Medallion';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';

// Cream paper whatever the visitor's OS theme, so its ink is pinned (same
// reasoning as the hero, the letter and the countdown).
const SECTION_COLORS = {
  '--invite-ink': '#2a1b3d',
  '--ink-body': '#574263',
  '--ink-muted': '#74627f',
  '--invite-metal': '#c08a2e',
  '--surface-raised': '#ffffff',
  '--pill-neutral': '#ece8e1',
} as CSSProperties;

// One accent per event, cycling: marigold, mehendi, lilac, rose.
const ACCENTS = ['#c9a24a', '#6f9a6a', '#8a6bbf', '#b4586a'];

const group = lineGroup(0.2);

// Each event is one stagger step; inside it the card slides in and its
// medallion pops a beat later.
const row = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.14 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -24 },
  shown: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const pop = {
  hidden: { opacity: 0, scale: 0.6 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const drawDown = {
  hidden: { scaleY: 0 },
  shown: { scaleY: 1, transition: { duration: 1.4, ease: EASE.standard } },
};

const mapsUrl = (place: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

export interface KankotriScheduleProps {
  events: InviteEvent[];
  /** Shown as the gold line above the title; falls back to the first event's day. */
  weddingDate?: string;
  /** IANA zone the dates and times are shown in. */
  timeZone?: string;
}

/**
 * "Schedule of events": a heading block, then one card per event down the left
 * (accent bar, date and time pills, title, description, map link) with a
 * vertical timeline and an icon medallion per event down the right. Reveals on
 * scroll: heading lines rise, the timeline draws downward, then each event
 * slides in with its medallion popping a beat after.
 */
export function KankotriSchedule({ events, weddingDate, timeZone = 'Asia/Kolkata' }: KankotriScheduleProps) {
  return (
    <section
      style={{ ...SECTION_COLORS, background: 'linear-gradient(to bottom, #ffffff, #fbf7ef 72px)' }}
      className="relative overflow-hidden px-5 pb-24 pt-16"
    >
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-[420px]"
      >
        <div className="text-center">
          <m.p variants={fadeUp} className="label uppercase text-invite-metal">
            {formatDay(weddingDate ?? events[0].startsAt, timeZone)}
          </m.p>
          <div className="mt-3">
            <RevealLine className="display-xl text-invite-ink">Schedule of</RevealLine>
            <RevealLine className="display-xl text-invite-ink">Events</RevealLine>
          </div>
          <m.p variants={fadeUp} className="caption mt-3 uppercase tracking-[0.2em] text-ink-muted">
            An unforgettable celebration awaits
          </m.p>
          <GoldDivider className="mt-6" />
        </div>

        <div className="relative mt-10">
          {/* The timeline: one line behind every medallion, centred in the
              88px right-hand column. */}
          <m.span
            aria-hidden
            variants={drawDown}
            className="absolute bottom-[50px] right-[43px] top-[50px] w-[2px] origin-top"
            style={{ background: 'linear-gradient(to bottom, transparent, #d9d2de 8%, #d9d2de 92%, transparent)' }}
          />

          <ul className="space-y-6">
            {events.map((event, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const cut = event.place.lastIndexOf(' ') + 1;
              const place = { head: event.place.slice(0, cut), tail: event.place.slice(cut) };
              return (
                <m.li
                  key={`${event.startsAt}-${event.title}`}
                  variants={row}
                  className="grid grid-cols-[1fr_88px] items-center gap-3"
                >
                  <m.div variants={slideIn} className="flex gap-3 text-left">
                    <span
                      aria-hidden
                      className="w-[4px] shrink-0 self-stretch rounded-pill"
                      style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="caption rounded-pill bg-[var(--pill-neutral)] px-3 py-1 font-bold uppercase tracking-[0.08em] text-invite-ink">
                          {formatDay(event.startsAt, timeZone, 'short')}
                        </span>
                        <span
                          className="caption rounded-pill px-3 py-1 font-bold tracking-[0.08em]"
                          style={{ color: `color-mix(in srgb, ${accent} 70%, #2a1b3d)`, background: tint(accent, 16) }}
                        >
                          {formatTime(event.startsAt, timeZone)}
                        </span>
                      </div>

                      <p className="display-md mt-3 text-invite-ink">{event.title}</p>
                      <p className="body-sm mt-1 text-ink-body">{event.description}</p>

                      <a
                        href={mapsUrl(event.place)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${event.place} on Google Maps (opens in a new tab)`}
                        className="caption mt-2 inline-block font-bold text-invite-metal"
                      >
                        {/* Inline icons, not a flex row: a long place name wraps, and the
                            arrow should follow its last word, not sit at the far edge or
                            wrap onto a line of its own (hence the nowrap tail). */}
                        <PinIcon className="mr-1 inline h-[12px] w-[12px] align-[-2px]" />
                        {place.head}
                        <span className="whitespace-nowrap">
                          {place.tail}
                          <ArrowUpRightIcon className="ml-1 inline h-[12px] w-[12px] align-[-2px]" />
                        </span>
                      </a>
                    </div>
                  </m.div>

                  <m.div variants={pop}>
                    <Medallion accent={accent} phase={i}>
                      {event.icon}
                    </Medallion>
                  </m.div>
                </m.li>
              );
            })}
          </ul>
        </div>
      </m.div>
    </section>
  );
}
