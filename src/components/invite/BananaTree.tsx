import { useId, type CSSProperties } from 'react';

export interface BananaTreeColors {
  /** A leaf's two halves, either side of the midrib: [shaded half, lit half]. Each is a [base, tip] gradient. */
  leaf: [[string, string], [string, string]];
  /** The midrib. */
  rib: string;
  /** The veins and the leaf's outline. */
  vein: string;
  /** The pseudostem, from the ground to the crown. */
  stem: [string, string];
  /** The bananas. */
  fruit: [string, string];
  /** The flower hanging below them. */
  flower: [string, string];
}

const DEFAULT_COLORS: BananaTreeColors = {
  leaf: [
    ['#1f4a22', '#4d8a33'],
    ['#3f7d2e', '#a9d36a'],
  ],
  rib: '#d8e79a',
  vein: '#1c4420',
  stem: ['#4d6b34', '#9cb76a'],
  fruit: ['#7da63a', '#d6e07a'],
  flower: ['#5c1230', '#b3345a'],
};

// Each leaf: its angle off upright, its size, and how it sways (seconds per
// swing, and a negative delay so the leaves don't move in step).
const LEAVES = [
  { angle: -86, scale: 0.62, dur: 7.4, delay: -1.1 },
  { angle: -54, scale: 0.86, dur: 6.6, delay: -3.4 },
  { angle: -22, scale: 1.02, dur: 8.2, delay: -0.4 },
  { angle: 12, scale: 1.08, dur: 7.0, delay: -2.6 },
  { angle: 42, scale: 0.9, dur: 6.8, delay: -4.4 },
  { angle: 74, scale: 0.7, dur: 7.8, delay: -5.2 },
];

// The young leaves at the plant's foot: the same leaf, small.
const SHOOTS = [
  { angle: -70, scale: 0.27, dur: 5.6, delay: -0.8 },
  { angle: -38, scale: 0.36, dur: 6.2, delay: -2.4 },
  { angle: 34, scale: 0.33, dur: 5.9, delay: -1.7 },
  { angle: 68, scale: 0.25, dur: 6.5, delay: -3.3 },
];

const r1 = (n: number) => Math.round(n * 10) / 10;

// One leaf, long and slim, arching away from its stem, drawn once and shared by
// every leaf of every tree. Its base is (0, 0) and it points up. Both edges are
// torn into strips the way a banana leaf is: a sawtooth that runs along them.
const LENGTH = 190;
const HALF_WIDTH = 27;
const STRIPS = 26;

const spine = (t: number) => ({ x: 26 * t * t, y: -LENGTH * (t - 0.14 * t * t) });
const widthAt = (t: number) => HALF_WIDTH * Math.sin(Math.PI * t ** 0.78) ** 0.9;

function edge(t: number, w: number, side: 1 | -1) {
  const a = spine(t);
  const b = spine(Math.min(t + 0.01, 1));
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  // The normal to the spine, pointing right when the leaf is upright.
  const nx = (a.y - b.y) / len;
  const ny = (b.x - a.x) / len;
  return { x: a.x + side * nx * w, y: a.y + side * ny * w };
}

function half(side: 1 | -1) {
  const out: string[] = ['M0 0'];
  // Out along the torn edge to the tip: a tooth at each vein, a notch just past it.
  for (let i = 1; i <= STRIPS; i++) {
    const tooth = i / STRIPS;
    const notch = Math.min((i + 0.55) / STRIPS, 1);
    const p = edge(tooth, widthAt(tooth), side);
    out.push(`L${r1(p.x)} ${r1(p.y)}`);
    if (i < STRIPS) {
      const q = edge(notch, widthAt(notch) * 0.9, side);
      out.push(`L${r1(q.x)} ${r1(q.y)}`);
    }
  }
  // And home along the midrib.
  for (let i = STRIPS; i >= 0; i--) {
    const s = spine(i / STRIPS);
    out.push(`L${r1(s.x)} ${r1(s.y)}`);
  }
  return `${out.join('')}Z`;
}

const LEAF_SHADED = half(-1);
const LEAF_LIT = half(1);
const RIB = `M0 0${Array.from({ length: STRIPS }, (_, i) => {
  const s = spine((i + 1) / STRIPS);
  return `L${r1(s.x)} ${r1(s.y)}`;
}).join('')}`;
// A vein from the rib to each tooth, slanting toward the tip.
const VEINS = Array.from({ length: STRIPS - 1 }, (_, k) => {
  const t = (k + 1) / STRIPS;
  const s = spine(t - 0.02);
  const l = edge(t, widthAt(t), -1);
  const r = edge(t, widthAt(t), 1);
  return `M${r1(s.x)} ${r1(s.y)}L${r1(l.x)} ${r1(l.y)}M${r1(s.x)} ${r1(s.y)}L${r1(r.x)} ${r1(r.y)}`;
}).join('');

// The rings of the extra trunk, one every 26 units below the drawn stem.
const RINGS = (extend: number) =>
  Array.from({ length: Math.floor(extend / 26) }, (_, i) => {
    const y = 318 + i * 26;
    return `M86 ${y}C95 ${y + 3} 105 ${y + 3} 114 ${y}`;
  }).join('');

export interface BananaTreeProps {
  /** Flip it, for the tree on the other side of a page. */
  mirror?: boolean;
  /** Shifts every leaf's sway in time, so two trees side by side don't move together. Seconds. */
  phase?: number;
  /** How far each leaf leans either way as it sways, in degrees. */
  sway?: number;
  /** Leave the leaves still. */
  still?: boolean;
  /** Hang a bunch of bananas and the flower from the crown. */
  fruit?: boolean;
  /** How much taller to make the trunk, in the drawing's own units (it is 200 wide), for a plant whose stem runs off the bottom of the page. */
  extend?: number;
  /** Stand it on the ground: a shadow and young leaves round its foot. Turn off for a plant whose foot is hidden or off the page. */
  ground?: boolean;
  colors?: Partial<BananaTreeColors>;
  className?: string;
}

/**
 * A banana plant, drawn as an illustration: a ringed pseudostem with a fan of
 * six torn, two-toned leaves (a shaded half and a lit half either side of a pale
 * midrib) and, if you like, a bunch of bananas and the maroon flower under it.
 * Every leaf sways on its own (the `amb-sway` class from motion.css, each with
 * its own pace and delay) so the plant moves like a plant and not like one rigid
 * shape. It is 200 x 300 (taller with `extend`) and scales to the width you give it (a Tailwind width
 * class on `className`); it is meant to stand at the edge of a page with its
 * stem running off the bottom. Colours are props. Needs no JavaScript.
 */
export function BananaTree({
  mirror = false,
  phase = 0,
  sway = 3.2,
  still = false,
  fruit = true,
  extend = 0,
  ground = true,
  colors,
  className = '',
}: BananaTreeProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');

  return (
    <svg
      viewBox={`0 0 200 ${300 + extend}`}
      aria-hidden
      className={`overflow-visible ${mirror ? '-scale-x-100' : ''} ${className}`}
      fill="none"
    >
      <defs>
        {/* The gradients run along the leaf: from its base (0) to its tip (-190). */}
        <linearGradient id={`${id}-shade`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={-LENGTH}>
          <stop offset="0" stopColor={c.leaf[0][0]} />
          <stop offset="1" stopColor={c.leaf[0][1]} />
        </linearGradient>
        <linearGradient id={`${id}-lit`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={-LENGTH}>
          <stop offset="0" stopColor={c.leaf[1][0]} />
          <stop offset="1" stopColor={c.leaf[1][1]} />
        </linearGradient>
        <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.stem[0]} />
          <stop offset="0.55" stopColor={c.stem[1]} />
          <stop offset="1" stopColor={c.stem[0]} />
        </linearGradient>
        <linearGradient id={`${id}-fruit`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.fruit[0]} />
          <stop offset="1" stopColor={c.fruit[1]} />
        </linearGradient>
        <linearGradient id={`${id}-flower`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.flower[0]} />
          <stop offset="1" stopColor={c.flower[1]} />
        </linearGradient>
        <g id={`${id}-leaf`}>
          <path d={LEAF_SHADED} fill={`url(#${id}-shade)`} />
          <path d={LEAF_LIT} fill={`url(#${id}-lit)`} />
          <path d={VEINS} stroke={c.vein} strokeOpacity="0.28" strokeWidth="0.7" strokeLinecap="round" />
          <path d={RIB} stroke={c.rib} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </defs>

      {/* The stem: a ringed trunk, thicker at the foot, with the leaves fanning from its crown. */}
      <path d={`M86 300C89 276 91 252 94 230H106C109 252 111 276 114 300V${300 + extend}H86Z`} fill={`url(#${id}-stem)`} />
      <path
        d={`M87 292C95 295 105 295 113 292M89 272C96 275 104 275 111 272M91 252C97 255 103 255 109 252M93 238C98 240 102 240 107 238${RINGS(extend)}`}
        stroke={c.vein}
        strokeOpacity="0.4"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* The bunch and its flower, hanging from the crown on a curved stalk. */}
      {fruit && (
        <g>
          <path d="M104 234C122 232 132 246 130 268" stroke={c.stem[0]} strokeWidth="3.4" strokeLinecap="round" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((n) => (
              <ellipse
                key={`${row}-${n}`}
                cx={118 + row * 5.4 + n * 1.6}
                cy={246 + row * 6 + n * 0.4}
                rx="3"
                ry="9.4"
                fill={`url(#${id}-fruit)`}
                stroke={c.vein}
                strokeOpacity="0.25"
                strokeWidth="0.5"
                transform={`rotate(${-22 + n * 9 + row * 6} ${118 + row * 5.4 + n * 1.6} ${246 + row * 6})`}
              />
            )),
          )}
          <path
            d="M130 266C121 268 119 280 124 292C127 298 133 298 135 290C139 280 137 268 130 266Z"
            fill={`url(#${id}-flower)`}
          />
          <path d="M130 268C126 278 126 288 129 296M130 268C134 278 134 288 133 295" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.9" />
        </g>
      )}

      {/* Where it stands: a soft shadow, and a few young leaves coming up round the foot. */}
      {ground && (
        <g>
          <ellipse cx="100" cy={300 + extend} rx="44" ry="7" fill={c.vein} opacity="0.22" />
          {SHOOTS.map((leaf) => (
            <g
              key={leaf.angle}
              transform={`translate(100 ${300 + extend}) rotate(${leaf.angle}) scale(${leaf.angle < 0 ? -leaf.scale : leaf.scale} ${leaf.scale})`}
            >
              <g
                className={still ? '' : 'amb-sway'}
                style={
                  {
                    animationDuration: `${leaf.dur}s`,
                    animationDelay: `${leaf.delay + phase}s`,
                    '--sway-angle': `${sway * 1.6}deg`,
                  } as CSSProperties
                }
              >
                <use href={`#${id}-leaf`} />
              </g>
            </g>
          ))}
        </g>
      )}

      {/* The leaves, fanned out from the top of the stem. Left-hand ones are drawn mirrored so every tip arches outward. */}
      {LEAVES.map((leaf) => (
        <g
          key={leaf.angle}
          transform={`translate(100 232) rotate(${leaf.angle}) scale(${leaf.angle < 0 ? -leaf.scale : leaf.scale} ${leaf.scale})`}
        >
          <g
            className={still ? '' : 'amb-sway'}
            style={
              {
                animationDuration: `${leaf.dur}s`,
                animationDelay: `${leaf.delay + phase}s`,
                '--sway-angle': `${sway}deg`,
              } as CSSProperties
            }
          >
            <use href={`#${id}-leaf`} />
          </g>
        </g>
      ))}
    </svg>
  );
}
