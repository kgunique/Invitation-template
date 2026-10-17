'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import { EASE } from '@/styles/motion';

export interface BudRevealColors {
  /** The card: any CSS background. */
  card: string;
  /** Its outline. */
  line: string;
  /** The prompt. */
  ink: string;
  /** The button. */
  button: string;
  buttonInk: string;
  /** The petals that burst out as it blooms. */
  petals: string[];
}

export interface BudRevealProps {
  /** The open flower it blooms into: a transparent, square picture. */
  flower: string;
  /** The closed bud before the touch; defaults to a rose bud on its stem (`RoseBud`). */
  bud?: ReactNode;
  /** The words under the bud, e.g. "Touch the rose bud". */
  prompt: string;
  /** The button's words. */
  button: string;
  /** What appears under the flower once it has bloomed. */
  children: ReactNode;
  /** The faces for the prompt and the button (see `hindiFonts.ts`), and the language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  colors?: Partial<BudRevealColors>;
  /** Called once, at the touch. */
  onReveal?: () => void;
}

const DEFAULT_COLORS: BudRevealColors = {
  card: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,240,236,0.95))',
  line: '#f1c3c3',
  ink: '#7a1f2b',
  button: '#b3122e',
  buttonInk: '#ffffff',
  petals: ['#c8102e', '#e0384f', '#f06b7e', '#a50d24'],
};

// Twelve petals flying out from the flower as it opens (a fixed table, so server and browser agree).
const BURST = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + 0.2;
  const d = 90 + (i % 3) * 26;
  return { x: Math.round(Math.cos(a) * d), y: Math.round(Math.sin(a) * d), r: (i * 67) % 360, s: 10 + (i % 3) * 3 };
});

/** A closed rose bud on its stem, in SVG: red petals wrapped tight, green sepals cupping it, two leaves. Size from `className` (100 : 160). */
export function RoseBud({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 160" className={className}>
      <path d="M50 160 C 48 130, 52 110, 50 84" stroke="#3d7a32" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M50 128 C 34 118, 22 122, 16 132 C 30 136, 42 134, 50 128 Z" fill="#4f9440" />
      <path d="M50 112 C 64 100, 78 102, 86 110 C 72 118, 60 118, 50 112 Z" fill="#4f9440" />
      {/* the bud */}
      <path d="M50 14 C 72 30, 76 62, 50 88 C 24 62, 28 30, 50 14 Z" fill="#b3122e" />
      <path d="M50 14 C 62 30, 64 56, 50 88 C 44 64, 40 36, 50 14 Z" fill="#d42a43" />
      <path d="M50 22 C 58 34, 58 50, 52 60" stroke="#7d0a1d" strokeWidth={1.4} fill="none" />
      <path d="M38 40 C 42 56, 46 70, 50 88" stroke="#7d0a1d" strokeWidth={1.2} fill="none" opacity={0.7} />
      {/* sepals */}
      <path d="M50 92 C 38 88, 30 76, 30 64 C 38 72, 44 78, 50 84 Z" fill="#3d7a32" />
      <path d="M50 92 C 62 88, 70 76, 70 64 C 62 72, 56 78, 50 84 Z" fill="#3d7a32" />
      <path d="M50 94 C 46 80, 47 72, 50 66 C 53 72, 54 80, 50 94 Z" fill="#4f9440" />
    </svg>
  );
}

/**
 * A card that keeps something until a bud is touched: a rose bud on its stem, swaying (`amb-sway`), a line of words
 * and a button. Touch either and the bud gives way to the open flower, which spins up into bloom while petals burst
 * out of it; the words go and `children` rise under the flower (Framer Motion). For a countdown, a date, a message.
 * Any flower: pass its picture as `flower` and, for another bud, `bud`.
 */
export function BudReveal({
  flower,
  bud,
  prompt,
  button,
  children,
  displayClassName = '',
  bodyClassName = '',
  lang,
  colors,
  onReveal,
}: BudRevealProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [open, setOpen] = useState(false);
  const reveal = () => {
    if (open) return;
    setOpen(true);
    onReveal?.();
  };

  return (
    <div lang={lang} className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-[24px] border px-5 py-8 text-center shadow-[0_14px_36px_rgba(122,31,43,0.14)]" style={{ background: c.card, borderColor: c.line }}>
      <div className="relative mx-auto grid h-[150px] w-[150px] place-items-center">
        <AnimatePresence>
          {!open && (
            <m.button
              key="bud"
              type="button"
              onClick={reveal}
              aria-label={prompt}
              className="absolute inset-[0] grid cursor-pointer place-items-center focus:outline-none"
              exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.45, ease: EASE.exit } }}
            >
              <span className="amb-sway block h-[140px] w-[88px]" style={{ ['--sway-angle' as string]: '4deg' }}>
                {bud ?? <RoseBud className="h-full w-full" />}
              </span>
            </m.button>
          )}
        </AnimatePresence>
        {open && (
          <>
            {BURST.map((p, i) => (
              <m.span
                key={i}
                aria-hidden
                className="absolute left-1/2 top-1/2 block"
                style={{ width: p.s, height: p.s * 1.4, marginLeft: -p.s / 2, marginTop: -p.s * 0.7, background: c.petals[i % c.petals.length], borderRadius: '80% 0 80% 0' }}
                initial={{ x: 0, y: 0, rotate: p.r, opacity: 1, scale: 0.4 }}
                animate={{ x: p.x, y: p.y, rotate: p.r + 200, opacity: 0, scale: 1 }}
                transition={{ duration: 1.3, delay: 0.25, ease: 'easeOut' }}
              />
            ))}
            <m.div
              className="relative h-[120px] w-[120px]"
              initial={{ scale: 0.15, rotate: -140, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE.standard }}
            >
              <Image src={flower} alt="" fill sizes="120px" className="object-contain drop-shadow-[0_8px_14px_rgba(122,31,43,0.3)]" />
            </m.div>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!open ? (
          <m.div key="ask" exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}>
            <p className={`${displayClassName} mt-3 text-[22px] font-semibold leading-[1.4]`} style={{ color: c.ink }}>
              {prompt}
            </p>
            <button
              type="button"
              onClick={reveal}
              className={`${bodyClassName} mt-4 rounded-pill px-6 py-[10px] text-[15px] font-semibold shadow-md`}
              style={{ background: c.button, color: c.buttonInk }}
            >
              {button}
            </button>
          </m.div>
        ) : (
          <m.div key="shown" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9, ease: EASE.entrance }} className="mt-4">
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
