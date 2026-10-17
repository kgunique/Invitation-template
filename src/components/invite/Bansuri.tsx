import type { CSSProperties } from 'react';
import { useId } from 'react';

export interface BansuriColors {
  /** The bamboo, lit edge to shaded edge. */
  wood: [string, string];
  /** The thread bound round it, two colours in turn. */
  bands: [string, string];
  /** The holes. */
  hole: string;
  /** The cord and tassel hanging from its end. */
  tassel: string;
  /** The notes rising from it. */
  notes: string[];
}

export interface BansuriProps {
  colors?: Partial<BansuriColors>;
  /** Musical notes rising from the holes and drifting away (`amb-note`); `false` for none. */
  notes?: boolean;
  /** Width and position; it keeps its shape (400 : 110). Tilt it here too. */
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS: BansuriColors = {
  wood: ['#e0b064', '#8a5a24'],
  bands: ['#b3122e', '#d4a62a'],
  hole: '#3a2210',
  tassel: '#b3122e',
  notes: ['#b3122e', '#c9962b', '#1b9a8c'],
};

const HOLES = [190, 220, 250, 280, 310, 340];
const NOTES = [
  { x: 47, glyph: '♪', delay: 0, drift: -14 },
  { x: 55, glyph: '♫', delay: -1.3, drift: 10 },
  { x: 63, glyph: '♪', delay: -2.6, drift: -6 },
  { x: 71, glyph: '♬', delay: -0.7, drift: 14 },
  { x: 79, glyph: '♫', delay: -3.2, drift: -10 },
];

/**
 * Krishna's bansuri (bamboo flute) in SVG: a long tube shaded round, a mouth hole and six finger holes, bands of
 * thread bound round it in two colours, and a cord with a tassel hanging from its end; musical notes rise from the
 * holes, sway and fade one after another (`amb-note`, CSS only; gone under reduced motion). Colours are props; size,
 * position and tilt come from `className`.
 */
export function Bansuri({ colors, notes = true, className = '', style }: BansuriProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');

  return (
    <div aria-hidden className={`pointer-events-none relative ${className}`} style={style}>
      <svg viewBox="0 0 400 110" className="block h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.wood[0]} />
            <stop offset="0.45" stopColor={c.wood[0]} />
            <stop offset="1" stopColor={c.wood[1]} />
          </linearGradient>
        </defs>
        {/* the cord and tassel, behind the end of the tube */}
        <path d="M352 34 C 350 56, 362 66, 356 84" stroke={c.tassel} strokeWidth={2} fill="none" />
        <circle cx={356} cy={86} r={3.5} fill={c.bands[1]} />
        <path d="M352 88 L 360 88 L 364 108 L 348 108 Z" fill={c.tassel} />
        {/* the tube */}
        <rect x={8} y={22} width={384} height={16} rx={8} fill={`url(#${id}w)`} />
        <rect x={8} y={24} width={384} height={3} rx={1.5} fill="#ffffff" opacity={0.28} />
        {/* bands of thread */}
        {[24, 112, 362].map((x) => (
          <g key={x}>
            <rect x={x} y={21} width={5} height={18} fill={c.bands[0]} />
            <rect x={x + 6} y={21} width={3} height={18} fill={c.bands[1]} />
            <rect x={x + 10} y={21} width={5} height={18} fill={c.bands[0]} />
          </g>
        ))}
        {/* mouth hole and finger holes */}
        <ellipse cx={70} cy={30} rx={5} ry={3.6} fill={c.hole} />
        {HOLES.map((x) => (
          <ellipse key={x} cx={x} cy={30} rx={4} ry={3.2} fill={c.hole} />
        ))}
      </svg>
      {notes &&
        NOTES.map((n, i) => (
          <span
            key={i}
            className="amb-note absolute top-[0] text-[20px] font-bold leading-none"
            style={
              {
                left: `${n.x}%`,
                color: c.notes[i % c.notes.length],
                '--note-delay': `${n.delay}s`,
                '--note-drift': `${n.drift}px`,
              } as CSSProperties
            }
          >
            {n.glyph}
          </span>
        ))}
    </div>
  );
}
