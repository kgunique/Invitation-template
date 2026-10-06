/** Deterministic 0..1 hash of an integer — integer ops only, so the server
 * and every browser engine produce byte-identical clip-paths (no Math.random,
 * and no Math.sin, whose last bits can differ between engines). */
function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/** Smooth 1-D value noise in -0.5..0.5: random lattice values, eased between. */
function noise(t: number, freq: number, seed: number) {
  const p = t * freq;
  const i = Math.floor(p);
  const f = p - i;
  const u = f * f * (3 - 2 * f);
  const a = hash(i + seed * 7919);
  const b = hash(i + 1 + seed * 7919);
  return a + (b - a) * u - 0.5;
}

/** A ragged BOTTOM edge as a clip-path polygon (flat top, torn bottom). Four
 * octaves of smooth noise — broad swells down to a fine fibre fray — so it
 * wanders like real torn paper rather than repeating like a saw. `base` is the
 * mean depth of the tear in px; `amp` is how far it strays either side. */
export function tornBottom(seed: number, base: number, amp: number, steps = 160) {
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const wander =
      noise(t, 6, seed) + 0.55 * noise(t, 17, seed + 1) + 0.3 * noise(t, 47, seed + 2) + 0.15 * noise(t, 130, seed + 3);
    points.push(`${(t * 100).toFixed(2)}% ${(base + amp * wander).toFixed(1)}px`);
  }
  // Top corners first, then the ragged edge back from right to left.
  return `polygon(0% 0px, 100% 0px, ${points.reverse().join(', ')})`;
}

export interface TornEdgeProps {
  /** The paper that is torn: its colour (any CSS background, so it can carry grain too), which must match the page above it so the two join with no seam. */
  sheet: string;
  /** The darker fibrous core that shows as a thin uneven band under the sheet along the whole tear (any CSS background). Omit for a clean tear. */
  rim?: string;
  /** Mean depth of the tear, px. */
  base?: number;
  /** How far the tear strays either side of `base`, px. */
  amp?: number;
  /** Which tear: a different number gives a different, but always the same, edge. */
  seed?: number;
  /** The shadow the torn sheet throws on what is beneath: any CSS colour, or `false` for none. */
  shadow?: string | false;
}

/**
 * The bottom edge of a sheet of paper, torn: a strip of `sheet` colour with a
 * ragged lower edge (and, under it, a thin darker `rim` of fibre and a soft
 * shadow). Put it at the top of the section that follows the sheet, inside a
 * `relative` parent — it is absolutely placed, flat along its top and the
 * parent's full width, and ignores the pointer. Because it is the page's own
 * colour, the sheet seems to carry on past the section's edge and end in a tear
 * instead of a straight line, which is what lets two sections of different
 * paper merge. The edge is the same on every render (no randomness).
 *
 * It is `base + amp + 6` px tall (the rim strip 6px more), so give the content
 * under it that much room at the top, or let it cover the tops of things that
 * should hang from beneath the paper.
 */
export function TornEdge({ sheet, rim, base = 24, amp = 20, seed = 1, shadow = 'rgba(74, 50, 30, 0.22)' }: TornEdgeProps) {
  const height = base + amp + 6;
  return (
    // The shadow filter is on this wrapper, not on the clipped layers: a filter
    // on the same element as a clip-path would be clipped away with it.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-[0] top-[-1px] z-[2]"
      style={{ height: height + 6, filter: shadow ? `drop-shadow(0 4px 5px ${shadow})` : undefined }}
    >
      {rim && (
        <div
          className="absolute inset-x-[0] top-[0]"
          style={{ height: height + 6, clipPath: tornBottom(seed + 4, base + 5, amp), background: rim }}
        />
      )}
      <div
        className="absolute inset-x-[0] top-[0]"
        style={{ height, clipPath: tornBottom(seed, base, amp), background: sheet }}
      />
    </div>
  );
}
