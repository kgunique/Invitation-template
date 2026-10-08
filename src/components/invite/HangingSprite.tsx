import Image from 'next/image';
import type { CSSProperties } from 'react';

export interface HangingSpriteProps {
  /** A picture of something that hangs: a garland, a bell, a toran. Any transparent PNG/WebP. */
  src: string;
  /** The picture's own size, so its shape is kept. */
  width: number;
  height: number;
  /** How wide to draw it: px, or any CSS length such as a share of the parent ("12%"). Its height follows. */
  size: number | string;
  /** Where it hangs: CSS `left` / `right` / `top` of an absolutely placed box. Give `left` or `right`, and `top` (default 0). */
  left?: string | number;
  right?: string | number;
  top?: string | number;
  /** How far it leans either way as it swings, in degrees. */
  angle?: number;
  /** Seconds a swing, and a negative delay so neighbours don't move in step. */
  duration?: number;
  delay?: number;
  /** Mirror it. */
  flip?: boolean;
  /** Fetch the picture at once instead of when it nears the screen: for a sprite in a scene that must be complete the moment it appears. */
  eager?: boolean;
  className?: string;
}

/**
 * Anything with a picture that hangs from the top: it swings left and right from
 * its top edge (CSS only: `amb-sway amb-sway--hang`, so it costs no JavaScript
 * and stops under reduced motion). Absolutely placed, so put it in a `relative`
 * parent — a card, a section. Give each of a group its own duration and delay.
 */
export function HangingSprite({
  src,
  width,
  height,
  size,
  left,
  right,
  top = 0,
  angle = 2.5,
  duration = 5,
  delay = 0,
  flip = false,
  eager = false,
  className = '',
}: HangingSpriteProps) {
  return (
    <span
      aria-hidden
      className={`amb-sway amb-sway--hang pointer-events-none absolute block ${className}`}
      style={
        {
          left,
          right,
          top,
          width: size,
          aspectRatio: `${width} / ${height}`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--sway-angle': `${angle}deg`,
        } as CSSProperties
      }
    >
      <Image src={src} alt="" fill loading={eager ? 'eager' : undefined} sizes={typeof size === 'number' ? `${size * 2}px` : '50vw'} className={`object-contain ${flip ? '-scale-x-100' : ''}`} />
    </span>
  );
}
