'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { m, useInView } from 'motion/react';
import { EASE } from '@/styles/motion';

export interface ConvergingPiece {
  /** A layer of one picture, the whole picture's size, transparent where it is not this layer's (the layers laid one on another make the picture). Two layers that must travel together (a hand and the thumb in front of the other hand) take the same `from` and `delay`. */
  src: string;
  /** The side it travels in from. */
  from: 'left' | 'right';
  /** Seconds after the section scrolls into view before it starts. */
  delay: number;
}

export interface ConvergingPiecesProps {
  /** The pieces, bottom to top. */
  pieces: ConvergingPiece[];
  /** What shows behind them while they travel: any CSS background (a blurred copy of the picture, say). It is also what fills the box before the first piece arrives. */
  backdrop?: string;
  /** What the whole picture shows, for screen readers. */
  alt: string;
  /** Seconds each piece takes to arrive. */
  duration?: number;
  /** How far outside it starts, as a share of the box's width. */
  distance?: number;
  /** Shown once the pieces have met (fades in at `meetAt` seconds), in front of them: a flash, a sparkle. A node that fills the box. Keep it light — a glow over the pieces washes out what is under it. */
  overlay?: ReactNode;
  /** The same, but behind the pieces: an aura that shows round them. */
  behind?: ReactNode;
  meetAt?: number;
  /** Where the sizes hint says the box will be wide: an `<Image sizes>` value. */
  sizes?: string;
  className?: string;
}

/**
 * A picture that assembles itself: it is cut into layers (say, one hand and the other, and a thumb that lies in front) and each slides
 * in from its own side, one after another, to meet in the middle and make the whole. Each layer is a whole
 * object (the part another one hides is painted in), so while they travel each looks right on its own, and
 * once they are home no seam shows. Fills its
 * positioned parent (an `GoldArch`, a card) and clips to it; starts, once, when it is in view and every picture has loaded.
 * Framer Motion, so it belongs to the invite layer.
 */
export function ConvergingPieces({
  pieces,
  backdrop,
  alt,
  duration = 1.5,
  distance = 0.5,
  overlay,
  behind,
  meetAt = 3,
  sizes = '(min-width: 480px) 340px, 80vw',
  className = '',
}: ConvergingPiecesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [loaded, setLoaded] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  // The pieces are fetched at once, and the show starts only when all of them are there (or, on a very slow
  // connection, six seconds after the box came into view): a hand that slides in before its picture has
  // arrived pops in half-drawn and the order of the sequence is lost.
  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => setGaveUp(true), 6000);
    return () => window.clearTimeout(id);
  }, [inView]);
  const go = inView && (loaded >= pieces.length || gaveUp);
  const done = () => setLoaded((n) => n + 1);

  return (
    <m.div
      ref={ref}
      role="img"
      aria-label={alt}
      initial="hidden"
      animate={go ? 'shown' : 'hidden'}
      className={`absolute inset-[0] ${className}`}
      style={{ background: backdrop }}
    >
      {behind && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-[0]"
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 1.6, delay: meetAt } } }}
        >
          {behind}
        </m.div>
      )}
      {pieces.map((p) => (
        <m.div
          key={p.src}
          aria-hidden
          className="absolute inset-[0]"
          variants={{
            hidden: { opacity: 0, x: `${(p.from === 'left' ? -1 : 1) * distance * 100}%` },
            shown: { opacity: 1, x: '0%', transition: { duration, delay: p.delay, ease: EASE.entrance } },
          }}
        >
          <Image src={p.src} alt="" fill sizes={sizes} loading="eager" onLoad={done} onError={done} className="object-cover" />
        </m.div>
      ))}
      {overlay && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-[0]"
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 1.4, delay: meetAt } } }}
        >
          {overlay}
        </m.div>
      )}
    </m.div>
  );
}
