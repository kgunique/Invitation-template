'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';

export interface SlideInFigureProps {
  /** A cut-out picture (transparent WebP/PNG) of someone or something. */
  src: string;
  /** What it shows, for screen readers. Leave empty if it is only decoration. */
  alt?: string;
  /** The picture's own size, so its shape is kept. */
  width: number;
  height: number;
  /** Which edge of the screen it walks in from. It ends up against that edge. */
  from: 'left' | 'right';
  /** How wide to draw it, as a CSS length (a share of the parent, say). */
  size: string;
  /** How far it stands from the edge it came from, and from the bottom (CSS lengths; negative lets it run off). */
  edge?: string;
  bottom?: string;
  /** Seconds before it starts to come in. */
  delay?: number;
  /** Seconds the walk takes. */
  duration?: number;
  /** Seconds a breath takes once it has arrived (it rises and falls a pixel or two). 0 for none. */
  breathe?: number;
  /** For a figure whose top was cut off by its source picture (hair running into the edge): fade it out over this height (a CSS length) so no hard line shows. */
  fadeTop?: string;
  /** Set false to hold it off-screen until the page is ready to show it (default: it walks in at once). */
  play?: boolean;
  /** Called when its picture has loaded (or failed to), so a page can start a sequence only once everything in it can be seen. */
  onLoad?: () => void;
  className?: string;
}

/**
 * A figure that slides in from the left or the right edge of its box and settles,
 * then breathes (a slow, tiny rise and fall: CSS, `amb-bob`, so it stops under
 * reduced motion). Absolutely placed in the nearest positioned ancestor; give two
 * of them opposite `from`s and a pair meets in the middle. Framer Motion, so it
 * belongs to the invite layer.
 */
export function SlideInFigure({
  src,
  alt = '',
  width,
  height,
  from,
  size,
  edge = '0px',
  bottom = '0px',
  delay = 0,
  duration = 1.6,
  breathe = 3.4,
  fadeTop,
  play = true,
  onLoad,
  className = '',
}: SlideInFigureProps) {
  const dir = from === 'left' ? -1 : 1;
  return (
    <m.div
      className={`pointer-events-none absolute ${className}`}
      style={{ [from]: edge, bottom, width: size, aspectRatio: `${width} / ${height}` }}
      initial={{ x: `${dir * 130}%`, opacity: 0 }}
      animate={play ? { x: '0%', opacity: 1 } : { x: `${dir * 130}%`, opacity: 0 }}
      transition={{ duration, delay, ease: EASE.entrance }}
    >
      <span
        className={`block h-full w-full ${breathe ? 'amb-bob' : ''}`}
        style={{ ['--bob-dur' as string]: `${breathe}s`, ['--bob-y' as string]: '-3px' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="50vw"
          loading="eager"
          onLoad={onLoad}
          onError={onLoad}
          className="object-contain object-bottom"
          style={fadeTop ? { maskImage: `linear-gradient(to bottom, transparent 0, #000 ${fadeTop})`, WebkitMaskImage: `linear-gradient(to bottom, transparent 0, #000 ${fadeTop})` } : undefined}
        />
      </span>
    </m.div>
  );
}
