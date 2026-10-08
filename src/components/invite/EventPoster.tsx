'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { formatTime, formatWeekdayDate } from './dates';
import { CalendarIcon, ClockIcon, NavigationIcon, PinIcon } from './icons';

export interface PosterScene {
  /** The card's own sky or ground: any CSS background. Drawn first. */
  background?: string;
  /** Artwork that fills the card, behind the words: the picture, garlands, clouds. Absolutely placed children of the card, which is `relative` and clips to its rounded shape. */
  behind?: ReactNode;
  /** A soft scrim under the words, for art busy at the top (foliage): a CSS background that fades to transparent downward. It covers the top 62% of the card. */
  wash?: string;
  /** The title's colour and the line under it, for a dark sky (default: the card's ink and body colours). */
  ink?: string;
  sub?: string;
  /** Artwork in front of the words: falling petals, sparks. It is `pointer-events-none`, so the button under it still works. */
  front?: ReactNode;
}

export interface EventPosterColors {
  /** The label pill, the date and time icons and the button. */
  accent: string;
  /** The title. */
  ink: string;
  /** The date, the time and the venue. */
  body: string;
  /** The card's outline. */
  line: string;
}

const DEFAULT_COLORS: EventPosterColors = { accent: '#0f77b5', ink: '#1c2540', body: '#2a3550', line: '#cfe6f5' };

export interface EventPosterProps {
  event: InviteEvent;
  /** Position in the list, from 0: it prints as "EVENT 01". */
  index: number;
  /** IANA zone the date and time are shown in. */
  timeZone?: string;
  scene?: PosterScene;
  /** The words: the label before the number, the word after the time ("Onwards"), the map button. */
  labels?: { event: string; onwards: string; map: string };
  /** How the day and the clock are written (the defaults are English; see `dates.ts` for the Hindi ones). The time has `labels.onwards` put after it. */
  formatDate?: (iso: string, timeZone: string) => string;
  formatClock?: (iso: string, timeZone: string) => string;
  /** The round badge at the top right. Defaults to the event's emoji. */
  badge?: ReactNode;
  /** The faces for the title and for the rest (see `hindiFonts.ts` for Hindi), and the language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  colors?: Partial<EventPosterColors>;
}

const rise = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE.entrance } },
};
const parts = { hidden: {}, shown: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const part = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const where = (e: InviteEvent) => [e.place, e.address].filter(Boolean).join(', ');
const mapsUrl = (e: InviteEvent) =>
  e.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where(e))}`;

const PILL = 'inline-flex items-center gap-[6px] rounded-pill bg-[rgba(255,255,255,0.93)] px-3 py-[5px] text-[12.5px] font-semibold shadow-[0_2px_8px_rgba(20,50,90,0.12)]';

/**
 * One event as a poster: the artwork fills the card (`scene`), and the words stand over its upper part —
 * an "EVENT 01" pill and a round badge in the corners, the title with a short rule, an optional line under
 * it, the day and the clock time each in a white pill (side by side), the venue and its address in a white box, and a
 * "View location map" button (Google Maps) — all in as little height as it can be, so the picture shows. The picture runs on below the words. The art, the words,
 * the way dates are written, the faces and the colours are all props, so one card serves any language and
 * any look; give a scene art whose top is calm (sky) and keep its subject in the lower half. Every card
 * rises as it scrolls into view and its lines follow one after another.
 */
export function EventPoster({
  event,
  index,
  timeZone = 'Asia/Kolkata',
  scene = {},
  labels = { event: 'EVENT', onwards: 'Onwards', map: 'View Location Map' },
  formatDate = (iso, tz) => formatWeekdayDate(iso, tz),
  formatClock = (iso, tz) => formatTime(iso, tz, true),
  badge,
  displayClassName = '',
  bodyClassName = '',
  lang,
  colors,
}: EventPosterProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const { background = '#eaf3fa', behind, wash, front, ink = c.ink, sub = c.body } = scene;

  return (
    <m.article
      lang={lang}
      variants={rise}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      className="relative mx-auto min-h-[660px] w-full max-w-[380px] overflow-hidden rounded-[28px] border shadow-[0_14px_36px_rgba(30,70,120,0.22)]"
      style={{ background, borderColor: c.line }}
    >
      {behind}
      {wash && <span aria-hidden className="pointer-events-none absolute inset-x-[0] top-[0] h-[62%]" style={{ background: wash }} />}

      <m.div variants={parts} className="relative z-[2] px-4 pt-4 text-center">
        <m.div variants={part} className="flex items-center justify-between">
          <span
            className={`${bodyClassName} rounded-pill bg-[rgba(255,255,255,0.93)] px-3 py-[6px] text-[12px] font-bold tracking-[0.14em] shadow-[0_2px_8px_rgba(20,50,90,0.12)]`}
            style={{ color: c.accent }}
          >
            {labels.event} {String(index + 1).padStart(2, '0')}
          </span>
          <span
            aria-hidden
            className="flex h-[38px] w-[38px] items-center justify-center rounded-pill bg-[rgba(255,255,255,0.93)] text-[18px] shadow-[0_2px_8px_rgba(20,50,90,0.12)]"
          >
            {badge ?? event.icon}
          </span>
        </m.div>

        <m.h3 variants={part} className={`${displayClassName} mt-4 text-[30px] font-semibold leading-[1.3]`} style={{ color: ink }}>
          {event.title}
        </m.h3>
        <m.span variants={part} aria-hidden className="mx-auto mt-2 block h-[2px] w-[64px] rounded-pill" style={{ background: `linear-gradient(to right, transparent, ${c.accent}, transparent)` }} />
        {event.description && (
          <m.p variants={part} className={`${bodyClassName} mx-auto mt-1 max-w-[28ch] text-[14px] leading-[1.5]`} style={{ color: sub }}>
            {event.description}
          </m.p>
        )}

        <m.div variants={part} className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className={`${PILL} ${bodyClassName}`} style={{ color: c.body }}>
            <span style={{ color: c.accent }} className="flex">
              <CalendarIcon className="h-[15px] w-[15px]" />
            </span>
            {formatDate(event.startsAt, timeZone)}
          </span>
          <span className={`${PILL} ${bodyClassName}`} style={{ color: c.body }}>
            <span style={{ color: c.accent }} className="flex">
              <ClockIcon className="h-[15px] w-[15px]" />
            </span>
            {formatClock(event.startsAt, timeZone)} {labels.onwards}
          </span>
        </m.div>

        <m.div
          variants={part}
          className="mx-auto mt-3 w-full rounded-[16px] bg-[rgba(255,255,255,0.95)] px-4 py-[10px] shadow-[0_3px_12px_rgba(20,50,90,0.14)]"
        >
          <p className={`${bodyClassName} flex items-center justify-center gap-[6px] text-[15px] font-bold`} style={{ color: c.ink }}>
            <PinIcon className="h-[16px] w-[16px] shrink-0 text-[#d9453d]" />
            {event.place}
          </p>
          {event.address && (
            <p className={`${bodyClassName} mt-[2px] text-[12.5px] leading-[1.5]`} style={{ color: c.body, opacity: 0.8 }}>
              {event.address}
            </p>
          )}
        </m.div>

        <m.a
          variants={part}
          href={mapsUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bodyClassName} mx-auto mt-[10px] flex w-full items-center justify-center gap-2 rounded-pill px-5 py-[10px] text-[13px] font-bold uppercase tracking-[0.1em] no-underline shadow-[0_6px_16px_rgba(15,100,160,0.35)]`}
          style={{ background: `linear-gradient(to right, ${c.accent}, #0b5f94)`, color: '#ffffff' }}
        >
          <NavigationIcon className="h-[14px] w-[14px]" />
          {labels.map}
        </m.a>
      </m.div>

      {front && (
        <div aria-hidden className="pointer-events-none absolute inset-[0] z-[3]">
          {front}
        </div>
      )}
    </m.article>
  );
}
