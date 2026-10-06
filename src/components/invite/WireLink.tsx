'use client';

import type { CSSProperties } from 'react';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { SnakePaths } from './SnakePaths';

// The stagger between the two wires, and when the light starts running once they are drawn.
const wires = { hidden: {}, shown: { transition: { staggerChildren: 0.22 } } };
const draw = {
  hidden: { pathLength: 0 },
  shown: { pathLength: 1, transition: { duration: 0.9, ease: EASE.entrance } },
};
const fadeIn = (delay: number) => ({
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.5, delay } },
});

const WIDTH = 16;

export interface WireLinkProps {
  /** How tall the gap between the two things it joins is, in px. The wires span it exactly. */
  height?: number;
  /** How far each wire hangs in from its side, as a percentage of the width. */
  inset?: number;
  /** The wire: any CSS colour. */
  color?: string;
  /** The warm light it gives off (the halo and the glow round it): any CSS colour, brighter than the wire. */
  glow?: string;
  /** The bright light that runs down the wire: any CSS colour. */
  glint?: string;
}

/**
 * Two glowing golden wires hanging between a card and the one under it, with a
 * bead where each is fastened. Meant as an `li` between the items of an `ol`
 * (or any block in a list that is `relative`): it fills the width and is
 * `height` tall. When it scrolls into view each wire draws itself down, one a
 * beat after the other, then a halo begins to breathe round it and a short
 * comet of light runs down it for ever (`SnakePaths`, so CSS only, and still
 * under reduced motion). Colours are props.
 */
export function WireLink({
  height = 44,
  inset = 16,
  color = 'var(--invite-metal)',
  glow = '#ffc83d',
  glint = '#fff6d0',
}: WireLinkProps) {
  // A wire is not ruled: it sags a little as it hangs.
  const d = `M${WIDTH / 2} 0C${WIDTH / 2 + 3} ${height * 0.3} ${WIDTH / 2 - 3} ${height * 0.7} ${WIDTH / 2} ${height}`;

  return (
    <m.li
      aria-hidden
      variants={wires}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.9 }}
      className="pointer-events-none relative"
      style={{ height }}
    >
      {([0, 1] as const).map((side) => (
        <svg
          key={side}
          viewBox={`0 0 ${WIDTH} ${height}`}
          width={WIDTH}
          height={height}
          fill="none"
          className="absolute top-[0] overflow-visible"
          style={{
            [side ? 'right' : 'left']: `calc(${inset}% - ${WIDTH / 2}px)`,
            filter: `drop-shadow(0 0 2px ${glow}) drop-shadow(0 0 6px color-mix(in srgb, ${glow} 70%, transparent))`,
          }}
        >
          {/* The halo: a wider, fainter copy that breathes. */}
          <m.path
            variants={fadeIn(0.5)}
            d={d}
            stroke={glow}
            strokeWidth="5"
            strokeLinecap="round"
            className="amb-breathe"
            style={
              { '--breathe-from': 0.08, '--breathe-to': 0.34, '--breathe-dur': `${2.6 + side * 0.7}s` } as CSSProperties
            }
          />
          {/* The wire itself, drawn down, with a bright filament along its middle. */}
          <m.path variants={draw} d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <m.path variants={draw} d={d} stroke={glint} strokeWidth="0.5" strokeOpacity="0.7" strokeLinecap="round" />
          {/* A bead where each end is fastened. */}
          <m.g variants={fadeIn(0.1)}>
            {[0, height].map((y) => (
              <g key={y}>
                <circle cx={WIDTH / 2} cy={y} r="3" fill={color} />
                <circle cx={WIDTH / 2 - 0.8} cy={y - 0.8} r="1" fill={glint} fillOpacity="0.85" />
              </g>
            ))}
          </m.g>
          {/* The comet of light, running once the wire is there. */}
          <m.g variants={fadeIn(1.1)}>
            <SnakePaths d={d} color={glint} duration={2.8 + side * 0.6} />
          </m.g>
        </svg>
      ))}
    </m.li>
  );
}
