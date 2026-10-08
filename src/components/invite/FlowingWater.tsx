import type { CSSProperties } from 'react';

/**
 * Pieces of moving water, drawn as SVG fragments (no `<svg>` of their own): put them inside
 * an `<svg>` laid over a picture of water or something being bathed, with the picture's own
 * coordinates, and the still picture comes alive. All CSS (`amb-flow`, `amb-ripple`,
 * `amb-spark`), so no JavaScript, and they stop under reduced motion.
 */

export interface WaterStreaksProps {
  /** SVG path data, one per streak, drawn the way the water runs (top to bottom). Lay several side by side along a stream. */
  paths: string[];
  /** The colour of the bright streaks. */
  color?: string;
  /** Stroke width, in the svg's units. */
  width?: number;
  /** Seconds one dash takes to run its own length: lower is faster. */
  duration?: number;
  /** [dash, gap] in the svg's units. */
  dash?: [number, number];
  opacity?: number;
}

/** Bright dashes that run down a stream, each path at a slightly different pace and phase so the water shimmers. */
export function WaterStreaks({ paths, color = '#eafaff', width = 3, duration = 0.8, dash = [10, 28], opacity = 0.9 }: WaterStreaksProps) {
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${dash[0]} ${dash[1]}`} opacity={opacity}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          className="amb-flow"
          style={
            {
              '--flow-dur': `${duration * (1 + (i % 3) * 0.2)}s`,
              '--flow-by': -(dash[0] + dash[1]),
              animationDelay: `${-i * 0.27}s`,
            } as CSSProperties
          }
        />
      ))}
    </g>
  );
}

export interface WaterRipplesProps {
  /** The pool's centre and radii, in the svg's units. */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  count?: number;
  color?: string;
  width?: number;
  /** Seconds one ring takes to swell and fade. */
  duration?: number;
}

/** Rings that swell out across a pool, one after another, and fade. */
export function WaterRipples({ cx, cy, rx, ry, count = 3, color = '#dff4ff', width = 3, duration = 4.2 }: WaterRipplesProps) {
  return (
    <g fill="none" stroke={color} strokeWidth={width}>
      {Array.from({ length: count }, (_, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          className="amb-ripple"
          style={{ '--ripple-dur': `${duration}s`, '--ripple-delay': `${(-i * duration) / count}s` } as CSSProperties}
        />
      ))}
    </g>
  );
}

export interface WaterDropsProps {
  /** Where the water lands: the drops fly up and out from here. */
  x: number;
  y: number;
  count?: number;
  color?: string;
  /** How far sideways the outermost drop flies, and how high the highest rises, in the svg's units. */
  spread?: number;
  rise?: number;
  radius?: number;
  /** Seconds one splash takes. */
  duration?: number;
}

/** A splash: small drops that fly up and out where a stream lands, swell and vanish, each on its own beat. */
export function WaterDrops({ x, y, count = 8, color = '#eafaff', spread = 60, rise = 46, radius = 3.2, duration = 1.6 }: WaterDropsProps) {
  return (
    <g fill={color}>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0 : i / (count - 1) - 0.5; // -0.5 .. 0.5
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={radius * (0.7 + ((i * 7) % 5) / 8)}
            className="amb-spark"
            style={
              {
                '--sx': `${t * 2 * spread}px`,
                '--sy': `${-rise * (0.55 + ((i * 3) % 4) / 5)}px`,
                '--spark-dur': `${duration}s`,
                '--spark-delay': `${(-i * duration) / count}s`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
              } as CSSProperties
            }
          />
        );
      })}
    </g>
  );
}
