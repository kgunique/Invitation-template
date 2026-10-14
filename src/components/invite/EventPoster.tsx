'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import type { InviteEvent } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { CelestialBodiesBackground } from './CelestialBodiesBackground';
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
  /** The far end of the button's gradient (it runs from `accent` to this). */
  buttonEnd: string;
}

const DEFAULT_COLORS: EventPosterColors = { accent: '#0f77b5', ink: '#1c2540', body: '#2a3550', line: '#cfe6f5', buttonEnd: '#0b5f94' };

export interface EventPosterProps {
  event: InviteEvent;
  /** Position in the list, from 0: it prints as "समारोह #1". */
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
  /** The narrow card (about 170px across, no minimum height): smaller type and padding, the day and the clock one under the other, a button that wraps. For a gap beside something else, such as a river. */
  compact?: boolean;
  /** High-contrast dark celestial styling with gold accents and readable text. */
  dark?: boolean;
  /** Animated celestial bodies (glowing moon, orbiting planet, twinkling stars) in the background. */
  celestialBackground?: boolean;
  /** Custom min-height. By default, auto/fitted height is used so cards are not overly tall. */
  minHeight?: string;
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
// the compact card's: the same, but it may wrap to two lines
const PILL_COMPACT = 'flex items-center justify-center gap-[6px] rounded-[14px] bg-[rgba(255,255,255,0.93)] px-2 py-[5px] text-center text-[12px] font-semibold leading-[1.4] shadow-[0_2px_8px_rgba(20,50,90,0.12)]';

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
  labels = { event: 'समारोह', onwards: 'से', map: 'स्थान देखें' },
  formatDate = (iso, tz) => formatWeekdayDate(iso, tz),
  formatClock = (iso, tz) => formatTime(iso, tz, true),
  badge,
  displayClassName = '',
  bodyClassName = '',
  lang,
  colors,
  compact = false,
  dark,
  celestialBackground,
  minHeight,
}: EventPosterProps) {
  const c = { ...DEFAULT_COLORS, ...colors };

  const isDark =
    dark !== undefined
      ? dark
      : !!(
          celestialBackground ||
          (colors?.ink && colors.ink.startsWith('#f')) ||
          (scene.background &&
            (scene.background.includes('#0') ||
              scene.background.includes('rgb(0') ||
              scene.background.includes('gradient')))
        );

  const {
    background = isDark ? 'linear-gradient(180deg, #071738 0%, #030a1c 100%)' : '#eaf3fa',
    behind,
    wash,
    front,
    ink = isDark ? '#ffd875' : c.ink,
    sub = isDark ? '#e8d5b5' : c.body,
  } = scene;

  // Clean label numbering to ensure "समारोह #1", "समारोह #2"
  const rawEventLabel = labels.event || 'समारोह';
  const cleanedEventName = rawEventLabel.replace(/[\s०\d]+$/, '').trim() || rawEventLabel;
  const eventLabelNumber =
    rawEventLabel.includes('#')
      ? rawEventLabel
      : `${cleanedEventName} #${index + 1}`;

  const pillThemeClass = isDark
    ? 'bg-[#06142f]/90 border border-[#e6be60]/40 text-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
    : 'bg-[rgba(255,255,255,0.93)] shadow-[0_2px_8px_rgba(20,50,90,0.12)]';

  const heightStyle = minHeight
    ? { minHeight }
    : scene.behind && !isDark
    ? { minHeight: '560px' }
    : {};

  return (
    <m.article
      lang={lang}
      variants={rise}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      className={`relative mx-auto w-full overflow-hidden border ${
        compact
          ? 'rounded-[20px] shadow-[0_8px_24px_rgba(60,40,10,0.18)]'
          : 'max-w-[400px] rounded-[24px] sm:rounded-[28px] shadow-[0_14px_40px_rgba(0,0,0,0.65)]'
      }`}
      style={{
        background,
        borderColor: isDark ? (c.line || 'rgba(230, 190, 96, 0.45)') : c.line,
        ...heightStyle,
      }}
    >
      {/* Optional Celestial Bodies Animation */}
      {celestialBackground && <CelestialBodiesBackground />}

      {behind}
      {wash && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[0] top-[0] h-[62%]"
          style={{ background: wash }}
        />
      )}

      <m.div
        variants={parts}
        className={`relative z-[2] text-center ${
          compact ? 'px-3 pb-4 pt-3' : 'px-4 sm:px-5 pt-4 pb-5 sm:pb-6'
        }`}
      >
        <m.div variants={part} className="flex items-center justify-between">
          <span
            className={`${bodyClassName} rounded-pill font-bold shadow-sm ${
              isDark
                ? 'bg-[#06142e]/90 border border-[#e6be60]/50 text-[#ffd875]'
                : 'bg-[rgba(255,255,255,0.93)] shadow-[0_2px_8px_rgba(20,50,90,0.12)]'
            } ${compact ? 'px-2 py-[4px] text-[11px]' : 'px-3 py-[6px] text-[12px] tracking-[0.1em]'}`}
            style={{ color: isDark ? '#ffd875' : c.accent }}
          >
            {eventLabelNumber}
          </span>
          <span
            aria-hidden
            className={`flex items-center justify-center rounded-pill shadow-sm ${
              isDark
                ? 'bg-[#06142e]/90 border border-[#e6be60]/50 text-[#ffd875]'
                : 'bg-[rgba(255,255,255,0.93)] shadow-[0_2px_8px_rgba(20,50,90,0.12)]'
            } ${compact ? 'h-[30px] w-[30px] text-[15px]' : 'h-[38px] w-[38px] text-[18px]'}`}
          >
            {badge ?? event.icon}
          </span>
        </m.div>

        <m.h3
          variants={part}
          className={`${displayClassName} font-semibold leading-[1.3] ${
            compact ? 'mt-3 text-[20px]' : 'mt-4 text-[26px] sm:text-[28px]'
          }`}
          style={{
            color: ink,
            textShadow: isDark ? '0 2px 14px rgba(230,190,96,0.45)' : undefined,
          }}
        >
          {event.title}
        </m.h3>
        <m.span
          variants={part}
          aria-hidden
          className="mx-auto mt-2 block h-[2px] w-[64px] rounded-pill"
          style={{
            background: `linear-gradient(to right, transparent, ${c.accent}, transparent)`,
          }}
        />
        {event.description && (
          <m.p
            variants={part}
            className={`${bodyClassName} mx-auto mt-1 ${
              compact
                ? 'text-[12.5px] leading-[1.6]'
                : 'max-w-[28ch] text-[14px] leading-[1.5]'
            }`}
            style={{ color: sub }}
          >
            {event.description}
          </m.p>
        )}

        <m.div
          variants={part}
          className={`mt-3 flex items-stretch justify-center gap-2 ${
            compact ? 'flex-col' : 'flex-wrap items-center'
          }`}
        >
          <span
            className={`${compact ? PILL_COMPACT : PILL} ${bodyClassName} ${pillThemeClass}`}
            style={{
              color: isDark ? '#fff4d4' : c.body,
              background: isDark ? 'rgba(6, 20, 47, 0.96)' : 'rgba(255, 255, 255, 0.93)',
              border: isDark ? '1px solid rgba(255, 216, 117, 0.75)' : undefined,
              boxShadow: isDark ? '0 0 12px rgba(255, 216, 117, 0.3)' : undefined,
            }}
          >
            <span style={{ color: isDark ? '#ffd875' : c.accent }} className="flex">
              <CalendarIcon className="h-[15px] w-[15px]" />
            </span>
            {formatDate(event.startsAt, timeZone)}
          </span>
          <span
            className={`${compact ? PILL_COMPACT : PILL} ${bodyClassName} ${pillThemeClass}`}
            style={{
              color: isDark ? '#fff4d4' : c.body,
              background: isDark ? 'rgba(6, 20, 47, 0.96)' : 'rgba(255, 255, 255, 0.93)',
              border: isDark ? '1px solid rgba(255, 216, 117, 0.75)' : undefined,
              boxShadow: isDark ? '0 0 12px rgba(255, 216, 117, 0.3)' : undefined,
            }}
          >
            <span style={{ color: isDark ? '#ffd875' : c.accent }} className="flex">
              <ClockIcon className="h-[15px] w-[15px]" />
            </span>
            {formatClock(event.startsAt, timeZone)} {labels.onwards}
          </span>
        </m.div>

        <m.div
          variants={part}
          className={`mx-auto mt-3 w-full shadow-md ${
            isDark
              ? 'bg-[#071633]/90 border border-[#e6be60]/40 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
              : 'bg-[rgba(255,255,255,0.95)] shadow-[0_3px_12px_rgba(20,50,90,0.14)]'
          } ${compact ? 'rounded-[14px] px-2 py-2' : 'rounded-[16px] px-4 py-[10px]'}`}
        >
          <p
            className={`${bodyClassName} flex items-center justify-center gap-[6px] font-bold ${
              compact ? 'text-[13.5px] leading-[1.4]' : 'text-[15px]'
            }`}
            style={{ color: isDark ? '#ffffff' : c.ink }}
          >
            <PinIcon
              className={`h-[16px] w-[16px] shrink-0 ${
                isDark ? 'text-[#ffd875]' : 'text-[#d9453d]'
              }`}
            />
            {event.place}
          </p>
          {event.address && (
            <p
              className={`${bodyClassName} mt-[2px] leading-[1.5] ${
                compact ? 'text-[11.5px]' : 'text-[12.5px]'
              }`}
              style={{
                color: isDark ? '#d4c3a3' : c.body,
                opacity: isDark ? 0.95 : 0.8,
              }}
            >
              {event.address}
            </p>
          )}
        </m.div>

        <m.a
          variants={part}
          href={mapsUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bodyClassName} mx-auto flex w-full items-center justify-center font-bold no-underline ${
            compact
              ? 'mt-3 gap-[6px] rounded-[14px] px-2 py-2 text-[12px] leading-[1.4] shadow-[0_5px_12px_rgba(60,40,10,0.28)]'
              : 'mt-[12px] gap-2 rounded-pill px-5 py-[10px] text-[13px] uppercase tracking-[0.1em] shadow-[0_6px_18px_rgba(230,190,96,0.25)]'
          }`}
          style={{
            background: isDark
              ? `linear-gradient(to right, #d49b28, ${c.buttonEnd || '#1e3a8a'})`
              : `linear-gradient(to right, ${c.accent}, ${c.buttonEnd})`,
            color: '#ffffff',
            border: isDark ? '1px solid rgba(230, 190, 96, 0.4)' : undefined,
          }}
        >
          <NavigationIcon className="h-[14px] w-[14px] shrink-0" />
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
