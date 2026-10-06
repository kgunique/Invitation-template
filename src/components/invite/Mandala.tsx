import type { CSSProperties } from 'react';

// Petal outlines pointing up from the centre of a 200 x 200 drawing (the middle
// is 0, 0), each repeated round it. The rings are staggered so the petals of one
// sit between the petals of the next.
const RINGS = [
  { d: 'M0 -84C9 -88 9 -94 0 -96C-9 -94 -9 -88 0 -84Z', n: 30, offset: 0, fill: 0.3 },
  { d: 'M0 -50C16 -58 17 -74 0 -83C-17 -74 -16 -58 0 -50Z', n: 12, offset: 6, fill: 0.14 },
  { d: 'M0 -56C9 -62 10 -70 0 -76C-10 -70 -9 -62 0 -56Z', n: 12, offset: 6, fill: 0.26 },
  { d: 'M0 -31C9 -37 10 -46 0 -52C-10 -46 -9 -37 0 -31Z', n: 12, offset: 21, fill: 0.24 },
  { d: 'M0 -15C6 -20 7 -26 0 -32C-7 -26 -6 -20 0 -15Z', n: 8, offset: 0, fill: 0.3 },
  { d: 'M0 -3C4 -6 4 -10 0 -13C-4 -10 -4 -6 0 -3Z', n: 8, offset: 22.5, fill: 0.4 },
];
const DOTS = 72;

export interface MandalaProps {
  /** The line colour. The petals are filled with a faint wash of it. */
  color?: string;
  /** Which way it turns: `cw` or `ccw`, or `false` to leave it still. Two that mirror each other turn opposite ways. */
  turn?: 'cw' | 'ccw' | false;
  /** Seconds for one full turn. */
  duration?: number;
  /** Put the width and position here. */
  className?: string;
}

/**
 * A gold line mandala: a ring of dots, a ring of tiny scallops, then rings of
 * petals (12, 12, 8) closing in to a small rosette, drawn in SVG (so any colour, any size).
 * It turns slowly (the `amb-turn` class from motion.css, CSS only), clockwise or
 * not. It is square and scales to the width you give it; it is meant to sit
 * behind a picture and be half covered by it, or cut off by the edge of the
 * page.
 */
export function Mandala({ color = '#b88624', turn = 'cw', duration = 80, className = '' }: MandalaProps) {
  const spin = turn
    ? ({ '--turn-dur': `${duration}s`, '--turn-dir': turn === 'ccw' ? 'reverse' : 'normal' } as CSSProperties)
    : undefined;
  const spacing = ((2 * Math.PI * 98) / DOTS).toFixed(3);

  return (
    <svg
      viewBox="-100 -100 200 200"
      aria-hidden
      className={`${turn ? 'amb-turn' : ''} ${className}`}
      style={spin}
      fill="none"
      stroke={color}
      strokeLinejoin="round"
    >
      <circle r="98" strokeWidth="3" strokeLinecap="round" strokeDasharray={`0.1 ${spacing}`} />
      <circle r="83" strokeWidth="0.8" strokeOpacity="0.6" />
      <circle r="50" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle r="31" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle r="15" strokeWidth="1" />
      {RINGS.map((ring, k) =>
        Array.from({ length: ring.n }, (_, i) => (
          <path
            key={`${k}-${i}`}
            d={ring.d}
            strokeWidth="1.1"
            fill={color}
            fillOpacity={ring.fill}
            transform={`rotate(${ring.offset + (i * 360) / ring.n})`}
          />
        )),
      )}
      <circle r="2.4" fill={color} stroke="none" />
    </svg>
  );
}
