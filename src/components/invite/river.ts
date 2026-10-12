/**
 * The shape of a river, as numbers. A river is given as a few waypoints down a column — how far down (px), how far
 * across (a share of the column's width) and how wide (a share of it) — and this works out a smooth centre line
 * between them and the two banks, the way real water wanders. Pure functions, no randomness: the same waypoints always
 * give the same shape, so the server and the browser draw the same river.
 */

export interface RiverPoint {
  /** Distance down the column, px. Waypoints must run downward (strictly increasing). */
  y: number;
  /** Where the centre line is across the column: 0 left edge, 1 right edge. */
  x: number;
  /** How wide the water is, as a share of the column's width. */
  w: number;
}

/** A monotone cubic through the points (Fritsch–Carlson): smooth, and it never swings past a waypoint the way a spline can. */
function monotone(xs: number[], ys: number[]) {
  const n = xs.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i], b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export interface River {
  /** The centre line's share-of-width at a distance down, and the water's width there. */
  centre: (y: number) => number;
  width: (y: number) => number;
  /** The outline of the water, as SVG path data in a box 100 wide (units are percent of the column's width) and `height` tall (px). */
  water: string;
  /** The outline of the bank: the water, a rim of stones wider, with an uneven edge. */
  bank: string;
  /** The same outline as `water`, open (just the two edges, joined at the ends by lines) for stroking. */
  height: number;
}

/** A gentle unevenness along a bank: a few sines of different lengths, so it never repeats within a page. */
const wobble = (y: number, seed: number) =>
  0.5 * Math.sin(y * 0.021 + seed) + 0.32 * Math.sin(y * 0.047 + seed * 2.3) + 0.18 * Math.sin(y * 0.113 + seed * 3.7);

/**
 * Build a river from waypoints. `bank` is how much wider than the water the rim of stones is on each side (a share of
 * the column's width); `unevenness` is how far the water's own edges stray (a share too).
 */
export function buildRiver(points: RiverPoint[], height: number, { bank = 0.038, unevenness = 0.012, step = 8 } = {}): River {
  const ys = points.map((p) => p.y);
  const centre = monotone(ys, points.map((p) => p.x));
  const width = monotone(ys, points.map((p) => p.w));

  const edge = (extra: number, bumps: number, seedL: number, seedR: number) => {
    const left: string[] = [];
    const right: string[] = [];
    for (let y = ys[0]; y <= ys[ys.length - 1] + 0.01; y += step) {
      const cx = centre(y), hw = Math.max(0, width(y) / 2);
      // the ends taper to nothing, so the banks do not stand out round a river that has hardly begun
      const grow = Math.min(1, hw / 0.03);
      const l = cx - hw - (extra + bumps * wobble(y, seedL)) * grow;
      const rr = cx + hw + (extra + bumps * wobble(y, seedR)) * grow;
      left.push(`${r2(l * 100)} ${r2(y)}`);
      right.push(`${r2(rr * 100)} ${r2(y)}`);
    }
    return `M${left.join('L')}L${right.reverse().join('L')}Z`;
  };

  return {
    centre,
    width,
    water: edge(0, unevenness, 1.7, 5.3),
    bank: edge(bank, bank * 0.5, 8.1, 2.9),
    height,
  };
}

/** An SVG, as a CSS `url()` for `mask-image`, that is opaque inside the outline and clear outside. The box scales to the element (preserveAspectRatio none). */
export function maskUrl(path: string, height: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 ${height}' preserveAspectRatio='none'><path d='${path}' fill='#000'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
