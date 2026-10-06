'use client';

import { m, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { DURATION, EASE } from '@/styles/motion';

/**
 * THE HYBRID, IN ONE FILE.
 *
 *   Ambient  -> CSS classes (amb-sway, amb-flicker) straight on the SVG groups.
 *               They loop forever, ignore input, and cost no JavaScript.
 *
 *   One-shot -> Framer Motion variants below. Four elements have to move in a
 *               coordinated sequence off one tap. Hand-chaining four CSS
 *               transition-delays works until you change the first timing and
 *               the other three break. Variants make the sequence editable.
 *
 * Note what is NOT here: no scroll logic (that is Parallax), and no animation
 * of the fronds or flames (that is CSS). Each layer does one job.
 */

// One source of truth for the sequence. Change `gate` in motion.ts and every
// beat below re-times together.
const camera = {
  closed: { scale: 1 },
  open: { scale: 3.1, transition: { duration: DURATION.gate, ease: EASE.gate } },
};

const doorLeft = {
  closed: { scaleX: 1 },
  open: { scaleX: 0.03, transition: { duration: 1.25, ease: [0.3, 0.8, 0.2, 1] } },
};

const doorRight = {
  closed: { scaleX: 1 },
  open: { scaleX: 0.03, transition: { duration: 1.25, ease: [0.3, 0.8, 0.2, 1] } },
};

const monogram = {
  closed: { opacity: 1, scale: 1 },
  open: { opacity: 0, scale: 1.5, transition: { duration: 0.62, ease: EASE.exit } },
};

const reveal = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.9, delay: 0.9, ease: EASE.entrance } },
};

export interface GateSceneProps {
  initials: string;
  brideName: string;
  groomName: string;
  venue: string;
  onOpen?: () => void;
}

export function GateScene({ initials, brideName, groomName, venue, onOpen }: GateSceneProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  function handleOpen() {
    if (open) return;
    setOpen(true);
    // The tap is the only user gesture this product is guaranteed, so it does
    // double duty: it opens the gate AND unlocks audio playback.
    onOpen?.();
  }

  const state = open ? 'open' : 'closed';

  return (
    <div className="relative h-full w-full overflow-hidden bg-invite-ground">
      <svg viewBox="0 0 320 560" className="block h-full w-full" aria-hidden="true">
        <defs>
          <g id="frond">
            <path d="M0 0 Q-15 -44 -7 -94 Q0 -106 7 -94 Q15 -44 0 0 Z" fill="var(--mehendi-500)" />
            <path d="M0 0 L0 -100" stroke="var(--mehendi-700)" strokeWidth="1.6" />
          </g>
        </defs>

        {/* camera: Framer Motion, because it is part of the tap sequence */}
        <m.g
          variants={camera}
          initial="closed"
          animate={state}
          style={{ transformBox: 'view-box', transformOrigin: '160px 486px' }}
        >
          <rect width="320" height="560" fill="var(--invite-ground-alt)" />

          {/* tower: static, no animation of its own */}
          <g fill="var(--invite-metal)" opacity="0.9">
            <polygon points="104,420 216,420 210,382 110,382" />
            <polygon points="110,382 210,382 205,344 115,344" />
            <polygon points="115,344 205,344 200,306 120,306" />
          </g>

          {/* AMBIENT: pure CSS. Different durations per frond via inline style,
              so they never sway in lockstep. */}
          <g>
            {[
              { x: 30, r: -16, s: 1.25, d: 6.0 },
              { x: 60, r: 6, s: 1.05, d: 7.4 },
              { x: 290, r: 16, s: 1.25, d: 5.2 },
              { x: 262, r: -6, s: 1.05, d: 8.1 },
            ].map((f, i) => (
              <g
                key={i}
                className="amb-sway"
                style={{ animationDuration: `${f.d}s`, animationDelay: `${-i * 1.3}s` }}
                transform={`translate(${f.x},480) rotate(${f.r}) scale(${f.s})`}
              >
                <use href="#frond" />
              </g>
            ))}
          </g>

          {/* doors: Framer Motion, part of the sequence */}
          <m.g
            variants={doorLeft}
            initial="closed"
            animate={state}
            style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
          >
            <rect x="118" y="438" width="42" height="122" fill="var(--rani-700)" />
          </m.g>
          <m.g
            variants={doorRight}
            initial="closed"
            animate={state}
            style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}
          >
            <rect x="160" y="438" width="42" height="122" fill="var(--rani-700)" />
          </m.g>

          {/* AMBIENT: flames flicker forever, CSS only */}
          <g fill="var(--invite-metal)">
            <ellipse cx="104" cy="548" rx="13" ry="4" />
            <path className="amb-flicker" d="M104 530 q5 8 0 15 q-5 -7 0 -15z" fill="var(--marigold-500)" />
            <ellipse cx="216" cy="548" rx="13" ry="4" />
            <path className="amb-flicker" style={{ animationDelay: '-0.8s' }} d="M216 530 q5 8 0 15 q-5 -7 0 -15z" fill="var(--marigold-500)" />
          </g>
        </m.g>

        {/* monogram sits outside the camera so it scales on its own timing */}
        <m.g
          variants={monogram}
          initial="closed"
          animate={state}
          style={{ transformBox: 'view-box', transformOrigin: '160px 190px' }}
          transform="translate(160,190)"
        >
          <circle r="66" fill="none" stroke="var(--invite-metal)" strokeWidth="2" />
          <text y="14" textAnchor="middle" fontFamily="var(--font-display)" fontSize="42" fill="var(--invite-ink)">
            {initials}
          </text>
        </m.g>
      </svg>

      <m.div
        variants={reveal}
        initial="closed"
        animate={state}
        className="pointer-events-none absolute inset-[0] flex flex-col items-center justify-center text-center"
      >
        <p className="invite-eyebrow uppercase text-ink-muted">The wedding of</p>
        <p className="invite-names mt-4 text-invite-ink">{brideName}</p>
        <p className="display-md text-invite-metal">&amp;</p>
        <p className="invite-names text-invite-ink">{groomName}</p>
        <p className="label mt-6 uppercase text-invite-metal">{venue}</p>
      </m.div>

      {/* A real button. Not a div with a click handler — a guest using a screen
          reader has to be able to get into the invitation. */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label={`Open ${brideName} and ${groomName}'s invitation`}
          className="absolute inset-[0] z-gate flex items-end justify-center pb-12"
        >
          <span className="label rounded-pill bg-[color-mix(in_srgb,var(--surface-raised)_80%,transparent)] px-4 py-2 uppercase text-invite-metal">
            {reduced ? 'Tap to open' : 'Tap to open'}
          </span>
        </button>
      )}
    </div>
  );
}
