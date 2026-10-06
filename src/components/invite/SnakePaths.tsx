import type { CSSProperties } from 'react';

// A snake: long and faint at the tail, short and bright at the head. Each lap
// the shorter ones are started a little further along (a negative animation
// delay, see .amb-snake in motion.css), so all the heads stay level.
const SNAKE = [
  { len: 24, width: 1.4, opacity: 0.25 },
  { len: 14, width: 2, opacity: 0.55 },
  { len: 6, width: 2.8, opacity: 1 },
];
const LONGEST = Math.max(...SNAKE.map((s) => s.len));

export interface SnakePathsProps {
  /** The outline the light runs along: any SVG path, which it follows from its first point to its last and round again. */
  d: string;
  /** The light's colour. */
  color: string;
  /** Seconds per lap. */
  duration?: number;
}

/**
 * A gold light that runs along an outline like a snake: three stacked strokes,
 * long and faint at the tail to short and bright at the head, all on one path
 * (`pathLength` 100, so the same numbers fit any shape). Drop it inside your own
 * `<svg>` (fill none, its viewBox the shape's); give that svg a drop-shadow
 * filter for the glow. The motion is CSS (.amb-snake), so it costs no JavaScript
 * and stops under reduced motion. Used round the envelope's edge and the arch
 * frame's.
 */
export function SnakePaths({ d, color, duration = 6 }: SnakePathsProps) {
  return (
    <>
      {SNAKE.map((s) => (
        <path
          key={s.len}
          className="amb-snake"
          d={d}
          pathLength={100}
          stroke={color}
          strokeOpacity={s.opacity}
          strokeWidth={s.width}
          strokeLinecap="round"
          strokeDasharray={`${s.len} ${100 - s.len}`}
          style={
            {
              '--snake-dur': `${duration}s`,
              animationDelay: `${(-((LONGEST - s.len) / 100) * duration).toFixed(3)}s`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
