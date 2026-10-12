'use client';

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { GangaRiver, type Floater, type GangaRiverProps } from './GangaRiver';
import { placeSlots, riverPoints, spacing, type RiverLayoutOptions, type SlotSide } from './riverLayout';

export interface ColumnSection {
  /** Which side of the river the content is on (`wide`: across the page, the river widening into a lake under it). */
  side: SlotSide;
  /** About how tall it will be, px: used until the page has measured the real thing (and for the first paint on the server). */
  est: number;
  content: ReactNode;
}

export interface RiverColumnProps extends RiverLayoutOptions, Pick<GangaRiverProps, 'releasable' | 'hint' | 'hintAt' | 'hintClassName'> {
  sections: ColumnSection[];
  /** One set of what floats; it is repeated for every 2300px of river. */
  floaters?: Floater[];
  fadeStart?: number;
  fadeEnd?: number;
  /** Rise this far over whatever is above the column (it is pulled up by this much), px. */
  overlap?: number;
  /** Laid over the river and under the sections, absolutely placed in the column (a mist at the source). */
  before?: ReactNode;
  /** After the sections, in flow, still inside the column (they are not part of the river's layout). */
  children?: ReactNode;
  /** The language of the column's words. */
  lang?: string;
}

interface Measured {
  tops: number[];
  heights: number[];
  total: number;
}

const SIDE_CLASS: Record<SlotSide, string> = {
  left: 'ml-[8%] w-[50%]',
  right: 'ml-auto mr-[8%] w-[50%]',
  wide: 'mx-[8%]',
  end: '',
};

const sameNumbers = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 2);

/**
 * A column of sections with a river running down it. The sections are ordinary blocks in the page's flow — each on the
 * left, on the right, or across the width — and the river is drawn behind them from where they really are: the page
 * measures each one (and again when one grows, as a form opens or a picture arrives), so the river always keeps its
 * distance from them whatever their text. Between two sections on opposite sides it crosses over; under a `wide` one it
 * widens into a lake. See `riverLayout.ts` for the shape, `GangaRiver` for the water.
 */
export function RiverColumn({ sections, floaters = [], fadeStart = 0, fadeEnd = 0, overlap = 0, before, children, lang, releasable, hint, hintAt, hintClassName, ...layout }: RiverColumnProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const [measured, setMeasured] = useState<Measured | null>(null);

  useLayoutEffect(() => {
    const root = wrap.current;
    if (!root) return;
    const measure = () => {
      const list = els.current.slice(0, sections.length);
      const next: Measured = {
        tops: list.map((e) => e?.offsetTop ?? 0),
        heights: list.map((e) => e?.offsetHeight ?? 0),
        total: root.offsetHeight,
      };
      setMeasured((prev) => (prev && sameNumbers(prev.tops, next.tops) && sameNumbers(prev.heights, next.heights) && Math.abs(prev.total - next.total) < 2 ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    els.current.slice(0, sections.length).forEach((e) => e && ro.observe(e));
    return () => ro.disconnect();
  }, [sections.length]);

  const { lead, start, near, width, lake, crossing, gap, tail, endRun } = layout;
  const { points, height } = useMemo(() => {
    const placed = measured
      ? sections.map((s, i) => ({ side: s.side, height: measured.heights[i], top: measured.tops[i] }))
      : placeSlots(sections.map((s) => ({ side: s.side, height: s.est })), { start, crossing, gap });
    const pts = riverPoints(placed, { lead, start, near, width, lake, crossing, gap, tail, endRun });
    // a river that ends inside its last section is only as tall as that; otherwise it runs to the foot of the column
    const ends = sections[sections.length - 1]?.side === 'end';
    return { points: pts, height: ends ? pts[pts.length - 1].y : Math.max(pts[pts.length - 1].y, measured?.total ?? 0) };
  }, [measured, sections, lead, start, near, width, lake, crossing, gap, tail, endRun]);

  const sets = Math.max(1, Math.round(height / 2300));
  const flowers = useMemo(
    () => Array.from({ length: sets }, (_, r) => floaters.map((f) => ({ ...f, phase: (f.phase + r / sets) % 1, lane: r % 2 ? -f.lane : f.lane }))).flat(),
    [floaters, sets],
  );

  return (
    <div ref={wrap} lang={lang} className="relative" style={{ top: -overlap, marginBottom: -overlap, paddingTop: start, paddingBottom: sections[sections.length - 1]?.side === 'end' ? 0 : (tail ?? 150) }}>
      <div className="absolute inset-x-[0] top-[0]">
        <GangaRiver points={points} height={height} floaters={flowers} fadeStart={fadeStart} fadeEnd={fadeEnd} releasable={releasable} hint={hint} hintAt={hintAt} hintClassName={hintClassName} />
      </div>
      {before}
      {sections.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            els.current[i] = el;
          }}
          className={`relative ${SIDE_CLASS[s.side]}`}
          style={{ marginTop: spacing(sections[i - 1]?.side, s.side, layout) }}
        >
          {s.content}
        </div>
      ))}
      {children}
    </div>
  );
}
