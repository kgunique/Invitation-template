'use client';

import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { EASE } from '@/styles/motion';
import { calendarHref, where } from './calendar';
import { formatTime } from './dates';

export interface CalendarAgendaColors {
  card: string;
  line: string;
  ink: string;
  soft: string;
  /** The day of `highlight` (filled), and the dots under other event days. */
  accent: string;
  /** The events' colour bars, in turn. */
  bars: string[];
  /** The small buttons. */
  button: string;
}

export interface CalendarAgendaProps {
  events: InviteEvent[];
  /** The day ringed in the month (the wedding); the month shown is this one's. Defaults to the first event. */
  highlight?: string;
  timeZone?: string;
  /** Locale for the month's name and the weekdays. */
  locale?: string;
  labels?: { add: string; map: string };
  colors?: Partial<CalendarAgendaColors>;
  className?: string;
}

const DEFAULT_COLORS: CalendarAgendaColors = {
  card: 'rgba(255,255,255,0.08)',
  line: 'rgba(255,255,255,0.12)',
  ink: '#ffffff',
  soft: 'rgba(255,255,255,0.6)',
  accent: '#ff375f',
  bars: ['#ffb340', '#34c759', '#ff375f', '#bf5af2', '#0a84ff'],
  button: 'rgba(255,255,255,0.12)',
};

/** The year, month and day of an instant in a time zone (so the grid agrees with the wedding's own calendar). */
function ymd(iso: string, timeZone: string) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(iso));
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

const mapsUrl = (e: InviteEvent) => e.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where(e))}`;

/**
 * The programme as a phone's calendar: a month (the wedding's) with its weekdays, every event's day dotted and the
 * wedding day filled; then the agenda — each event a row with a colour bar, its day and time, title and place, and
 * two small buttons: Add (an .ics the phone adds to its calendar) and Map. Rows rise as they are scrolled to.
 * Dates are worked in `timeZone`, so server and browser draw the same month.
 */
export function CalendarAgenda({ events, highlight, timeZone = 'Asia/Kolkata', locale = 'en-GB', labels = { add: 'Add', map: 'Map' }, colors, className = '' }: CalendarAgendaProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const focus = ymd(highlight ?? events[0].startsAt, timeZone);
  const first = new Date(Date.UTC(focus.y, focus.m - 1, 1));
  const days = new Date(Date.UTC(focus.y, focus.m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // weeks start on Monday
  const month = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
  const eventDays = new Set(
    events
      .map((e) => ymd(e.startsAt, timeZone))
      .filter((d) => d.y === focus.y && d.m === focus.m)
      .map((d) => d.d),
  );

  const dayLabel = (iso: string) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', timeZone }).format(new Date(iso));

  return (
    <div className={className}>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE.entrance }}
        className="rounded-[26px] border px-4 py-4 backdrop-blur-md"
        style={{ background: c.card, borderColor: c.line }}
      >
        <p className="px-1 text-[20px] font-semibold" style={{ color: c.accent }}>
          {month}
        </p>
        <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-medium" style={{ color: c.soft }}>
          {weekdays.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: lead }, (_, i) => (
            <span key={`x${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const d = i + 1;
            const big = d === focus.d;
            return (
              <span key={d} className="relative mx-auto grid h-[36px] w-[36px] place-items-center rounded-pill text-[16px]" style={{ background: big ? c.accent : 'transparent', color: big ? '#ffffff' : c.ink, fontWeight: big ? 700 : 400 }}>
                {d}
                {eventDays.has(d) && !big && <span className="absolute bottom-[3px] h-[5px] w-[5px] rounded-pill" style={{ background: c.accent }} />}
              </span>
            );
          })}
        </div>
      </m.div>

      <ol className="mt-4 flex flex-col gap-3">
        {events.map((e, i) => (
          <m.li
            key={`${e.startsAt}-${e.title}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE.entrance }}
            className="flex gap-3 rounded-[20px] border px-4 py-4 backdrop-blur-md"
            style={{ background: c.card, borderColor: c.line }}
          >
            <span className="w-[4px] shrink-0 rounded-pill" style={{ background: c.bars[i % c.bars.length] }} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium" style={{ color: c.soft }}>
                {dayLabel(e.startsAt)} · {formatTime(e.startsAt, timeZone, true)}
              </p>
              <p className="mt-[2px] text-[18px] font-semibold leading-[1.25]" style={{ color: c.ink }}>
                {e.icon} {e.title}
              </p>
              {e.description && (
                <p className="mt-[2px] text-[14px] leading-[1.4]" style={{ color: c.soft }}>
                  {e.description}
                </p>
              )}
              <p className="mt-1 text-[14px]" style={{ color: c.ink }}>
                📍 {where(e)}
              </p>
              <div className="mt-3 flex gap-2">
                <a href={calendarHref(e)} download={`${e.title.replace(/\W+/g, '-').toLowerCase()}.ics`} className="rounded-pill px-4 py-[6px] text-[13px] font-semibold" style={{ background: c.button, color: c.ink }} aria-label={`Add ${e.title} to your calendar`}>
                  + {labels.add}
                </a>
                <a href={mapsUrl(e)} target="_blank" rel="noopener noreferrer" className="rounded-pill px-4 py-[6px] text-[13px] font-semibold" style={{ background: c.button, color: c.ink }} aria-label={`${e.title}: open the place in maps`}>
                  ↗ {labels.map}
                </a>
              </div>
            </div>
          </m.li>
        ))}
      </ol>
    </div>
  );
}
