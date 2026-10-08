'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';

export interface TouchRevealColors {
  /** What the card is filled with: any CSS background (a deep night blue). */
  card: string;
  /** The card's outline. */
  line: string;
  /** The gold of the medallion's ring, its glow and the sparks. */
  gold: string;
  /** The prompt's colour. */
  text: string;
  /** The button's fill: any CSS background. */
  button: string;
}

const DEFAULT_COLORS: TouchRevealColors = {
  card: 'linear-gradient(160deg, #071d44 0%, #0a2a5a 58%, #06173a 100%)',
  line: 'rgba(150, 205, 245, 0.7)',
  gold: '#e9b23c',
  text: '#fff6e0',
  button: 'linear-gradient(to right, #1a7fc4, #2aa3e0)',
};

export interface TouchRevealProps {
  /** The picture on the medallion: an icon that fills about 44px (a trident, a lotus). */
  medallion: ReactNode;
  /** The words under the medallion, e.g. "Touch the divine trishul". */
  prompt: string;
  /** The button's words, e.g. "Tap to reveal". */
  button: string;
  /** What appears when it is touched. */
  children: ReactNode;
  /** The faces for the prompt and the button (see `hindiFonts.ts` for Hindi), and the language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  colors?: Partial<TouchRevealColors>;
  /** Called once, at the touch. */
  onReveal?: () => void;
}

// Where the sparks fly to on the touch (px from the medallion's centre): a ring of twelve, deterministic.
const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const r = 96 + (i % 3) * 22;
  return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r), s: 5 + (i % 3) * 2 };
});

/**
 * A card that hides something until it is touched: a night-blue panel with faint rings, a glowing medallion
 * (a ring of gold that breathes, a halo rippling out of it), a line of words and a button. Touch either and
 * the medallion bursts into sparks, the card's contents fade out and `children` rise in their place. For
 * anything that wants a moment of ceremony — a countdown, a date. The medallion, the words, the colours and
 * what is revealed are props. Framer Motion, so it belongs to the invite layer.
 */
export function TouchReveal({
  medallion,
  prompt,
  button,
  children,
  displayClassName = '',
  bodyClassName = '',
  lang,
  colors,
  onReveal,
}: TouchRevealProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [shown, setShown] = useState(false);
  const reveal = () => {
    if (shown) return;
    setShown(true);
    onReveal?.();
  };

  return (
    <div
      lang={lang}
      className="relative overflow-hidden rounded-[26px] border-2 px-5 py-8 shadow-[0_18px_44px_rgba(8,30,70,0.35)]"
      style={{ background: c.card, borderColor: c.line, ['--glow' as string]: c.gold }}
    >
      {/* Faint rings, as if the night were a pool. */}
      {[150, 230, 310, 390].map((d) => (
        <span
          key={d}
          aria-hidden
          className="pointer-events-none absolute left-[50%] top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-pill border"
          style={{ width: d, height: d, borderColor: 'rgba(160, 205, 250, 0.1)' }}
        />
      ))}

      <AnimatePresence mode="wait" initial={false}>
        {shown ? (
          <m.div
            key="revealed"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE.entrance }}
            className="relative"
          >
            {children}
          </m.div>
        ) : (
          <m.div
            key="locked"
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.45, ease: EASE.exit }}
            className="relative flex min-h-[210px] flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={reveal}
              aria-label={prompt}
              className="relative flex h-[92px] w-[92px] items-center justify-center rounded-pill"
            >
              <span aria-hidden className="amb-halo pointer-events-none absolute inset-[0] rounded-pill border-2" style={{ borderColor: c.gold }} />
              <span
                aria-hidden
                className="amb-glow-ring absolute inset-[0] rounded-pill border-[3px]"
                style={{ borderColor: c.gold, background: 'radial-gradient(circle at 50% 40%, #12386f, #0a2146)' }}
              />
              <span className="relative" style={{ color: c.gold }}>
                {medallion}
              </span>
            </button>
            <p className={`${displayClassName} mt-5 text-center text-[22px] font-semibold leading-[1.4]`} style={{ color: c.text }}>
              {prompt}
            </p>
            <button
              type="button"
              onClick={reveal}
              className={`${bodyClassName} mt-4 inline-flex items-center gap-2 rounded-pill px-6 py-[10px] text-[13px] font-semibold tracking-[0.06em] shadow-md`}
              style={{ background: c.button, color: '#ffffff' }}
            >
              <span aria-hidden>✦</span>
              {button}
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* The burst of sparks from the medallion's place, once. */}
      {shown &&
        SPARKS.map((p, i) => (
          <m.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute left-[50%] top-[calc(46%-34px)] rounded-pill"
            style={{ width: p.s, height: p.s, background: c.gold, boxShadow: `0 0 8px ${c.gold}` }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.4 }}
            transition={{ duration: DURATION.slow * 1.6, ease: EASE.exit }}
          />
        ))}
    </div>
  );
}
