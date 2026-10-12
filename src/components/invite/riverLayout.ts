import type { RiverPoint } from './river';

/**
 * Sections laid out beside a river. Each slot is a stretch of page with its content on one side (or across the whole
 * width: a lake); the river keeps to the other bank while it passes and, where one slot's content is on the opposite
 * side to the last, crosses over in the free paper between them. The water's width is never the same twice: it swells
 * and narrows as it goes, while its edge on the content's side keeps a steady distance from the content, so the river
 * is irregular without ever touching a card. Pure functions: the same slots always give the same river, so the server and
 * the browser draw the same one.
 */
export type SlotSide = 'left' | 'right' | 'wide' | 'both' | 'end';

export interface RiverSlot {
  /**
   * Which side of the river this slot's content is on (the river keeps to the other bank); `wide` content fills the width
   * and the river widens into a lake under it; `end` content fills the width too, and is where the river ends: it comes
   * to the middle and opens into a pool that fills the rest of the slot and runs on a little past its foot, so whatever cuts the page off there (a torn edge) cuts the water too.
   * `both` content fills the width with the river down the middle (narrow): something on each side of it. Only the last slot can be `end`.
   */
  side: SlotSide;
  /** How tall the slot is, px. */
  height: number;
}

export interface PlacedSlot extends RiverSlot {
  /** Where the slot begins, px down the river's box. */
  top: number;
}

export interface RiverLayoutOptions {
  /** The river before the first slot (its source and first bends): waypoints, the last of them well above `start`. */
  lead: RiverPoint[];
  /** How far down the first slot begins, px. */
  start: number;
  /**
   * The water's edge nearest the content, as a share of the width, for content on the left (the river's left edge, on the right
   * bank) and on the right (the river's right edge, on the left bank). Leave room for the bank's stones (about 0.04) and a gap.
   */
  near: { left: number; right: number };
  /** The narrowest and widest the water gets, as shares of the width. */
  width: { min: number; max: number };
  /** The lake that `wide` content floats on: where its middle is and how wide it is, as shares of the width. */
  lake?: { x: number; w: number };
  /** The free paper the river crosses in between two slots on opposite sides (or before and after a lake), px. */
  crossing?: number;
  /** The gap between two slots on the same side, px. */
  gap?: number;
  /** How far the river runs on after the last slot, px (not after an `end` slot, which is where it stops). */
  tail?: number;
}

/** The free space the flow leaves between two slots, px: what a layout built of real elements must use as margins too. */
export function spacing(prev: SlotSide | undefined, next: SlotSide, { crossing = 200, gap = 30 }: Pick<RiverLayoutOptions, 'crossing' | 'gap'>) {
  if (!prev) return 0;
  if (prev === 'wide' && next === 'both') return Math.round(crossing * 0.7); // the lake narrows into the river between two things
  if (prev === 'both' || next === 'both') return Math.round(crossing * 0.6);
  if (prev === 'wide') return Math.round(crossing * 1.6); // the lake narrows slowly into what follows
  return prev === next && (next === 'left' || next === 'right') ? gap : crossing;
}

/** Where each slot begins if they follow one another down the page from `start`. */
export function placeSlots(slots: RiverSlot[], opts: Pick<RiverLayoutOptions, 'start' | 'crossing' | 'gap'>): PlacedSlot[] {
  let y = opts.start;
  return slots.map((s, i) => {
    if (i > 0) y += spacing(slots[i - 1].side, s.side, opts);
    const placed = { ...s, top: y };
    y += s.height;
    return placed;
  });
}

/** How wide the water is at a distance down: a slow swell with a quicker ripple on it, never repeating within a page. 0..1. */
const swell = (y: number) => 0.5 + 0.5 * (0.55 * Math.sin(y * 0.0066 + 1.3) + 0.3 * Math.sin(y * 0.0151 + 0.4) + 0.15 * Math.sin(y * 0.031 + 2.2));

/** The river is on its bank this far before a slot begins and after it ends, px. */
const MARGIN = 10;
/** A waypoint this often along a slot, px: dense enough for the width to follow the swell. */
const STEP = 80;

/** The river's waypoints for slots that are already placed (their tops may be measured from the page). */
export function riverPoints(slots: PlacedSlot[], { lead, near, width, lake = { x: 0.5, w: 0.82 }, tail = 150 }: RiverLayoutOptions): RiverPoint[] {
  const wAt = (y: number) => width.min + (width.max - width.min) * swell(y);
  // the river on the bank beside content on `side`, at y
  const beside = (side: 'left' | 'right', y: number): RiverPoint => {
    const w = wAt(y);
    return { y, w, x: side === 'left' ? near.left + w / 2 : near.right - w / 2 };
  };

  const points = [...lead];
  const add = (p: RiverPoint) => {
    if (p.y > points[points.length - 1].y + 1) points.push(p);
  };

  slots.forEach((s, i) => {
    const bottom = s.top + s.height;
    const prev = slots[i - 1];
    if (s.side === 'wide') {
      add({ y: s.top - MARGIN, x: lake.x, w: lake.w });
      add({ y: bottom + MARGIN, x: lake.x, w: lake.w });
      return;
    }
    if (s.side === 'both') {
      // down the middle, narrow and a little irregular, with something either side
      for (let y = s.top - MARGIN; y < bottom + MARGIN; y += STEP) add({ y, x: 0.5, w: Math.max(width.min * 0.85, wAt(y) * 0.7) });
      add({ y: bottom + MARGIN, x: 0.5, w: Math.max(width.min * 0.85, wAt(bottom + MARGIN) * 0.7) });
      return;
    }
    if (s.side === 'end') {
      // into the middle, opening into a pool that fills the rest of the section: where the river ends. It runs on a little past the
      // bottom, so whatever cuts the section off (a torn edge) cuts the water
      const pool = lake.w * 0.95;
      const neck = width.max * 0.9;
      add({ y: s.top - MARGIN, x: 0.5, w: neck });
      add({ y: s.top + 30, x: 0.5, w: neck * 1.05 });
      add({ y: s.top + 130, x: 0.5, w: pool });
      add({ y: bottom + 60, x: 0.5, w: pool });
      return;
    }
    // crossing over from the other bank (or out of a lake): a wide bend half way
    if (prev && prev.side !== s.side) {
      const from = points[points.length - 1];
      const to = beside(s.side, s.top - MARGIN);
      const y = (from.y + to.y) / 2;
      add({ y, x: (from.x + to.x) / 2, w: Math.min(width.max * 1.1, wAt(y) * 1.15) });
    }
    for (let y = s.top - MARGIN; y < bottom + MARGIN; y += STEP) add(beside(s.side, y));
    add(beside(s.side, bottom + MARGIN));
  });

  const last = points[points.length - 1];
  if (slots[slots.length - 1]?.side !== 'end') add({ ...last, y: last.y + tail });
  return points;
}

export interface RiverLayout {
  /** Where each slot begins, px down the river's box. */
  tops: number[];
  /** The river's waypoints. */
  points: RiverPoint[];
  /** The river's box height, px. */
  height: number;
}

/** Everything at once, for slots whose heights are known (or estimated). */
export function layoutRiver(slots: RiverSlot[], opts: RiverLayoutOptions): RiverLayout {
  const placed = placeSlots(slots, opts);
  const points = riverPoints(placed, opts);
  return { tops: placed.map((p) => p.top), points, height: points[points.length - 1].y };
}
