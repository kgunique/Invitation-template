'use client';

import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { formatDay, formatTime } from './dates';
import { GoldDivider } from './GoldDivider';
import { PinIcon } from './icons';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const group = lineGroup(0.2);

const mix = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;

// Round on top like a doorway, softly square below.
const ARCH = '120px 120px 28px 28px';
const ARCH_INNER = '114px 114px 22px 22px';

// One event: its node pops, then its card rises, as it scrolls into view.
const item = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.18 } },
};

const node = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const card = {
  hidden: { opacity: 0, y: 44, scale: 0.96 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE.entrance } },
};

const drawDown = {
  hidden: { scaleY: 0 },
  shown: { scaleY: 1, transition: { duration: 2, ease: EASE.standard } },
};

const mapsUrl = (place: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export interface ArchTimelineProps {
  events: InviteEvent[];
  /** Shown as the gold line above the title; falls back to the first event's day. */
  weddingDate?: string;
  /** IANA zone the dates and times are shown in. */
  timeZone?: string;
  title?: string;
  /** The tracked line under the title. */
  subtitle?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own sky. */
  background?: string;
  /** Palette. Defaults to the Silver cream/plum; a night page passes its own. */
  colors?: Partial<SectionColors>;
}

/**
 * A schedule as a timeline: a heading block, then a thin vertical line with a
 * node on it for each event, and under each node an arch-topped card — icon,
 * time, title, place (a Google Maps link) and a line about it. Each event
 * reveals as it scrolls into view: the line draws down, the node pops, the card
 * rises. The cards are solid (the palette's `raised`), so the line runs behind
 * them and shows only between. Times are 12-hour. All of it follows `colors`.
 */
export function ArchTimeline({
  events,
  weddingDate,
  timeZone = 'Asia/Kolkata',
  title = 'Schedule of Events',
  subtitle = 'An unforgettable celebration awaits',
  background = 'transparent',
  colors,
}: ArchTimelineProps) {
  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-20 pt-16">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto w-full max-w-[420px] text-center"
      >
        <m.p variants={fadeUp} className="label uppercase text-invite-metal">
          {formatDay(weddingDate ?? events[0].startsAt, timeZone)}
        </m.p>
        <div className="mt-3">
          <RevealLine className="display-lg text-invite-ink">{title}</RevealLine>
        </div>
        <m.p variants={fadeUp} className="caption mt-3 uppercase tracking-[0.2em] text-ink-muted">
          {subtitle}
        </m.p>
        <GoldDivider className="mt-6" />
      </m.div>

      <ol className="relative mx-auto mt-10 w-full max-w-[420px]">
        {/* The line behind every node, from the first to the last. */}
        <m.span
          aria-hidden
          className="absolute bottom-[18px] left-1/2 top-[18px] w-[1px] origin-top -translate-x-1/2"
          style={{ background: `linear-gradient(to bottom, transparent, ${mix(40)} 6%, ${mix(40)} 94%, transparent)` }}
          variants={drawDown}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.05 }}
        />

        {events.map((event) => (
          <m.li
            key={`${event.startsAt}-${event.title}`}
            variants={item}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex flex-col items-center pb-8 last:pb-0"
          >
            <m.span
              variants={node}
              aria-hidden
              className="relative z-content flex h-[36px] w-[36px] items-center justify-center rounded-pill border bg-surface-raised"
              style={{ borderColor: mix(45) }}
            >
              <span className="block h-[8px] w-[8px] rounded-pill bg-[var(--invite-metal)]" />
            </m.span>

            <m.div
              variants={card}
              className="relative z-content mt-6 w-full max-w-[340px] border bg-surface-raised px-6 pb-8 pt-10 text-center shadow-lg"
              style={{ borderRadius: ARCH, borderColor: mix(30) }}
            >
              {/* The inner hairline of the frame. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[6px] border"
                style={{ borderRadius: ARCH_INNER, borderColor: mix(18) }}
              />

              <span
                aria-hidden
                className="relative mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-pill border text-[26px] leading-none"
                style={{ borderColor: mix(40), background: mix(12) }}
              >
                {event.icon}
              </span>

              <p className="label relative mt-5 uppercase text-invite-ink">{formatTime(event.startsAt, timeZone, true)}</p>
              <p className="display-md relative mt-2 uppercase tracking-[0.05em] text-invite-metal">{event.title}</p>
              <p aria-hidden className="caption relative mt-2 tracking-[0.5em] text-ink-muted">
                ☾ • ☽
              </p>

              <a
                href={mapsUrl(event.place)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${event.place} on Google Maps (opens in a new tab)`}
                className="caption relative mt-3 inline-block font-bold uppercase tracking-[0.1em] text-invite-metal"
              >
                <PinIcon className="mr-1 inline h-[12px] w-[12px] align-[-2px]" />
                {event.place}
              </a>

              <p className="body-sm relative mx-auto mt-3 max-w-[28ch] text-ink-body">{event.description}</p>
            </m.div>
          </m.li>
        ))}
      </ol>
    </section>
  );
}
