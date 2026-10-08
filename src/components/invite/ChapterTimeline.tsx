'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { fadeUp, lineGroup } from './RevealLines';

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
}

const DEFAULT_COLORS: ChapterTimelineColors = {
  accent: '#0f77b5',
  gold: '#d4a62a',
  ink: '#1c2540',
  body: '#3d4966',
  line: '#cfe6f5',
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
}

const group = lineGroup(0.1);
const cardIn = {
  hidden: { opacity: 0, x: 36, y: 12 },
  shown: { opacity: 1, x: 0, y: 0, transition: { duration: 0.9, ease: EASE.entrance } },
};
const nodeIn = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

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
    <section lang={lang} style={{ background }} className="relative overflow-hidden px-4 pb-24 pt-[56px]">
      <div className="mx-auto w-full max-w-[480px]">
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
              className={`${bodyClassName} inline-flex items-center gap-2 rounded-pill border bg-white px-5 py-[7px] text-[13px] font-semibold tracking-[0.1em] shadow-sm`}
              style={{ color: c.accent, borderColor: c.line }}
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
          className="mx-auto mt-6 flex w-fit items-center gap-1 rounded-pill border bg-white p-[5px] shadow-md"
          style={{ borderColor: c.line }}
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
                  ? { background: c.accent, color: '#ffffff', boxShadow: `0 0 0 2px ${c.gold}` }
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
            style={{ background: `linear-gradient(to bottom, ${c.accent}, ${c.line})` }}
          />

          <ol className="flex flex-col gap-8">
            {chapters.map((ch, i) => (
              <li key={ch.year} className="relative pl-[46px]">
                <m.span
                  variants={nodeIn}
                  initial="hidden"
                  whileInView="shown"
                  viewport={{ once: true, amount: 0.6 }}
                  aria-hidden
                  className={`${bodyClassName} absolute left-[0] top-[18px] flex h-[28px] w-[28px] items-center justify-center rounded-pill text-[10px] font-bold`}
                  style={{ background: c.accent, color: '#ffffff', boxShadow: `0 0 0 3px ${c.gold}, 0 2px 8px rgba(15,60,100,0.25)` }}
                >
                  {String(i + 1).padStart(2, '0')}
                </m.span>

                <m.article
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  data-i={i}
                  variants={cardIn}
                  initial="hidden"
                  whileInView="shown"
                  viewport={{ once: true, amount: 0.25 }}
                  className="relative overflow-hidden rounded-[18px] border bg-white px-5 pb-4 pt-6 shadow-[0_10px_30px_rgba(40,90,140,0.12)]"
                  style={{ borderColor: c.line }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-[0] top-[0] h-[4px]"
                    style={{ background: `linear-gradient(to right, ${c.accent}, ${c.gold})` }}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${bodyClassName} rounded-pill px-3 py-[3px] text-[12px] font-bold tracking-[0.04em]`}
                        style={{ background: c.accent, color: '#ffffff' }}
                      >
                        {ch.year}
                      </span>
                      <span className={`${bodyClassName} text-[12px] font-semibold tracking-[0.1em]`} style={{ color: c.accent }}>
                        {ch.label}
                      </span>
                    </div>
                    {ch.icon && (
                      <span
                        aria-hidden
                        className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-pill border"
                        style={{ borderColor: c.line, color: c.gold, background: '#f4faff' }}
                      >
                        {ch.icon}
                      </span>
                    )}
                  </div>

                  <h3 className={`${displayClassName} mt-4 text-[24px] font-semibold leading-[1.35]`} style={{ color: c.ink }}>
                    {ch.title}
                  </h3>
                  {ch.subtitle && (
                    <p className={`${bodyClassName} mt-1 text-[14px] italic`} style={{ color: c.accent }}>
                      {ch.subtitle}
                    </p>
                  )}
                  <p className={`${bodyClassName} mt-4 text-[15px] leading-[1.8]`} style={{ color: c.body }}>
                    {ch.text}
                  </p>

                  {(ch.tag || ch.note) && (
                    <div
                      className="mt-4 flex items-center justify-between gap-3 border-t pt-3"
                      style={{ borderColor: c.line }}
                    >
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
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
