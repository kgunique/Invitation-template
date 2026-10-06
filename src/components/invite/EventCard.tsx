'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { formatTime, formatWeekdayDate } from './dates';
import { CalendarPlusIcon, ClockIcon, NavigationIcon, PinIcon } from './icons';
import { LineArtBackdrop } from './LineArtBackdrop';

const mix = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;

const rise = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE.entrance } },
};

const parts = { hidden: {}, shown: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } };
const part = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const where = (event: InviteEvent) => [event.place, event.address].filter(Boolean).join(', ');

const mapsUrl = (event: InviteEvent) =>
  event.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where(event))}`;

// An .ics file as a link, so "add to calendar" needs no server: three hours from the start.
function calendarHref(event: InviteEvent) {
  const start = new Date(event.startsAt);
  const end = new Date(start.getTime() + 3 * 3_600_000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const text = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marry Me//Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${event.title.replace(/\W+/g, '-').toLowerCase()}@marryme`,
    `DTSTAMP:${stamp(start)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${text(event.title)}`,
    `LOCATION:${text(where(event))}`,
    `DESCRIPTION:${text(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
}

export interface EventScene {
  /** Art the whole card is built around, drawn first so everything else is in front of it: a big arch the text stands inside, say. Absolutely placed children of the card, which is `relative` and clips to its rounded shape. */
  behind?: ReactNode;
  /** Art that hangs from or sits across the top of the card, drawn behind the text. */
  top?: ReactNode;
  /** Art that stands at the foot of the card, drawn in front of the text (so leave it room: `bottomSpace`). */
  bottom?: ReactNode;
  /** Room the text leaves clear at the top and at the foot for that art, in px. */
  topSpace?: number;
  bottomSpace?: number;
  /** The card's fill: any CSS background. */
  background?: string;
  /** A paler arch behind the text, softly outlined. */
  arch?: boolean;
  /** A faint print of paisleys and flowers on the card's paper, under the art. On unless `false`. */
  pattern?: boolean;
  /** A frosted panel behind the text, so the title, time and venue read the same way on every card whatever art is behind them: the art ghosts through it. */
  plate?: boolean;
}

export interface EventCardProps {
  event: InviteEvent;
  /** Position in the list, from 0: it prints as "Event 01". */
  index: number;
  /** IANA zone the date and time are shown in. */
  timeZone?: string;
  scene?: EventScene;
  eventLabel?: string;
  onwardsLabel?: string;
  mapLabel?: string;
  calendarLabel?: string;
}

/**
 * One event as a card of its own: an "EVENT 01" pill and an add-to-calendar
 * button in the corners, the title with a gold rule, the start time in a pill
 * ("06:00 PM Onwards"), the day in tracked capitals, a box with the venue and
 * its address, and a "View location map" button (Google Maps). The art that
 * dresses the card — garlands, a toran, an arch of flowers — comes in as `scene`
 * (`top` and `bottom`), so every event can look like itself while the card
 * itself stays one shared part. The card rises as it scrolls into view and its
 * lines follow one after the other.
 */
export function EventCard({
  event,
  index,
  timeZone = 'Asia/Kolkata',
  scene = {},
  eventLabel = 'Event',
  onwardsLabel = 'Onwards',
  mapLabel = 'View Location Map',
  calendarLabel = 'Add to calendar',
}: EventCardProps) {
  const { behind, top, bottom, topSpace = 130, bottomSpace = 150, background = 'var(--surface-raised)', arch = false, pattern = true, plate = false } = scene;

  const [weekday, ...dateParts] = formatWeekdayDate(event.startsAt, timeZone).split(', ');
  const restOfDate = dateParts.join(', ');

  return (
    <m.article
      variants={rise}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      className="relative mx-auto min-h-[640px] w-full max-w-[380px] overflow-hidden rounded-[28px] border shadow-lg"
      style={{ background, borderColor: mix(45) }}
    >
      {pattern && <LineArtBackdrop ornaments={false} fadeFrom={-200} opacity={0.15} color="var(--invite-metal)" />}

      {arch && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[7%] bottom-[2%] top-[7%] rounded-t-pill border"
          style={{
            borderColor: mix(28),
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.08))',
          }}
        />
      )}

      {behind}

      {top}

      {plate && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[16px] rounded-[26px] border"
          style={{
            top: topSpace - 24,
            bottom: Math.max(bottomSpace - 20, 12),
            background: 'rgba(255, 251, 246, 0.64)',
            borderColor: mix(34),
            boxShadow: '0 12px 32px rgba(90, 60, 20, 0.16), inset 0 0 0 4px rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        />
      )}

      <m.div
        variants={parts}
        className="relative flex flex-col items-center px-10 text-center"
        style={{ paddingTop: topSpace, paddingBottom: bottomSpace }}
      >
        <m.h3 variants={part} className="display-lg italic text-invite-ink">
          {event.title}
        </m.h3>
        {/* A gold line with a diamond in it. */}
        <m.span variants={part} aria-hidden className="mt-3 flex items-center gap-2">
          <span className="block h-[1px] w-[46px]" style={{ background: 'linear-gradient(to right, transparent, var(--invite-metal))' }} />
          <span className="block h-[7px] w-[7px] rotate-45 bg-[var(--invite-metal)]" />
          <span className="block h-[1px] w-[46px]" style={{ background: 'linear-gradient(to left, transparent, var(--invite-metal))' }} />
        </m.span>

        <m.p
          variants={part}
          className="label mt-5 inline-flex items-center gap-2 rounded-pill border bg-[rgba(255,255,255,0.82)] px-4 py-2 uppercase text-invite-ink shadow-sm"
          style={{ borderColor: mix(30) }}
        >
          <ClockIcon className="h-[14px] w-[14px] text-invite-metal" />
          {formatTime(event.startsAt, timeZone, true)} {onwardsLabel}
        </m.p>
        <m.p variants={part} className="caption mt-4 font-bold uppercase tracking-[0.14em] text-invite-ink">
          <span className="text-invite-metal">{weekday}</span> · {restOfDate}
        </m.p>

        <m.div
          variants={part}
          className="mt-5 w-full rounded-md border bg-[rgba(255,255,255,0.74)] px-4 py-3 shadow-sm"
          style={{ borderColor: mix(22) }}
        >
          <p className="body-sm font-bold text-invite-ink">
            <PinIcon className="mr-1 inline h-[13px] w-[13px] align-[-2px] text-[#c0392b]" />
            {event.place}
          </p>
          {event.address && <p className="caption mt-1 text-ink-muted">{event.address}</p>}
        </m.div>

        <m.a
          variants={part}
          href={mapsUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${mapLabel}: ${event.place} (opens in a new tab)`}
          className="caption mt-4 inline-flex w-full items-center justify-center gap-2 rounded-pill px-6 py-3 font-bold uppercase tracking-[0.14em] shadow-md"
          style={{ background: 'var(--invite-ink)', color: '#fff6e0' }}
        >
          <NavigationIcon className="h-[12px] w-[12px] text-[#f3d27a]" />
          {mapLabel}
        </m.a>
      </m.div>

      {bottom}

      <span
        className="caption absolute left-4 top-4 z-[2] rounded-pill border bg-[rgba(255,255,255,0.88)] px-3 py-1 font-bold uppercase tracking-[0.14em] text-ink-body shadow-sm"
        style={{ borderColor: mix(30) }}
      >
        {eventLabel} {String(index + 1).padStart(2, '0')}
      </span>
      <a
        href={calendarHref(event)}
        download={`${event.title.replace(/\W+/g, '-').toLowerCase()}.ics`}
        aria-label={`${calendarLabel}: ${event.title}`}
        className="absolute right-4 top-4 z-[2] flex h-[34px] w-[34px] items-center justify-center rounded-pill border bg-[rgba(255,255,255,0.88)] text-invite-metal shadow-sm"
        style={{ borderColor: mix(30) }}
      >
        <CalendarPlusIcon className="h-[17px] w-[17px]" />
      </a>
    </m.article>
  );
}
