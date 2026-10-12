export interface NightHorizonColors {
  /** The warm light low on the sky, brightest right on the horizon: any CSS colour. */
  glow: string;
  /** The ridges, from the farthest (palest) to the nearest (darkest). */
  far: string;
  mid: string;
  near: string;
  /** Snow on the far peaks, and the warm edge-light the horizon throws on the ridge nearest it (and, below, the lit faces of the peaks). */
  snow: string;
  rim: string;
  /** The lit faces of the far peaks. */
  lit: string;
}

const DEFAULT_COLORS: NightHorizonColors = {
  glow: 'rgba(240, 150, 92, 0.9)',
  far: '#1a2552',
  mid: '#0d1632',
  near: '#040813',
  snow: 'rgba(196, 211, 246, 0.4)',
  rim: 'rgba(255, 176, 112, 0.6)',
  lit: '#2d3d7a',
};

const W = 400;
const H = 150;
const r1 = (n: number) => Math.round(n * 10) / 10;
const frac = (n: number) => n - Math.floor(n);
/** A triangle wave, 0 → 1 → 0: straight-sided peaks, the way a real range is cut. */
const tri = (n: number) => 1 - Math.abs(2 * frac(n) - 1);

/** The height (y) of a ridge at x: triangle waves of two lengths and a little roughness, so there are sharp peaks of different sizes. Everything is rounded to a tenth, so server and browser print the same path. */
function ridgeY(x: number, seed: number, base: number, amp: number, f1: number, f2: number) {
  return base - amp * (0.55 * tri(x * f1 + seed) + 0.3 * tri(x * f2 + seed * 1.7) + 0.15 * Math.abs(Math.sin(x * 0.09 + seed)));
}

const STEP = 4;
const xs = Array.from({ length: W / STEP + 1 }, (_, i) => i * STEP);

/** The ridge as a closed path to the bottom of the box. `teeth` roughens its top into a line of trees. */
function ridgePath(y: (x: number) => number) {
  return `M0 ${H}L${xs.map((x) => `${x} ${r1(y(x))}`).join('L')}L${W} ${H}Z`;
}
function lineOf(y: (x: number) => number) {
  return `M${xs.map((x) => `${x} ${r1(y(x))}`).join('L')}`;
}

// The far range: pointed, snow-capped.
const farY = (x: number) => ridgeY(x, 1.3, 100, 64, 0.0065, 0.0185);
// The middle ridge: lower, with a fuzz of forest along it.
const midY = (x: number) => ridgeY(x, 4.1, 128, 38, 0.011, 0.029) - 4.6 * tri(x * 0.29 + 0.4) * (0.55 + 0.45 * Math.sin(x * 0.07));
// The near ridge: a line of tall pines.
const nearY = (x: number) => ridgeY(x, 7.7, 142, 16, 0.017, 0.041) - 8 * tri(x * 0.15) * (0.5 + 0.5 * Math.abs(Math.sin(x * 0.05 + 1)));

const FAR = ridgePath(farY);
const MID = ridgePath(midY);
const NEAR = ridgePath(nearY);
const MID_LINE = lineOf(midY);
const FAR_LINE = lineOf(farY);

/** Snow: where the far range stands above the snow line, from its crest down to a ragged line. */
const SNOWLINE = 64;
const snowLine = (x: number) => SNOWLINE + 4 * Math.sin(x * 0.31) + 3 * Math.sin(x * 0.83 + 1);
const SNOW = (() => {
  const runs: string[] = [];
  let run: number[] = [];
  const flush = () => {
    if (run.length > 1) {
      const top = run.map((x) => `${x} ${r1(farY(x))}`);
      const bottom = [...run].reverse().map((x) => `${x} ${r1(Math.max(farY(x), snowLine(x)))}`);
      runs.push(`M${top.join('L')}L${bottom.join('L')}Z`);
    }
    run = [];
  };
  for (const x of xs) {
    if (farY(x) < SNOWLINE) run.push(x);
    else flush();
  }
  flush();
  return runs.join('');
})();

/** A tiered conifer standing on the bottom of the box: its tip, and the width and height of its tiers. */
function pine(cx: number, h: number, w: number) {
  const tiers = 4;
  const top = H - h;
  const right: string[] = [];
  const left: string[] = [];
  for (let k = 1; k <= tiers; k++) {
    const y = top + (h * k) / tiers;
    const half = (w / 2) * (k / tiers);
    right.push(`${r1(cx + half)} ${r1(y)}`);
    left.unshift(`${r1(cx - half)} ${r1(y)}`);
    if (k < tiers) {
      right.push(`${r1(cx + half * 0.5)} ${r1(y)}`);
      left.unshift(`${r1(cx - half * 0.5)} ${r1(y)}`);
    }
  }
  return `M${cx} ${top}L${right.join('L')}L${left.join('L')}Z`;
}
const PINES = [pine(7, 58, 22), pine(24, 40, 18), pine(41, 30, 15), pine(393, 62, 24), pine(376, 42, 18), pine(360, 28, 14)].join('');

/** Windows of a village on the middle ridge: a few warm points. */
const LIGHTS = [58, 118, 207, 262, 331].map((x) => ({ x, y: r1(midY(x) + 7) }));

/**
 * A strip of mountains against a low glow, for the foot of a night scene: the warm light of the horizon (a gradient that
 * is brightest at the bottom and fades up into the sky) behind a range of pointed, snow-capped peaks, a band of mist, a
 * forested middle ridge with a few lit windows and a warm edge-light, a near ridge of pines and a few tall pines at the
 * two sides to frame it. Each layer is darker than the one behind. Absolutely placed along the bottom of the nearest
 * positioned ancestor, full width, and ignores the pointer; give it the height on `className` ("h-[21%]"). Colours are props.
 */
export function NightHorizon({ colors, className = '' }: { colors?: Partial<NightHorizonColors>; className?: string }) {
  const c = { ...DEFAULT_COLORS, ...colors };
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-[0] bottom-[0] ${className}`}>
      {/* The glow reaches higher than the ridges, so the sky above them warms. */}
      <span
        className="absolute inset-x-[0] bottom-[0] h-[170%]"
        style={{ background: `radial-gradient(ellipse 100% 78% at 50% 100%, ${c.glow}, transparent 72%)` }}
      />
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-[0] h-full w-full">
        <defs>
          <linearGradient id="nh-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fb0e6" stopOpacity="0" />
            <stop offset="0.55" stopColor="#9fb0e6" stopOpacity="0.2" />
            <stop offset="1" stopColor="#9fb0e6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nh-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.rim} stopOpacity="0" />
            <stop offset="0.5" stopColor={c.rim} />
            <stop offset="1" stopColor={c.rim} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nh-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.far} />
            <stop offset="1" stopColor={c.mid} />
          </linearGradient>
        </defs>
        {/* the far range, snow on its crests, and a faint edge-light on its ridge */}
        <path d={FAR} fill="url(#nh-far)" />
        {/* the faces turned towards the light: the same range moved a little to the right, kept inside its own outline */}
        <clipPath id="nh-far-clip">
          <path d={FAR} />
        </clipPath>
        <g clipPath="url(#nh-far-clip)">
          <path d={FAR} fill={c.lit} opacity="0.85" transform="translate(6 0)" />
        </g>
        <path d={SNOW} fill={c.snow} />
        <path d={FAR_LINE} fill="none" stroke="url(#nh-rim)" strokeWidth="0.7" opacity="0.5" vectorEffect="non-scaling-stroke" />
        {/* a band of mist between the range and the ridge before it */}
        <rect x="0" y="78" width={W} height="44" fill="url(#nh-mist)" />
        {/* the middle ridge, its forest and the warm light along its top */}
        <path d={MID} fill={c.mid} />
        <path d={MID_LINE} fill="none" stroke="url(#nh-rim)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {LIGHTS.map((l, i) => (
          <circle key={l.x} cx={l.x} cy={l.y} r="1" fill="#ffd9a0" className="amb-twinkle" style={{ ['--tw-base' as string]: 0.9, ['--tw-dur' as string]: `${2.2 + i * 0.5}s`, ['--tw-delay' as string]: `${-i * 0.7}s` }} />
        ))}
        {/* the near ridge of pines, and the tall pines either side */}
        <path d={NEAR} fill={c.near} />
        <path d={PINES} fill={c.near} />
      </svg>
    </div>
  );
}
