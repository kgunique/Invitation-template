'use client';

import { useEffect, useRef, useState } from 'react';

export type PetalDirection = 'down' | 'up' | 'left' | 'right';
export type PetalShape = 'leaf' | 'heart';

// A heart, as a mask: the petal's fill colour shows through it.
const HEART_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 90'><path d='M50 88C20 62 2 44 2 26 2 12 13 2 27 2c10 0 18 5 23 14C55 7 63 2 73 2c14 0 25 10 25 24 0 18-18 36-48 62z'/></svg>",
)}")`;

export interface PetalsProps {
  /** Petal fill — any CSS color. Pass an array to cycle through several. */
  color?: string | string[];
  /** How many petals. */
  count?: number;
  /** Speed multiplier. 1 ≈ a petal crosses the screen in ~7s; 2 is twice as fast. */
  speed?: number;
  /** Which way the petals travel. */
  direction?: PetalDirection;
  /** Petal size range in px: [smallest, largest]. */
  size?: [number, number];
  /** The petal's shape: a curled `leaf` (default) or a `heart`. */
  shape?: PetalShape;
  /** Each petal pops: it bursts into being (swelling past its size, then settling)
   * as it starts to fall, and swells and vanishes like a bubble at the end. */
  pop?: boolean;
  /** Travel exactly the container's own height (or width, for a sideways pass)
   * instead of the screen's, so a petal reaches the far edge of a section just as
   * it fades. Without it, travel is measured in vh/vw — right for full-screen use. */
  fit?: boolean;
  /** true: loop forever (ambient). false: one pass, then `onDone` fires. */
  loop?: boolean;
  /** Called once a non-looping pass has finished. Still fires under reduced motion. */
  onDone?: () => void;
}

const BASE_SECONDS = 7;
/** Spread of start times in a one-shot pass, in seconds at speed 1. */
const BURST_SPREAD = 1.2;
const GOLDEN = 0.61803398875;

const frac = (n: number) => n - Math.floor(n);

/**
 * Drifting petals, drawn as CSS shapes (leaves or hearts) and animated with the
 * `amb-petal` keyframe in motion.css — no Framer Motion, no JS per frame.
 * Positions are derived from the index (golden-ratio spacing) rather than
 * Math.random(), so server and client render the same markup.
 *
 * Fills its nearest positioned ancestor and clips to it. Travel is measured in
 * vh/vw (full-screen use) unless `fit` is set, which measures the container.
 */
export function Petals({
  color = '#a3122f',
  count = 12,
  speed = 1,
  direction = 'down',
  size = [9, 16],
  shape = 'leaf',
  pop = false,
  fit = false,
  loop = true,
  onDone,
}: PetalsProps) {
  const palette = Array.isArray(color) ? color : [color];
  const vertical = direction === 'down' || direction === 'up';
  const sign = direction === 'down' || direction === 'right' ? 1 : -1;
  const safeSpeed = Math.max(speed, 0.05);
  const heart = shape === 'heart';

  // The container's length along the travel axis, for `fit`. Measured after
  // mount only, so the first render (server and client) is the same either way.
  const rootRef = useRef<HTMLDivElement>(null);
  const [length, setLength] = useState<number | null>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!fit || !el) return;
    const measure = () => setLength(vertical ? el.offsetHeight : el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit, vertical]);

  const petals = Array.from({ length: count }, (_, i) => {
    const along = frac((i + 1) * GOLDEN);
    const jitter = frac((i + 1) * GOLDEN * 2.3 + 0.17);
    const duration = (BASE_SECONDS * (0.75 + jitter * 0.5)) / safeSpeed;
    const delay = loop ? -(i / count) * duration : (i / count) * (BURST_SPREAD / safeSpeed);
    const px = size[0] + jitter * (size[1] - size[0]);
    const sideways = `${Math.round((jitter - 0.5) * 120)}px`;
    const travel =
      fit && length ? `${sign * Math.round(length * 1.12)}px` : `${sign * 112}${vertical ? 'vh' : 'vw'}`;
    const entry = sign === 1 ? '-6%' : '106%';
    return {
      duration,
      delay,
      px,
      fill: palette[i % palette.length],
      // A leaf may turn right over; a heart only sways, so it stays the right way up.
      tilt: heart ? Math.round((jitter - 0.5) * 50) : Math.round(jitter * 360),
      spin: heart
        ? `${i % 2 ? '' : '-'}${Math.round(25 + jitter * 40)}deg`
        : `${i % 2 ? '' : '-'}${Math.round(180 + jitter * 180)}deg`,
      // Cross-axis position spreads petals across the edge they enter from.
      top: vertical ? entry : `${Math.round(along * 100)}%`,
      left: vertical ? `${Math.round(along * 100)}%` : entry,
      dx: vertical ? sideways : travel,
      dy: vertical ? travel : sideways,
    };
  });

  const total = loop ? 0 : Math.max(0, ...petals.map((p) => p.delay + p.duration));

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // A timer rather than animationend, so a reduced-motion user (animation
  // disabled) still gets the callback and whatever sequence is waiting on it.
  useEffect(() => {
    if (loop) return;
    const id = setTimeout(() => onDoneRef.current?.(), total * 1000);
    return () => clearTimeout(id);
  }, [loop, total]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-[0] overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`amb-petal absolute ${pop ? 'amb-petal--pop' : ''}`}
          style={
            {
              top: p.top,
              left: p.left,
              width: p.px,
              height: heart ? p.px * 0.9 : p.px,
              '--dx': p.dx,
              '--dy': p.dy,
              '--spin': p.spin,
              '--petal-dur': `${p.duration}s`,
              '--petal-delay': `${p.delay}s`,
              '--petal-iter': loop ? 'infinite' : '1',
            } as React.CSSProperties
          }
        >
          <span
            className="block h-full w-full"
            style={
              heart
                ? {
                    background: p.fill,
                    WebkitMaskImage: HEART_MASK,
                    maskImage: HEART_MASK,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    transform: `rotate(${p.tilt}deg)`,
                  }
                : { background: p.fill, borderRadius: '80% 12% 80% 12%', transform: `rotate(${p.tilt}deg)` }
            }
          />
        </span>
      ))}
    </div>
  );
}
