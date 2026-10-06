'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { EnvelopeIcon, KeyIcon } from './icons';
import { Petals, type PetalsProps } from './Petals';
import { scrollToTop } from './scrollToTop';

type Bezier = readonly [number, number, number, number];
type PetalConfig = Omit<PetalsProps, 'loop' | 'onDone'>;
type Stage = 'closed' | 'turning' | 'opening' | 'revealed';

export interface SimpleLockColors {
  /** Seam, lock, frame and accent text. */
  accent: string;
  /** Headline and primary text. */
  ink: string;
  /** Secondary text (the message). */
  inkSoft: string;
  /** Falling petals. */
  petal: string;
}

export interface SimpleLockGradient {
  from: string;
  to: string;
  /** CSS angle in degrees. 180 = top to bottom. The right panel mirrors it. */
  angle: number;
}

export interface SimpleLockProps {
  /* ---- content ---- */
  /** Small tracked line above the title. */
  eyebrow?: ReactNode;
  /** The big line, e.g. the couple's names. */
  title?: ReactNode;
  message?: ReactNode;
  /** Label on the pill under the message. */
  buttonLabel?: string;
  /** Screen-reader label for the lock itself. */
  lockLabel?: string;
  /** Top-left / bottom-left slots — a Back link, an Order button, anything. */
  topLeft?: ReactNode;
  bottomLeft?: ReactNode;

  /* ---- look ---- */
  colors?: Partial<SimpleLockColors>;
  gradient?: Partial<SimpleLockGradient>;
  /** 0–1: how dark each panel gets toward the seam. */
  depth?: number;
  /** Any CSS font-family, e.g. "var(--font-festive)" or "'Playfair Display', serif". */
  fonts?: { title?: string; body?: string };
  /** Hairline frame with corner brackets. */
  frame?: boolean;
  /** Lock medallion size in px. */
  lockSize?: number;
  /** Key size in px. */
  keySize?: number;

  /* ---- motion ---- */
  /** Degrees the key turns when tapped. Negative turns it the other way. */
  rotation?: number;
  /** Seconds the key takes to turn. */
  rotationDuration?: number;
  /** Seconds the panels take to slide apart. */
  openDuration?: number;
  /** Cubic-bezier for the panel slide. */
  openEase?: Bezier;
  /** Petals on the closed screen (`ambient`) and on opening (`burst`). `false` turns one off. */
  petals?: { ambient?: PetalConfig | false; burst?: PetalConfig | false };

  /** The moment the panels start sliding — start revealing what's underneath. */
  onOpen?: () => void;
  /** Panels and petals have finished; the lock has removed itself. */
  onOpened?: () => void;
}

const DEFAULT_COLORS: SimpleLockColors = {
  accent: '#d4af37',
  ink: '#f6ecd9',
  inkSoft: '#cbb79a',
  petal: '#a3122f',
};

const DEFAULT_GRADIENT: SimpleLockGradient = { from: '#4a0817', to: '#12030a', angle: 180 };

const CORNERS = [
  'left-5 top-5 border-l-2 border-t-2 rounded-tl-lg',
  'right-5 top-5 border-r-2 border-t-2 rounded-tr-lg',
  'bottom-5 left-5 border-b-2 border-l-2 rounded-bl-lg',
  'bottom-5 right-5 border-b-2 border-r-2 rounded-br-lg',
] as const;

/**
 * A full-screen two-panel gate. Two solid panels meet at a gold seam with a
 * lock on it; tap the lock and the key turns, then the left panel slides off
 * left and the right off right. It removes itself when done.
 *
 * Everything visual is a prop: colors, panel gradient, fonts, key and lock
 * size, key rotation, open timing, and the petals (see ./Petals for their own
 * color/speed/direction). Mount it over the page it reveals and use `onOpen`
 * to start that page's entrance as the panels part.
 *
 * Invite layer only — it uses Framer Motion, which (site) must never import.
 */
export function SimpleLock({
  eyebrow,
  title,
  message,
  buttonLabel = 'Tap to open',
  lockLabel = 'Tap to open the invitation',
  topLeft,
  bottomLeft,
  colors,
  gradient,
  depth = 0.6,
  fonts,
  frame = true,
  lockSize = 112,
  keySize = 56,
  rotation = 420,
  rotationDuration = DURATION.slow,
  openDuration = DURATION.gate,
  openEase = EASE.gate,
  petals,
  onOpen,
  onOpened,
}: SimpleLockProps) {
  const [stage, setStage] = useState<Stage>('closed');
  const [panelsDone, setPanelsDone] = useState(false);
  const [petalsDone, setPetalsDone] = useState(false);

  const c = { ...DEFAULT_COLORS, ...colors };
  const g = { ...DEFAULT_GRADIENT, ...gradient };
  const ambient = petals?.ambient === false ? null : { count: 10, speed: 1.4, ...petals?.ambient };
  const burst = petals?.burst === false ? null : { count: 20, speed: 3, ...petals?.burst };

  const onOpenRef = useRef(onOpen);
  const onOpenedRef = useRef(onOpened);
  useEffect(() => {
    onOpenRef.current = onOpen;
    onOpenedRef.current = onOpened;
  });

  // The sequence is driven by timers, not Framer's onAnimationComplete: the
  // overlay is full-screen, so a callback that never fires (hidden tab,
  // reduced motion) would leave it stuck over the page. The animations stay
  // Framer; only the state progression is decoupled from them.
  useEffect(() => {
    if (stage !== 'turning') return;
    const id = setTimeout(() => {
      // Again, in case the guest scrolled behind the lock while the key turned.
      scrollToTop();
      onOpenRef.current?.();
      setStage('opening');
    }, rotationDuration * 1000);
    return () => clearTimeout(id);
  }, [stage, rotationDuration]);

  useEffect(() => {
    if (stage !== 'opening') return;
    const id = setTimeout(() => setPanelsDone(true), openDuration * 1000 + 100);
    return () => clearTimeout(id);
  }, [stage, openDuration]);

  // Panels and petals both have to finish before the overlay goes away, or a
  // fast petal setting would cut the panels off mid-slide.
  useEffect(() => {
    if (stage === 'opening' && panelsDone && (petalsDone || !burst)) {
      setStage('revealed');
      onOpenedRef.current?.();
    }
  }, [stage, panelsDone, petalsDone, burst]);

  if (stage === 'revealed') return null;

  const panelsOpen = stage === 'opening';
  const slide = { duration: openDuration, ease: openEase };
  const shadow = (side: 'left' | 'right') =>
    `inset ${side === 'left' ? '-' : ''}56px 0 56px -36px rgba(0,0,0,${depth})`;

  const vars = {
    '--invite-ground': g.from,
    '--invite-ground-alt': g.to,
    '--invite-metal': c.accent,
    '--invite-ink': c.ink,
    '--invite-ink-soft': c.inkSoft,
  } as CSSProperties;

  function handleTap() {
    if (stage !== 'closed') return;
    scrollToTop();
    setStage('turning');
  }

  return (
    // No background on this wrapper — only the two panels are opaque, so
    // sliding them apart genuinely uncovers whatever sits underneath.
    // Once opening starts the lock is only a petal shower over a live page, so
    // it must stop catching clicks — a slow petal setting would otherwise keep
    // the page below unclickable for the whole shower.
    <div
      style={vars}
      className={`fixed inset-[0] z-gate overflow-hidden ${panelsOpen ? 'pointer-events-none' : ''}`}
    >
      <m.div
        className="absolute inset-y-[0] left-[0] w-1/2 border-r border-invite-metal"
        style={{ background: `linear-gradient(${g.angle}deg, ${g.from}, ${g.to})`, boxShadow: shadow('left') }}
        initial={false}
        animate={{ x: panelsOpen ? '-100%' : '0%' }}
        transition={slide}
      />
      <m.div
        className="absolute inset-y-[0] right-[0] w-1/2 border-l border-invite-metal"
        style={{
          background: `linear-gradient(${(360 - g.angle) % 360}deg, ${g.from}, ${g.to})`,
          boxShadow: shadow('right'),
        }}
        initial={false}
        animate={{ x: panelsOpen ? '100%' : '0%' }}
        transition={slide}
      />

      <m.div
        className="absolute inset-[0] flex flex-col items-center justify-between px-6 py-8 text-center"
        animate={{ opacity: stage === 'closed' || stage === 'turning' ? 1 : 0 }}
        transition={{ duration: DURATION.quick }}
      >
        {ambient && <Petals color={c.petal} {...ambient} />}

        {frame && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-2xl border border-[color-mix(in_srgb,var(--invite-metal)_18%,transparent)]"
            />
            {CORNERS.map((corner) => (
              <span
                key={corner}
                aria-hidden
                className={`pointer-events-none absolute h-[28px] w-[28px] border-[color-mix(in_srgb,var(--invite-metal)_45%,transparent)] ${corner}`}
              />
            ))}
          </>
        )}

        <div className="relative flex w-full items-center justify-start">{topLeft}</div>

        <div className="flex flex-col items-center">
          {eyebrow && (
            <p className="invite-eyebrow text-invite-metal" style={{ fontFamily: fonts?.body }}>
              {eyebrow}
            </p>
          )}
          {title && (
            <p className="invite-names mt-4 text-invite-ink" style={{ fontFamily: fonts?.title }}>
              {title}
            </p>
          )}

          <button
            type="button"
            onClick={handleTap}
            aria-label={lockLabel}
            className="relative mx-auto mt-10 flex items-center justify-center border-2 border-invite-metal bg-invite-ground-alt"
            style={{ width: lockSize, height: lockSize, borderRadius: lockSize * 0.29 }}
          >
            <span
              className="absolute rounded-pill border border-dashed border-[color-mix(in_srgb,var(--invite-metal)_60%,transparent)]"
              style={{ inset: lockSize * 0.1 }}
            />
            <span
              className="absolute rounded-pill border border-dashed border-[color-mix(in_srgb,var(--invite-metal)_40%,transparent)]"
              style={{ inset: lockSize * 0.2 }}
            />
            <m.span
              animate={{ rotate: stage === 'turning' ? rotation : 0 }}
              transition={{ duration: rotationDuration, ease: EASE.standard }}
              className="flex text-invite-metal"
              style={{ width: keySize, height: keySize }}
            >
              <KeyIcon className="h-full w-full" />
            </m.span>
          </button>

          {message && (
            <p
              className="invite-body mt-8 max-w-[26ch] whitespace-pre-line text-invite-ink-soft"
              style={{ fontFamily: fonts?.body }}
            >
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleTap}
            className="action mt-8 inline-flex items-center gap-2 rounded-pill border border-invite-metal px-6 py-3 text-invite-metal"
            style={{ fontFamily: fonts?.body }}
          >
            <EnvelopeIcon /> {buttonLabel}
          </button>
        </div>

        <div className="relative flex w-full justify-start">{bottomLeft}</div>
      </m.div>

      {stage === 'opening' && burst && (
        <Petals color={c.petal} {...burst} loop={false} onDone={() => setPetalsDone(true)} />
      )}
    </div>
  );
}
