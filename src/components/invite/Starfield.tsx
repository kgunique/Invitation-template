import type { CSSProperties } from 'react';

// R2 low-discrepancy sequence: spreads points evenly with no clumps or rows, and
// with no Math.random in render, so the server and the browser draw the same sky.
const ALPHA_X = 0.7548776662466927;
const ALPHA_Y = 0.5698402909980532;
const frac = (n: number) => n - Math.floor(n);
const round = (n: number) => Math.round(n * 100) / 100;

const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: round(frac(0.5 + i * ALPHA_X) * 100),
  y: round(frac(0.5 + i * ALPHA_Y) * 100),
  size: round(1 + ((i * 7) % 5) * 0.4),
  base: round(0.35 + ((i * 3) % 6) * 0.1),
  dur: round(2.4 + ((i * 5) % 7) * 0.6),
  delay: round(-((i * 11) % 9) * 0.7),
}));

// Two small constellations, in a 100 x 50 box each: [x, y] points joined in order.
const CONSTELLATIONS = [
  { className: 'left-[10%] top-[6%]', points: [[4, 8], [30, 26], [58, 16], [84, 38]] },
  { className: 'bottom-[8%] right-[8%]', points: [[2, 34], [28, 8], [54, 22], [66, 44], [94, 34]] },
] as const;

export interface StarfieldProps {
  /** Star and constellation colour. */
  color?: string;
  /** How many stars, up to 80. */
  count?: number;
  /** The two joined-dot constellations. */
  constellations?: boolean;
}

/**
 * A night sky: twinkling stars and, optionally, two faint constellations. Fills
 * the nearest positioned ancestor and ignores the pointer; stretch it over a
 * whole page and the stars spread with it. The twinkle is CSS (.amb-twinkle).
 */
export function Starfield({ color = '#fdf6e3', count = STARS.length, constellations = true }: StarfieldProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[0] overflow-hidden">
      {STARS.slice(0, count).map((s, i) => (
        <span
          key={i}
          className="amb-twinkle absolute rounded-pill"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: color,
              opacity: s.base,
              '--tw-base': s.base,
              '--tw-dur': `${s.dur}s`,
              '--tw-delay': `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      {constellations &&
        CONSTELLATIONS.map((c) => (
          <svg key={c.className} viewBox="0 0 100 50" className={`absolute h-[50px] w-[100px] ${c.className}`} fill="none">
            <polyline
              points={c.points.map((p) => p.join(',')).join(' ')}
              stroke={color}
              strokeOpacity="0.28"
              strokeWidth="1"
            />
            {c.points.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={color} fillOpacity="0.6" />
            ))}
          </svg>
        ))}
    </div>
  );
}
