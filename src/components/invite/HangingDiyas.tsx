import { useId, type CSSProperties } from 'react';

export interface HangingDiyasColors {
  /** The chain's links and the lotus under each lamp: thin outlines. */
  chain: string;
  /** The flame: [outer, inner]. */
  flame: [string, string];
  /** The bowl of each lamp. */
  bowl: string;
}

const DEFAULT_COLORS: HangingDiyasColors = {
  chain: '#e2a257',
  flame: ['#ff8a1f', '#ffd54a'],
  bowl: '#8a4513',
};

// The drawing is 375 wide and 200 tall. Four strings of chain, each ending in a
// lit lamp, and a medallion in the middle. Each string: where it hangs (x), how
// long its chain is, how big its lamp, and how it swings — seconds a swing, a
// negative delay and the degrees — so no two move in step.
const STRINGS = [
  { x: 25, len: 112, lamp: 1, dur: 5.2, delay: -0.9, angle: 3.6 },
  { x: 75, len: 40, lamp: 1.08, dur: 4.1, delay: -2.6, angle: 5 },
  { x: 285, len: 46, lamp: 1.04, dur: 4.6, delay: -1.4, angle: 4.6 },
  { x: 335, len: 118, lamp: 1, dur: 5.7, delay: -3.3, angle: 3.4 },
];
const MEDALLION = { x: 185, len: 26, dur: 6.4, delay: -2, angle: 2.6 };
const LINK_STEP = 9;

// The lamp swings further and quicker than the chain it hangs from.
const LAMP_ANGLE = 2.2;
const LAMP_QUICKER = 0.64;

const pivot = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` });
const swing = (dur: number, delay: number, angle: number, x: number, y: number) =>
  ({ ...pivot(x, y), animationDuration: `${dur}s`, animationDelay: `${delay}s`, '--sway-angle': `${angle}deg` }) as CSSProperties;

// A ring of small petals: each an arch standing on the circle of radius `r`.
const petalRing = (n: number, r: number, size: number) =>
  Array.from({ length: n }, (_, i) => ({
    a: (i * 360) / n,
    d: `M${-size} ${-r}C${-size} ${-r - size * 1.4} ${size} ${-r - size * 1.4} ${size} ${-r}`,
  }));

export interface HangingDiyasProps {
  colors?: Partial<HangingDiyasColors>;
  /** Put the width here; it keeps its shape and is 375 : 200. It hangs from its top edge. */
  className?: string;
}

/**
 * Lamps hanging from the top of a page the way they hang across a doorway at a
 * wedding: four strings of chain, each ending in a lit diya (flame, bowl and a
 * lotus fanned under it), and between them a diya in a ring of petals. Every
 * chain swings from its top, and every lamp swings further and quicker from the
 * foot of its chain, so they sway left and right, never in step; each flame
 * flickers, and the medallion's petal ring turns very slowly (all CSS:
 * `amb-sway amb-sway--hang`, `amb-flicker`, `amb-turn`). Colours are props.
 * Pointer-transparent.
 */
export function HangingDiyas({ colors, className = '' }: HangingDiyasProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');
  const outline = { fill: 'none', stroke: c.chain, strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  // One lit lamp, hanging from (0, 0): flame, bowl, lotus.
  const lamp = (
    <g>
      <circle cy="4" r="3" {...outline} />
      <g className="amb-flicker" style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
        <path d="M0 9C9 19 10 29 0 36C-10 29 -9 19 0 9Z" fill={`url(#${id}-flame)`} />
        <path d="M0 22C4 27 4 32 0 35C-4 32 -4 27 0 22Z" fill={c.flame[1]} opacity="0.95" />
      </g>
      <path d="M-12 36H12C12 44 6 48 0 48C-6 48 -12 44 -12 36Z" fill={c.bowl} />
      <path d="M-12 36H12" stroke={c.chain} strokeWidth="1.6" strokeLinecap="round" />
      {/* The lotus fanned under the bowl. */}
      <path d="M-17 50C-17 63 17 63 17 50Z" {...outline} />
      <path d="M-17 50a4.25 4.25 0 0 0 8.5 0a4.25 4.25 0 0 0 8.5 0a4.25 4.25 0 0 0 8.5 0a4.25 4.25 0 0 0 8.5 0" {...outline} />
      <path d="M-9 56a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0" {...outline} strokeOpacity="0.75" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 375 200"
      aria-hidden
      preserveAspectRatio="xMidYMin meet"
      className={`pointer-events-none overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-flame`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.flame[1]} />
          <stop offset="0.45" stopColor={c.flame[0]} />
          <stop offset="1" stopColor="#d9480f" />
        </linearGradient>
      </defs>

      {STRINGS.map((s) => {
        const links = Math.max(1, Math.floor((s.len - 2) / LINK_STEP));
        return (
          <g key={s.x} className="amb-sway amb-sway--hang" style={swing(s.dur, s.delay, s.angle, s.x, 0)}>
            {Array.from({ length: links }, (_, i) => (
              <ellipse key={i} cx={s.x} cy={5 + i * LINK_STEP} rx="3.2" ry="5.4" {...outline} />
            ))}
            <g className="amb-sway amb-sway--hang" style={swing(s.dur * LAMP_QUICKER, s.delay * 1.6, s.angle * LAMP_ANGLE, s.x, s.len)}>
              <g transform={`translate(${s.x} ${s.len}) scale(${s.lamp})`}>{lamp}</g>
            </g>
          </g>
        );
      })}

      {/* The medallion: two short chains, a ring of petals that turns, and a lamp in it. */}
      <g className="amb-sway amb-sway--hang" style={swing(MEDALLION.dur, MEDALLION.delay, MEDALLION.angle, MEDALLION.x, 0)}>
        {[-3, 3].map((dx) =>
          Array.from({ length: 3 }, (_, i) => (
            <ellipse key={`${dx}-${i}`} cx={MEDALLION.x + dx} cy={5 + i * 8} rx="2" ry="4.2" {...outline} />
          )),
        )}
        <g transform={`translate(${MEDALLION.x} ${MEDALLION.len + 32})`}>
          <g className="amb-turn" style={{ transformBox: 'fill-box', transformOrigin: 'center', ['--turn-dur' as string]: '70s' } as CSSProperties}>
            <circle r="31" {...outline} />
            {petalRing(16, 31, 5.4).map((p) => (
              <path key={p.a} d={p.d} transform={`rotate(${p.a})`} {...outline} />
            ))}
          </g>
          <circle r="24" {...outline} strokeOpacity="0.7" />
          <g transform="translate(0 -18) scale(0.86)">
            <g className="amb-flicker" style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
              <path d="M0 4C8 13 9 22 0 29C-9 22 -8 13 0 4Z" fill={`url(#${id}-flame)`} />
              <path d="M0 16C4 20 4 25 0 28C-4 25 -4 20 0 16Z" fill={c.flame[1]} />
            </g>
            <path d="M-13 30H13C13 38 7 43 0 43C-7 43 -13 38 -13 30Z" fill={c.bowl} />
            <path d="M-13 30H13" stroke={c.chain} strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}
