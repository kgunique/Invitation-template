import type { CSSProperties } from 'react';
import Image from 'next/image';

export interface ImageRingProps {
  /** Any transparent picture: a rose, a marigold, a lotus. */
  image: string;
  /** How many copies round the ring. */
  count?: number;
  /** Radius of the ring to each copy's centre, px. */
  radius?: number;
  /** Width of each copy, px. */
  size?: number;
  /** Seconds per turn; 0 holds it still. */
  duration?: number;
  /** Turn the other way. */
  reverse?: boolean;
  /** Position it (it is a box `2 × (radius + size/2)` square); it ignores the pointer. */
  className?: string;
  style?: CSSProperties;
}

/**
 * A wreath: copies of one picture set round a circle, each turned to face along it, and the whole turning slowly
 * (`amb-turn`, CSS only; still under reduced motion). Put words or a picture in its middle with a sibling.
 */
export function ImageRing({ image, count = 14, radius = 120, size = 46, duration = 120, reverse = false, className = '', style }: ImageRingProps) {
  const box = 2 * (radius + size / 2);
  return (
    <div aria-hidden className={`pointer-events-none ${className}`} style={{ width: box, height: box, ...style }}>
      <div
        className={`relative h-full w-full ${duration ? 'amb-turn' : ''}`}
        style={{ '--turn-dur': `${duration}s`, '--turn-dir': reverse ? 'reverse' : 'normal' } as CSSProperties}
      >
        {Array.from({ length: count }, (_, i) => {
          const deg = (i / count) * 360;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ width: size, height: size, margin: -size / 2, transform: `rotate(${deg}deg) translateY(${-radius}px) rotate(${(i % 3) * 14 - 14}deg)` }}
            >
              <Image src={image} alt="" fill sizes={`${size}px`} className="object-contain" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
