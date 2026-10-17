'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { grainBackground } from './Grain';
import { useOpenSequence } from './useOpenSequence';

export interface BloomLockColors {
  /** The seam's gold and the label's glow. */
  accent: string;
  /** The label. */
  ink: string;
  /** The bright thread down the middle of the seam. */
  seam: string;
  /** What fills in under the copies as they spread, so no gap between them shows the cover: the flower's own colour. */
  bed: string;
}

export interface BloomLockProps {
  /** The picture that hops in the middle and blooms into many (a rose, a lotus, a marigold): transparent, square. */
  image: string;
  imageAlt?: string;
  /** The line under it; it glows. */
  label?: string;
  /** Classes for the label: its font and size. */
  labelClassName?: string;
  /** Screen-reader label for the picture (it is the button). */
  lockLabel?: string;
  /** Width of the picture before the tap, in px. */
  size?: number;
  /** How high it hops, in px. */
  hop?: number;
  /** Size of each copy as a share of half the screen's diagonal (so the count is the same on any screen). Smaller = more copies. */
  copySize?: number;
  /** Ms between one copy and the next growing out of it. */
  step?: number;
  /** Ms each copy takes to grow out of the one before it. */
  growMs?: number;
  /** Degrees the whole spiral turns while it grows. */
  turn?: number;
  /** Teeth of the zigzag seam, top to bottom. */
  teeth?: number;
  /** How far each tooth reaches either side of the middle, as a % of the width. */
  toothWidth?: number;
  /** The cover's two halves: any CSS background. */
  background?: string;
  /** Paper grain over the cover (0 for none). */
  grain?: number;
  colors?: Partial<BloomLockColors>;
  /** Ms the seam takes to draw before the halves part. */
  seamMs?: number;
  /** Ms the halves take to part (and the copies to scatter) before the cover removes itself. */
  partMs?: number;
  /** At the tap itself (inside the click handler): start anything a browser only lets a tap start, like music. */
  onTap?: () => void;
  /** The halves begin to part: start revealing what is underneath. */
  onOpen?: () => void;
  /** The cover has gone. */
  onOpened?: () => void;
}

const DEFAULT_COLORS: BloomLockColors = {
  accent: '#c9962b',
  ink: '#7a1f2b',
  seam: '#fff4cf',
  bed: '#5c0a12',
};

interface Copy {
  key: number;
  /** Where it ends, in px from the middle (before the spiral's turn). */
  x: number;
  y: number;
  /** Where it grows from: the copy before it. */
  fromX: number;
  fromY: number;
  /** Its own tilt, so they don't all face one way. */
  rot: number;
  /** Seconds after the tap it starts. */
  delay: number;
}

interface Bloom {
  /** Each copy's size in px. */
  size: number;
  copies: Copy[];
  /** Ms from the tap until the last copy is home. */
  ms: number;
}

/**
 * The copies as one chain along an Archimedean spiral out of the middle, worked out from the screen's size (so only
 * after the tap, in the browser): evenly spaced along the curve, the turns as close as the copies are, so they overlap
 * and nothing shows between them, out until the spiral covers the screen's corners. Each grows out of the one before
 * it, `step` ms later, so the chain winds outward copy by copy.
 */
function layoutSpiral(w: number, h: number, share: number, step: number, grow: number): Bloom {
  const reach = Math.hypot(w, h) / 2;
  const size = reach * share;
  const along = size * 0.7;
  // r = a·θ, one turn further out every `along` px
  const a = along / (2 * Math.PI);
  const copies: Copy[] = [];
  // Half a turn in: the first copies tuck under the middle one, so the centre has no gap.
  let theta = Math.PI;
  let prev = { x: 0, y: 0 };
  for (let i = 0; ; i++) {
    const r = a * theta;
    if (r > reach + size * 0.4) break;
    const x = Math.round(r * Math.cos(theta));
    const y = Math.round(r * Math.sin(theta));
    copies.push({ key: i, x, y, fromX: prev.x, fromY: prev.y, rot: ((i * 47) % 50) - 25, delay: (i * step) / 1000 });
    prev = { x, y };
    theta += along / Math.hypot(r, a);
  }
  return { size, copies, ms: copies.length * step + grow };
}

/** The zigzag down the middle, as % points: x swings `tooth` either side of 50 at each step down. */
function seamPoints(teeth: number, tooth: number) {
  return Array.from({ length: teeth + 1 }, (_, i) => [50 + (i % 2 ? tooth : -tooth), (i / teeth) * 100] as const);
}

/**
 * A full-screen cover with one picture hopping in the middle and a glowing line under it ("Touch the rose"). Touch
 * it: it spins and settles in the middle, and a second copy grows out of it, a third out of that and so on, winding
 * outward in a spiral that slowly turns, until the screen is nothing but copies (the `bed` colour fills in under them
 * so no gap shows the cover). Then a gold zigzag draws itself down the middle, from the centre up and down, and the
 * cover opens along it like a gate: each half — the copies on it cut along the zigzag — swings ajar, holds while its
 * copies burst outward and fade, then slides away, uncovering the page.
 *
 * Any square transparent picture works; the colours, the cover, the copies' size and pace and the seam are props.
 * Built on `useOpenSequence` (timer-driven: `onOpen` when the halves begin to part). The hop and the label's glow are
 * CSS (`amb-hop`, `amb-glow-text`); the growing, the seam and the parting are Framer Motion.
 */
export function BloomLock({
  image,
  imageAlt = '',
  label = 'Touch the rose',
  lockLabel = 'Touch the rose to open the invitation',
  labelClassName = 'font-display text-[22px]',
  size = 150,
  hop = 26,
  copySize = 0.24,
  step = 30,
  growMs = 1300,
  turn = 150,
  teeth = 14,
  toothWidth = 4,
  background = 'radial-gradient(circle at 50% 45%, #fff8f2 0%, #fbe8e1 55%, #f3d3cc 100%)',
  grain = 0.16,
  colors,
  seamMs = 900,
  partMs = 2200,
  onTap,
  onOpen,
  onOpened,
}: BloomLockProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [bloom, setBloom] = useState<Bloom | null>(null);
  // The spiral is complete: the seam draws, and the copies are now the ones on the gate's halves.
  const [full, setFull] = useState(false);
  const { stage, opening, fading, open } = useOpenSequence({
    openMs: (bloom?.ms ?? 0) + seamMs,
    fadeMs: partMs,
    onTap,
    onOpen,
    onOpened,
  });

  useEffect(() => {
    if (!bloom) return;
    const id = setTimeout(() => setFull(true), bloom.ms);
    return () => clearTimeout(id);
  }, [bloom]);

  if (stage === 'revealed') return null;

  const tap = () => {
    if (stage !== 'closed') return;
    setBloom(layoutSpiral(window.innerWidth, window.innerHeight, copySize, step, growMs));
    open();
  };

  const points = seamPoints(teeth, toothWidth);
  const edge = points.map(([x, y]) => `${x}% ${y}%`).join(', ');
  const cover = grain ? `${grainBackground(grain)}, ${background}` : background;
  const clip = (side: 'left' | 'right') =>
    side === 'left' ? `polygon(0% 0%, ${edge}, 0% 100%)` : `polygon(100% 0%, ${edge}, 100% 100%)`;
  const seamLine = points.map(([x, y]) => `${x},${y}`).join(' ');
  const bloomS = (bloom?.ms ?? 0) / 1000;
  const box = (s: number): CSSProperties => ({ width: s, height: s, left: -s / 2, top: -s / 2 });
  // The gate swings ajar (to 30% of the way), holds while the copies on it burst outward and fade, then slides away.
  const scatterDelay = (partMs / 1000) * 0.3;

  // The seam draws from the middle outward: a box over it that opens from a line at half height to the full height.
  const seam = (
    <m.div
      aria-hidden
      className="absolute inset-[0]"
      initial={false}
      animate={{ clipPath: full ? 'inset(0% 0% 0% 0%)' : 'inset(50% 0% 50% 0%)' }}
      transition={{ duration: seamMs / 1000, ease: EASE.standard }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" style={{ filter: `drop-shadow(0 0 8px ${c.accent})` }}>
        <polyline points={seamLine} fill="none" stroke={c.accent} strokeOpacity={0.45} strokeWidth={12} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <polyline points={seamLine} fill="none" stroke={c.accent} strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <polyline points={seamLine} fill="none" stroke={c.seam} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
    </m.div>
  );

  // The finished spiral, standing still at its last turn: drawn once in each half of the gate (clipped along the
  // zigzag) so it is cut along the seam and parts with the gate. Mounted (unseen) from the tap, so its pictures are
  // painted before it takes over from the growing one and nothing flickers at the swap.
  const settled = bloom && (
    <div aria-hidden className="absolute left-1/2 top-1/2 h-[0] w-[0]" style={{ transform: `rotate(${turn}deg)`, opacity: full ? 1 : 0 }}>
      {bloom.copies.map((p) => (
        <m.div
          key={p.key}
          className="absolute"
          style={box(bloom.size)}
          initial={false}
          animate={
            fading
              ? { x: p.x * 2.4, y: p.y * 2.4, scale: 1.2, rotate: p.rot + 160, opacity: 0 }
              : { x: p.x, y: p.y, scale: 1, rotate: p.rot, opacity: 1 }
          }
          transition={fading ? { duration: (partMs / 1000) * 0.45, ease: EASE.exit, delay: scatterDelay + (p.key % 7) * 0.04 } : { duration: 0 }}
        >
          <Image src={image} alt="" fill sizes={`${Math.ceil(bloom.size)}px`} className="object-contain" />
        </m.div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-[0] z-content overflow-hidden" style={{ pointerEvents: stage === 'closed' ? 'auto' : 'none' }}>
      {/* The two halves of the gate: the cover, the bed filling in, the settled copies and the seam's gold over them,
          clipped along the zigzag; they part to either side. */}
      {(['left', 'right'] as const).map((side) => (
        <m.div
          key={side}
          className="pointer-events-none absolute inset-[0]"
          style={{ clipPath: clip(side), background: cover }}
          initial={false}
          animate={{ x: fading ? (side === 'left' ? ['0%', '-30%', '-33%', '-62%'] : ['0%', '30%', '33%', '62%']) : '0%' }}
          transition={fading ? { duration: partMs / 1000, times: [0, 0.3, 0.7, 1], ease: ['easeOut', 'linear', 'easeIn'] } : { duration: 0 }}
        >
          <m.div
            aria-hidden
            className="absolute inset-[0]"
            style={{ background: c.bed }}
            initial={false}
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{ duration: bloomS * 0.8, delay: bloomS * 0.2, ease: 'easeIn' }}
          />
          {settled}
          {seam}
        </m.div>
      ))}

      {/* The spiral growing: each copy grows out of the one before it while the whole turns. Gone once it is full. */}
      {bloom && !full && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[0] w-[0]"
          initial={{ rotate: 0 }}
          animate={{ rotate: turn }}
          transition={{ duration: bloomS, ease: 'easeInOut' }}
        >
          {bloom.copies.map((p) => (
            <m.div
              key={p.key}
              className="absolute"
              style={box(bloom.size)}
              initial={{ x: p.fromX, y: p.fromY, scale: 0.25, rotate: p.rot - 120, opacity: 0 }}
              animate={{ x: p.x, y: p.y, scale: 1, rotate: p.rot, opacity: 1 }}
              transition={{ duration: growMs / 1000, delay: p.delay, ease: EASE.standard, opacity: { duration: 0.3, delay: p.delay } }}
            >
              <Image src={image} alt="" fill sizes={`${Math.ceil(bloom.size)}px`} className="object-contain" />
            </m.div>
          ))}
        </m.div>
      )}

      {/* The picture in the middle and the line under it. Touched: it spins and settles as the first of the chain. */}
      <div className="absolute inset-[0] flex flex-col items-center justify-center">
        <m.button
          type="button"
          onClick={tap}
          aria-label={lockLabel}
          className="relative cursor-pointer focus:outline-none"
          style={{ width: size, height: size }}
          initial={false}
          animate={
            fading
              ? { scale: 1.4, rotate: 420, opacity: 0 }
              : opening
                ? { scale: (bloom?.size ?? size) / size, rotate: 360, opacity: 1 }
                : { scale: 1, rotate: 0, opacity: 1 }
          }
          transition={{ duration: fading ? 0.45 : 1.4, ease: EASE.standard }}
        >
          <span className={`absolute inset-[0] ${opening ? '' : 'amb-hop'}`} style={{ '--hop-y': `${hop}px`, '--hop-dur': '1.8s' } as CSSProperties}>
            <Image src={image} alt={imageAlt} fill priority sizes={`${size}px`} className="object-contain drop-shadow-[0_10px_14px_rgba(122,31,43,0.28)]" />
          </span>
        </m.button>
        <m.p
          className={`amb-glow-text mt-10 italic tracking-[0.04em] ${labelClassName}`}
          style={{ '--glow': c.ink } as CSSProperties}
          initial={false}
          animate={{ opacity: opening ? 0 : 1, y: opening ? 10 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {label}
        </m.p>
      </div>
    </div>
  );
}
