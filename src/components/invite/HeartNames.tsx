'use client';

import { useEffect, useId, useState } from 'react';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';

type Phase = 'waiting' | 'apart' | 'joined';

// A little overshoot, so the heart pops in and settles rather than just arriving.
const POP = [0.34, 1.56, 0.64, 1] as const;

export interface HeartNamesProps {
  /** The name on the left, e.g. the groom (it ends up on top inside the heart). */
  left: string;
  /** The name on the right, e.g. the bride (it ends up underneath). */
  right: string;
  /** The heart's fill, top to bottom. */
  heart?: [string, string];
  /** The names' colour while they stand apart, on the page. */
  ink?: string;
  /** The names' colour inside the heart. */
  inkOnHeart?: string;
  /** Seconds the names stand apart before they come together. */
  joinAfter?: number;
  /** The names have joined and the heart is in. */
  onJoined?: () => void;
}

/**
 * Two names that start at opposite sides, drift together, and get packed inside
 * a red heart that pops in around them and then beats. Plays once, when it
 * scrolls into view. Hand it any two names and any colours.
 *
 * It is a stage 250px tall and as wide as its parent; put it where the names
 * should start (the left name at a quarter of the width, the right at three
 * quarters) — over the lower part of an artwork, say (see CoupleScene). The
 * heart is an SVG (230px) with a soft glow; the beat is CSS (.amb-beat).
 * Framer Motion, so invite layer only.
 */
export function HeartNames({
  left,
  right,
  heart = ['#f0405f', '#b3122e'],
  ink = '#f6ecd9',
  inkOnHeart = '#ffffff',
  joinAfter = 2.2,
  onJoined,
}: HeartNamesProps) {
  const [phase, setPhase] = useState<Phase>('waiting');
  const gradientId = `heart-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (phase !== 'apart') return;
    const id = setTimeout(() => {
      setPhase('joined');
      onJoined?.();
    }, joinAfter * 1000);
    return () => clearTimeout(id);
    // onJoined is a one-shot notification; a new function each render must not restart the wait.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, joinAfter]);

  const joined = phase === 'joined';
  const shown = phase !== 'waiting';
  const nameStyle = { color: joined ? inkOnHeart : ink, transition: 'color 0.7s ease' };
  const move = { duration: 1, ease: EASE.standard };

  return (
    <m.div
      className="relative h-[250px] w-full"
      onViewportEnter={() => setPhase((p) => (p === 'waiting' ? 'apart' : p))}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* The heart. */}
      <m.div
        aria-hidden
        className="absolute inset-[0] flex items-center justify-center"
        initial={false}
        animate={joined ? { scale: 1, opacity: 1 } : { scale: 0.2, opacity: 0 }}
        transition={{ duration: 0.9, delay: joined ? 0.5 : 0, ease: POP }}
      >
        <span className={`block ${joined ? 'amb-beat' : ''}`}>
          <svg
            viewBox="0 0 100 90"
            width="230"
            height="207"
            style={{ filter: `drop-shadow(0 0 18px color-mix(in srgb, ${heart[1]} 60%, transparent))` }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={heart[0]} />
                <stop offset="1" stopColor={heart[1]} />
              </linearGradient>
            </defs>
            <path
              d="M50 88C20 62 2 44 2 26 2 12 13 2 27 2c10 0 18 5 23 14C55 7 63 2 73 2c14 0 25 10 25 24 0 18-18 36-48 62z"
              fill={`url(#${gradientId})`}
            />
          </svg>
        </span>
      </m.div>

      {/* The names: each in its own half, centred in it. Joining moves each half
          across by half its own width (a quarter of the stage), so both names
          land in the middle, one above the other. */}
      <div className="absolute inset-[0] flex items-center">
        <m.div
          className="flex w-1/2 justify-center"
          initial={false}
          animate={
            joined
              ? { opacity: 1, x: '50%', y: -44, scale: 0.72 }
              : { opacity: shown ? 1 : 0, x: '0%', y: shown ? 0 : 16, scale: 1 }
          }
          transition={joined ? move : { duration: 0.8, ease: EASE.entrance }}
        >
          <span className="display-xl" style={nameStyle}>
            {left}
          </span>
        </m.div>

        <m.div
          className="flex w-1/2 justify-center"
          initial={false}
          animate={
            joined
              ? { opacity: 1, x: '-50%', y: 12, scale: 0.72 }
              : { opacity: shown ? 1 : 0, x: '0%', y: shown ? 0 : 16, scale: 1 }
          }
          transition={joined ? move : { duration: 0.8, delay: 0.15, ease: EASE.entrance }}
        >
          <span className="display-xl" style={nameStyle}>
            {right}
          </span>
        </m.div>
      </div>

      {/* The "&" that appears between them once they are inside the heart. */}
      <m.span
        aria-hidden
        className="display-md absolute left-1/2 top-1/2 -ml-[8px] -mt-[14px]"
        style={{ color: inkOnHeart }}
        initial={false}
        animate={joined ? { opacity: 0.9, scale: 1, y: -16 } : { opacity: 0, scale: 0.4, y: -16 }}
        transition={{ duration: 0.5, delay: joined ? 0.9 : 0, ease: EASE.entrance }}
      >
        &amp;
      </m.span>
    </m.div>
  );
}
