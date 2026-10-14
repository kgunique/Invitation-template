'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { fadeUp, lineGroup } from './RevealLines';
import { Starfield } from './Starfield';

export interface TimelineChapter {
  /** The year shown on the card's pill and on its tab, e.g. "2022". */
  year: string;
  /** The small line after it, e.g. "CHAPTER I" / "अध्याय १". */
  label: string;
  title: string;
  /** The italic line under the title. */
  subtitle?: string;
  /** A sentence or two. */
  text: string;
  /** The footer's left (a small caps tag, e.g. "FIRST GLANCE") and right (a quiet italic note). */
  tag?: string;
  note?: string;
  /** The round badge at the card's top right. */
  icon?: ReactNode;
}

export interface ChapterTimelineColors {
  /** The blue of the year pills, the rail, the tags and the active tab. */
  accent: string;
  /** The gold ring on the nodes and the tab, and the end of the card's top bar. */
  gold: string;
  /** Titles. */
  ink: string;
  /** Running text. */
  body: string;
  /** Card outline and the tab bar's. */
  line: string;
  /** What the cards are filled with: any CSS background. */
  card: string;
  /** The cool light paired with the gold neon accents. */
  glow: string;
}

const DEFAULT_COLORS: ChapterTimelineColors = {
  accent: '#0f77b5',
  gold: '#d4a62a',
  ink: '#1c2540',
  body: '#3d4966',
  line: '#cfe6f5',
  card: '#ffffff',
  glow: '#38bdf8',
};

export interface ChapterTimelineProps {
  eyebrow?: string;
  /** The small ornament in the eyebrow pill. */
  eyebrowIcon?: ReactNode;
  title: string;
  subtitle?: string;
  chapters: TimelineChapter[];
  /** The class that sets the heading face and the one that sets the running-text face (see `hindiFonts.ts` for Hindi), and the language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  /** The label for the tab bar, for screen readers. */
  tabsLabel?: string;
  background?: string;
  colors?: Partial<ChapterTimelineColors>;
  /** Add twinkling stars animation across the whole timeline. */
  withStars?: boolean;
  /** Add a neon glow to the timeline rail, nodes and chapter cards. */
  neon?: boolean;
}

const TIMELINE_SPARKLES = [
  { x: 3, y: 8, size: 14, dur: 2.8, delay: -0.4, color: '#ffd666' },
  { x: 92, y: 18, size: 16, dur: 3.4, delay: -1.2, color: '#ffe58f' },
  { x: 4, y: 32, size: 12, dur: 2.6, delay: -0.8, color: '#fff1b8' },
  { x: 90, y: 46, size: 15, dur: 3.6, delay: -1.9, color: '#ffd591' },
  { x: 2, y: 62, size: 14, dur: 3.0, delay: -0.6, color: '#ffd666' },
  { x: 94, y: 76, size: 16, dur: 3.2, delay: -1.5, color: '#ffe58f' },
  { x: 5, y: 88, size: 13, dur: 2.9, delay: -1.0, color: '#fff1b8' },
  { x: 91, y: 96, size: 14, dur: 3.5, delay: -2.1, color: '#ffd666' },
];

const group = lineGroup(0.1);
const cardIn = (from: 'left' | 'right') => ({
  hidden: { opacity: 0, x: from === 'right' ? 36 : -36, y: 12 },
  shown: { opacity: 1, x: 0, y: 0, transition: { duration: 0.9, ease: EASE.entrance } },
});
const cardFromRight = cardIn('right');
const cardFromLeft = cardIn('left');
const nodeIn = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

/** The numbered, gold-ringed node that marks a chapter on its rail (or, in a template with no rail, on the bank of its river). Position it with `className`. */
export function ChapterNode({
  index,
  c,
  bodyClassName = '',
  className = '',
  neon = false,
}: {
  index: number;
  c: ChapterTimelineColors;
  bodyClassName?: string;
  className?: string;
  neon?: boolean;
}) {
  return (
    <m.span
      variants={nodeIn}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      aria-hidden
      className={`${bodyClassName} absolute flex h-[28px] w-[28px] items-center justify-center rounded-pill text-[10px] font-bold ${className}`}
      style={{
        background: c.accent,
        color: '#ffffff',
        boxShadow: neon
          ? `0 0 0 3px ${c.gold}, 0 0 12px ${c.gold}, 0 0 24px ${c.gold}, 0 0 34px ${c.glow}`
          : `0 0 0 3px ${c.gold}, 0 2px 8px rgba(15,60,100,0.25)`,
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </m.span>
  );
}

/**
 * One chapter's card: a bar of accent into gold along its top, the year pill and chapter label (and a round badge, if
 * given), the title, the italic subtitle, the story, and a footer tag and note. It slides in from `from` as it is reached.
 * `compact` is the narrow card (about 150–170px across: smaller type and padding, the footer stacked, no badge) for a gap
 * beside something else, such as a river.
 */
export function ChapterCard({
  chapter: ch,
  c,
  displayClassName = '',
  bodyClassName = '',
  compact = false,
  from = 'right',
  index,
  articleRef,
  neon = false,
}: {
  chapter: TimelineChapter;
  c: ChapterTimelineColors;
  displayClassName?: string;
  bodyClassName?: string;
  compact?: boolean;
  from?: 'left' | 'right';
  /** Put on the card as `data-i`, for whatever observes the cards. */
  index?: number;
  articleRef?: (el: HTMLElement | null) => void;
  neon?: boolean;
}) {
  return (
    <m.article
      ref={articleRef}
      data-i={index}
      variants={from === 'right' ? cardFromRight : cardFromLeft}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
      className={`relative overflow-hidden border ${compact ? 'rounded-[16px] px-3 pb-3 pt-5 shadow-[0_8px_22px_rgba(60,40,10,0.16)]' : 'rounded-[18px] px-5 pb-4 pt-6 shadow-[0_10px_30px_rgba(40,90,140,0.12)]'}`}
      style={{
        borderColor: neon ? c.gold : c.line,
        background: c.card,
        boxShadow: neon
          ? `0 0 0 1px ${c.gold}, 0 0 6px ${c.gold}, 0 0 16px ${c.gold}, 0 0 32px ${c.glow}, 0 0 48px ${c.glow}, inset 0 0 18px rgba(56, 189, 248, 0.16)`
          : undefined,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-[0] top-[0] h-[4px]"
        style={{
          background: `linear-gradient(to right, ${c.accent}, ${c.gold})`,
          filter: neon
            ? `drop-shadow(0 0 5px ${c.gold}) drop-shadow(0 0 12px ${c.gold}) drop-shadow(0 0 18px ${c.glow})`
            : undefined,
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <div className={`flex items-center ${compact ? 'flex-wrap gap-x-2 gap-y-1' : 'gap-2'}`}>
          <span
            className={`${bodyClassName} rounded-pill px-3 py-[3px] text-[12px] font-bold tracking-[0.04em]`}
            style={{
              background: c.accent,
              color: '#ffffff',
              boxShadow: neon ? `0 0 8px ${c.gold}, 0 0 18px ${c.gold}, 0 0 24px ${c.glow}` : undefined,
            }}
          >
            {ch.year}
          </span>
          <span className={`${bodyClassName} text-[12px] font-semibold tracking-[0.1em]`} style={{ color: c.accent }}>
            {ch.label}
          </span>
        </div>
        {ch.icon && !compact && (
          <span
            aria-hidden
            className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-pill border"
            style={{ borderColor: c.line, color: c.gold, background: '#f4faff' }}
          >
            {ch.icon}
          </span>
        )}
      </div>

      <h3 className={`${displayClassName} font-semibold leading-[1.35] ${compact ? 'mt-3 text-[20px]' : 'mt-4 text-[24px]'}`} style={{ color: c.ink }}>
        {ch.title}
      </h3>
      {ch.subtitle && (
        <p className={`${bodyClassName} mt-1 italic ${compact ? 'text-[12.5px] leading-[1.5]' : 'text-[14px]'}`} style={{ color: c.accent }}>
          {ch.subtitle}
        </p>
      )}
      <p className={`${bodyClassName} ${compact ? 'mt-3 text-[13px] leading-[1.7]' : 'mt-4 text-[15px] leading-[1.8]'}`} style={{ color: c.body }}>
        {ch.text}
      </p>

      {(ch.tag || ch.note) && (
        <div className={`border-t ${compact ? 'mt-3 flex flex-col items-start gap-1 pt-2' : 'mt-4 flex items-center justify-between gap-3 pt-3'}`} style={{ borderColor: c.line }}>
          <span className={`${bodyClassName} flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em]`} style={{ color: c.accent }}>
            <span aria-hidden className="block h-[8px] w-[8px] rounded-pill" style={{ background: c.gold }} />
            {ch.tag}
          </span>
          <span className={`${bodyClassName} text-[12px] italic`} style={{ color: c.body, opacity: 0.7 }}>
            {ch.note}
          </span>
        </div>
      )}
    </m.article>
  );
}

/**
 * "Our story" as a vertical timeline of chapters: a heading, a row of year tabs (tap one and the page
 * glides to its chapter; the tab of the chapter being read lights as you scroll), and a rail down the left
 * with a numbered node and a card for each chapter — year pill, chapter label, a round badge, the title,
 * an italic subtitle, the story, and a small footer. The rail draws itself down and the cards slide in
 * as they are reached. Words, badges, faces and colours are all props (written in any language).
 */
export function ChapterTimeline({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  chapters,
  displayClassName = '',
  bodyClassName = '',
  lang,
  tabsLabel = 'Chapters',
  background = 'transparent',
  colors,
  withStars = false,
  neon = false,
}: ChapterTimelineProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLElement | null)[]>([]);

  // Light the tab of the chapter nearest the middle of the screen.
  useEffect(() => {
    const els = cards.current.filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-40% 0px -45% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [chapters.length]);

  const go = (i: number) => {
    setActive(i);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cards.current[i]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <section lang={lang} style={{ background }} className="relative overflow-hidden px-4 pb-4 pt-[56px]">
      {withStars && (
        <div aria-hidden className="pointer-events-none absolute inset-[0] overflow-hidden">
          <Starfield count={80} color={c.gold || '#ffd666'} constellations />
          {TIMELINE_SPARKLES.map((st, idx) => (
            <span
              key={idx}
              className="amb-twinkle pointer-events-none absolute flex items-center justify-center select-none"
              style={
                {
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  color: st.color,
                  fontSize: `${st.size}px`,
                  ['--tw-dur' as string]: `${st.dur}s`,
                  ['--tw-delay' as string]: `${st.delay}s`,
                  ['--tw-base' as string]: 0.35,
                } as CSSProperties
              }
            >
              ✦
            </span>
          ))}
        </div>
      )}
      <div className="relative z-10 mx-auto w-full max-w-[480px]">
        <m.div
          variants={group}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {eyebrow && (
            <m.span
              variants={fadeUp}
              className={`${bodyClassName} inline-flex items-center gap-2 rounded-pill border px-5 py-[7px] text-[13px] font-semibold tracking-[0.1em] shadow-sm backdrop-blur-sm`}
              style={{ color: c.accent, borderColor: c.line, background: c.card || '#ffffff' }}
            >
              {eyebrowIcon}
              {eyebrow}
            </m.span>
          )}
          <m.h2 variants={fadeUp} className={`${displayClassName} mt-5 text-[34px] font-semibold leading-[1.3]`} style={{ color: c.ink }}>
            {title}
          </m.h2>
          {subtitle && (
            <m.p variants={fadeUp} className={`${bodyClassName} mt-2 max-w-[30ch] text-[15px] leading-[1.7]`} style={{ color: c.body }}>
              {subtitle}
            </m.p>
          )}
        </m.div>

        <div
          role="tablist"
          aria-label={tabsLabel}
          className="mx-auto mt-6 flex w-fit items-center gap-1 rounded-pill border p-[5px] shadow-md backdrop-blur-sm"
          style={{ borderColor: c.line, background: c.card || '#ffffff' }}
        >
          {chapters.map((ch, i) => (
            <button
              key={ch.year}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => go(i)}
              className={`${bodyClassName} rounded-pill px-5 py-[8px] text-[14px] font-semibold transition-colors`}
              style={
                active === i
                    ? {
                        background: c.accent,
                        color: '#ffffff',
                        boxShadow: neon
                          ? `0 0 0 2px ${c.gold}, 0 0 8px ${c.gold}, 0 0 18px ${c.gold}, 0 0 26px ${c.glow}`
                          : `0 0 0 2px ${c.gold}`,
                      }
                    : { color: c.body }
              }
            >
              {ch.year}
            </button>
          ))}
        </div>

        <div className="relative mt-10">
          {/* The rail: draws itself down. */}
          <m.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute bottom-[10px] left-[13px] top-[6px] w-[3px] origin-top rounded-pill"
            style={{
              background: `linear-gradient(to bottom, ${c.accent}, ${c.line})`,
              boxShadow: neon ? `0 0 8px ${c.gold}, 0 0 18px ${c.gold}, 0 0 24px ${c.glow}` : undefined,
            }}
          />

          <ol className="flex flex-col gap-8">
            {chapters.map((ch, i) => (
              <li key={ch.year} className="relative pl-[46px]">
                <ChapterNode index={i} c={c} bodyClassName={bodyClassName} className="left-[0] top-[18px]" neon={neon} />
                <ChapterCard
                  chapter={ch}
                  c={c}
                  displayClassName={displayClassName}
                  bodyClassName={bodyClassName}
                  index={i}
                  neon={neon}
                  articleRef={(el) => {
                    cards.current[i] = el;
                  }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
