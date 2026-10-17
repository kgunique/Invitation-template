import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';

export interface IncomingCallColors {
  /** The ripples round the picture and the glow of its ring. */
  ring: string;
  /** The name. */
  ink: string;
  /** The lines under the name. */
  soft: string;
  /** What the round picture sits on: any CSS background. */
  disc: string;
  /** The little phone that shakes on the picture's edge. */
  badge: string;
}

export interface IncomingCallProps {
  /** The caller's picture: a photo, or a transparent cut-out of the couple. */
  image: string;
  imageAlt?: string;
  /** CSS object-position, to keep the faces in the circle. */
  focus?: string;
  /** Zoom into the picture (1 = whole), for a full-length cut-out whose faces are small. */
  zoom?: number;
  /** Diameter of the picture, px. */
  size?: number;
  /** Who is calling: the names. */
  name: ReactNode;
  /** The line above the name, e.g. "Wedding invitation". */
  label?: string;
  /** The line under it, e.g. "calling" — three dots pulse after it. */
  status?: string;
  /** A small line under the status, e.g. "Mobile · 18.04.2027". */
  detail?: string;
  /** The faces: the name's, and the rest's. */
  nameClassName?: string;
  bodyClassName?: string;
  colors?: Partial<IncomingCallColors>;
  className?: string;
}

const DEFAULT_COLORS: IncomingCallColors = {
  ring: '#ffd6e0',
  ink: '#ffffff',
  soft: 'rgba(255,255,255,0.78)',
  disc: 'linear-gradient(160deg, #ffe3c2, #f7b4c4)',
  badge: '#34c759',
};

/**
 * An incoming call, as a phone draws it: the caller's round picture with ripples rolling out of it (`amb-halo`) and
 * a glowing ring (`amb-glow-ring`), a small green phone on its edge that shakes like a phone on vibrate
 * (`amb-ring-shake`), a line above the name, the name, and "calling" with three dots that pulse. All CSS; it all
 * stands still under reduced motion. Meant as the words of a gate such as `SlideLock` ("slide to answer").
 */
export function IncomingCall({
  image,
  imageAlt = '',
  focus = '50% 20%',
  zoom = 1,
  size = 136,
  name,
  label,
  status = 'calling',
  detail,
  nameClassName = '',
  bodyClassName = '',
  colors,
  className = '',
}: IncomingCallProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {label && (
        <p className={`${bodyClassName} text-[13px] font-semibold uppercase tracking-[0.22em]`} style={{ color: c.soft }}>
          {label}
        </p>
      )}

      <div className="relative mt-6" style={{ width: size, height: size }}>
        {[0, 1.3].map((d) => (
          <span
            key={d}
            aria-hidden
            className="amb-halo absolute inset-[0] rounded-pill border-2"
            style={{ borderColor: c.ring, animationDelay: `${-d}s`, ['--glow-dur' as string]: '2.6s' } as CSSProperties}
          />
        ))}
        <span
          className="amb-glow-ring absolute inset-[0] overflow-hidden rounded-pill border-[3px]"
          style={{ borderColor: c.ring, background: c.disc, ['--glow' as string]: c.ring } as CSSProperties}
        >
          <Image src={image} alt={imageAlt} fill priority sizes={`${size}px`} className="object-cover" style={{ objectPosition: focus, transform: `scale(${zoom})`, transformOrigin: focus }} />
        </span>
        <span
          aria-hidden
          className="absolute -bottom-[2px] -right-[2px] grid h-[40px] w-[40px] place-items-center rounded-pill border-[3px] border-white shadow-lg"
          style={{ background: c.badge }}
        >
          <span className="amb-ring-shake block" style={{ ['--ring-angle' as string]: '14deg' } as CSSProperties}>
            <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="#ffffff">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
            </svg>
          </span>
        </span>
      </div>

      <h1 className={`${nameClassName} mt-7 leading-[1.15]`} style={{ color: c.ink }}>
        {name}
      </h1>
      <p className={`${bodyClassName} mt-3 flex items-center gap-[2px] text-[17px]`} style={{ color: c.soft }}>
        {status}
        {[0, 0.4, 0.8].map((d) => (
          <span key={d} aria-hidden className="amb-breathe inline-block" style={{ animationDelay: `${d}s`, ['--breathe-from' as string]: 0.15, ['--breathe-to' as string]: 1, ['--breathe-dur' as string]: '0.8s' } as CSSProperties}>
            .
          </span>
        ))}
      </p>
      {detail && (
        <p className={`${bodyClassName} mt-1 text-[13px]`} style={{ color: c.soft, opacity: 0.8 }}>
          {detail}
        </p>
      )}
    </div>
  );
}
