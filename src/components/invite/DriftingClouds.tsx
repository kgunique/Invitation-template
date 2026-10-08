import type { CSSProperties } from 'react';

export interface DriftingCloudsProps {
  /** The cloud's colour: any CSS colour. */
  color?: string;
  /** Each cloud: where it floats (`top`, a share of the box), how wide it is (a share of the box), how long it takes to cross, how far into the crossing it starts, and how see-through it is. */
  clouds?: { top: number; width: number; duration: number; offset: number; opacity?: number }[];
  className?: string;
}

const DEFAULT_CLOUDS = [
  { top: 6, width: 38, duration: 95, offset: 0.1, opacity: 0.9 },
  { top: 21, width: 28, duration: 120, offset: 0.55, opacity: 0.75 },
  { top: 12, width: 46, duration: 150, offset: 0.8, opacity: 0.6 },
];

/**
 * Flat, rounded clouds that cross the sky left to right, forever, each at its own
 * pace (CSS only: `amb-cloud`, so no JavaScript, and it stops under reduced
 * motion). Fills the nearest positioned ancestor and clips to it; put it behind
 * whatever stands in the sky. A cloud that starts part-way across (`offset`) means the sky is never empty at the first frame.
 */
export function DriftingClouds({ color = '#ffffff', clouds = DEFAULT_CLOUDS, className = '' }: DriftingCloudsProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-[0] overflow-hidden ${className}`}>
      {clouds.map((c, i) => (
        <svg
          key={i}
          viewBox="0 0 120 50"
          className="amb-cloud absolute left-[0]"
          fill={color}
          style={
            {
              top: `${c.top}%`,
              width: `${c.width}%`,
              opacity: c.opacity ?? 1,
              '--cloud-dur': `${c.duration}s`,
              // A negative delay puts the cloud `offset` of the way across at the first frame.
              '--cloud-delay': `${-c.duration * c.offset}s`,
              // Carry it from just off the left edge to just off the right one, whatever its width.
              '--cloud-from': '-105%',
              '--cloud-to': `${(100 / c.width) * 100 + 5}%`,
            } as CSSProperties
          }
        >
          <path d="M12 46C1 46-1 31 11 29 11 14 31 9 40 20 45 4 73 1 81 18 95 12 110 21 108 33 119 33 121 46 109 46Z" />
        </svg>
      ))}
    </div>
  );
}
