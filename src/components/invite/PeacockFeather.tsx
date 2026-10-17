import type { CSSProperties } from 'react';

export interface PeacockFeatherColors {
  /** The eye, outside in: the green-gold halo, the bronze ring, the teal ring, the deep blue heart. */
  eye: [string, string, string, string];
  /** The fine strands (barbs) along the quill and round the eye. */
  barb: string;
  /** The quill. */
  quill: string;
}

export interface PeacockFeatherProps {
  colors?: Partial<PeacockFeatherColors>;
  /** Degrees it sways either way, from the foot of its quill; 0 holds it still. */
  sway?: number;
  /** Seconds of one sway, there and back. */
  duration?: number;
  /** Seconds into its sway it starts (negative), so two feathers don't move in step. */
  phase?: number;
  /** Width and position; it keeps its shape (120 : 400). Rotate it here too. */
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS: PeacockFeatherColors = {
  eye: ['#8fb339', '#b07a2a', '#1b9a8c', '#16307e'],
  barb: '#3f8a3a',
  quill: '#c9a24e',
};

// The quill runs from the foot (60,400) up to the eye; the barbs leave it in pairs, longest in the middle, angled up.
const BARBS = Array.from({ length: 52 }, (_, i) => {
  const y = 394 - i * 4.8;
  const t = i / 51;
  const len = 16 + Math.sin(t * Math.PI) * 34 + t * 12;
  const rise = 10 + t * 14;
  return { y, len: Math.round(len), rise: Math.round(rise) };
});

// The fringe round the eye: fine strands radiating out past its halo, a little uneven.
const FRINGE = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const r = 50 + ((i * 7) % 5) * 2;
  return { x: Math.round(60 + Math.cos(a) * r * 0.82), y: Math.round(96 + Math.sin(a) * r) };
});

/**
 * A peacock feather (mor pankh) in SVG: a gold quill, fine green barbs fanning from it (longest in the middle,
 * angled up), and the eye at its top — a green-gold halo, a bronze ring, a teal ring and a deep blue heart with a
 * glint, fringed by strands. It sways from the foot of its quill (`amb-sway`, CSS only; still under reduced
 * motion). Colours are props; size, position and tilt come from `className`.
 */
export function PeacockFeather({ colors, sway = 3, duration = 7, phase = 0, className = '', style }: PeacockFeatherProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [halo, bronze, teal, heart] = c.eye;

  return (
    <svg aria-hidden viewBox="0 0 120 400" className={className} style={style}>
      <g
        className={sway ? 'amb-sway' : undefined}
        style={{ '--sway-angle': `${sway}deg`, animationDuration: `${duration}s`, animationDelay: `${phase}s` } as CSSProperties}
      >
        {/* The vane's soft silhouette, so the feather still reads where the fine strands blur away (small sizes). */}
        <path d="M60 396 C 38 330, 18 250, 26 160 C 30 124, 46 100, 60 96 C 74 100, 90 124, 94 160 C 102 250, 82 330, 60 396 Z" fill={c.barb} opacity={0.32} />
        {/* Barbs along the quill. */}
        <g stroke={c.barb} strokeWidth={1.1} strokeLinecap="round" opacity={0.9} fill="none">
          {BARBS.map((b, i) => (
            <g key={i}>
              <path d={`M60 ${b.y} Q ${60 - b.len * 0.6} ${b.y - b.rise * 0.4} ${60 - b.len} ${b.y - b.rise}`} />
              <path d={`M60 ${b.y} Q ${60 + b.len * 0.6} ${b.y - b.rise * 0.4} ${60 + b.len} ${b.y - b.rise}`} />
            </g>
          ))}
        </g>
        {/* Fringe round the eye. */}
        <g stroke={c.barb} strokeWidth={1} strokeLinecap="round" opacity={0.85}>
          {FRINGE.map((f, i) => (
            <line key={i} x1={60} y1={96} x2={f.x} y2={f.y} />
          ))}
        </g>
        {/* The quill. */}
        <path d="M60 400 Q 62 250 60 96" stroke={c.quill} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        {/* The eye. */}
        <ellipse cx={60} cy={96} rx={34} ry={43} fill={halo} opacity={0.9} />
        <ellipse cx={60} cy={100} rx={25} ry={32} fill={bronze} />
        <ellipse cx={60} cy={103} rx={19} ry={24} fill={teal} />
        <ellipse cx={60} cy={106} rx={12} ry={16} fill={heart} />
        <ellipse cx={56} cy={100} rx={3.5} ry={5} fill="#ffffff" opacity={0.35} />
      </g>
    </svg>
  );
}
