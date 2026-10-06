import { useId, type CSSProperties } from 'react';

export interface HangingBellsColors {
  /** The two colours the marigold beads alternate between. */
  bead: [string, string];
  /** The bell's gradient, from its crown to its rim. */
  bell: [string, string];
  /** The rim, the loop and the clapper. */
  trim: string;
}

const DEFAULT_COLORS: HangingBellsColors = {
  bead: ['#f59e1b', '#f8c84a'],
  bell: ['#fbc545', '#d9811a'],
  trim: '#b8661a',
};

// Each string: where it hangs (x), how long it is, how big its bell, how it
// swings (seconds a swing, negative delay, degrees) so the two never move in step.
const STRINGS = [
  { x: 22, len: 142, bell: 1, dur: 4.8, delay: -0.7, angle: 4.5 },
  { x: 62, len: 70, bell: 0.82, dur: 3.9, delay: -2.3, angle: 5.5 },
];
const BEAD_STEP = 7.2;

// The bell swings further than its string, and quicker: it is the part that rings.
const BELL_ANGLE = 2.4;
const BELL_QUICKER = 0.62;

const pivot = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` });

export interface HangingBellsProps {
  /** Mirror it, for the top right corner. */
  mirror?: boolean;
  colors?: Partial<HangingBellsColors>;
  /** Put the width and position here (it is 84 x 200 and hangs from its top edge). */
  className?: string;
}

/**
 * Two strings of marigold beads, one long and one short, hanging from the top of
 * a page with a bell at the foot of each, the way they hang in a doorway at a
 * wedding. Each string swings from its top and its bell swings further and
 * quicker than the string does, so they ring left and right, never in step (CSS
 * only: `amb-sway amb-sway--hang`). Put one in each top corner, the second with
 * `mirror`. Colours are props. Pointer-transparent.
 */
export function HangingBells({ mirror = false, colors, className = '' }: HangingBellsProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 84 200"
      aria-hidden
      className={`pointer-events-none overflow-visible ${mirror ? '-scale-x-100' : ''} ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-bell`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.bell[0]} />
          <stop offset="1" stopColor={c.bell[1]} />
        </linearGradient>
      </defs>

      {STRINGS.map((s) => {
        const beads = Math.floor((s.len - 4) / BEAD_STEP);
        return (
          <g
            key={s.x}
            className="amb-sway amb-sway--hang"
            style={
              {
                ...pivot(s.x, 0),
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                '--sway-angle': `${s.angle}deg`,
              } as CSSProperties
            }
          >
            <path d={`M${s.x} 0V${s.len}`} stroke={c.trim} strokeOpacity="0.6" strokeWidth="1" />
            {Array.from({ length: beads }, (_, i) => (
              <circle key={i} cx={s.x} cy={4 + i * BEAD_STEP} r={i % 2 ? 2.4 : 3} fill={c.bead[i % 2]} />
            ))}

            {/* The bell, hung from the foot of the string. */}
            <g
              className="amb-sway amb-sway--hang"
              style={
                {
                  ...pivot(s.x, s.len),
                  animationDuration: `${s.dur * BELL_QUICKER}s`,
                  animationDelay: `${s.delay * 1.7}s`,
                  '--sway-angle': `${s.angle * BELL_ANGLE}deg`,
                } as CSSProperties
              }
            >
              <g transform={`translate(${s.x} ${s.len}) scale(${s.bell})`}>
                <circle cy="2" r="2.4" fill="none" stroke={c.trim} strokeWidth="1.2" />
                <path d="M-8 9C-8 3 8 3 8 9C8 17 12 21 14 26H-14C-12 21 -8 17 -8 9Z" fill={`url(#${id}-bell)`} />
                <path d="M-5 8C-5 13 -8 18 -10 23" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
                <ellipse cy="26.5" rx="14.5" ry="2.8" fill={c.trim} />
                <circle cy="31.5" r="3" fill={c.bell[0]} stroke={c.trim} strokeWidth="0.8" />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
