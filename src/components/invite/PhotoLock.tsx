'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { useOpenSequence } from './useOpenSequence';

export interface PhotoLockColors {
  /** The glowing ring, the halo, the star and the "tap to open" text. */
  accent: string;
  /** The monogram. */
  ink: string;
  /** What the disc is filled with: any CSS colour (translucent looks best over a photo). */
  disc: string;
  /** The wash of light the screen brightens to as the camera pushes in. */
  flash: string;
}

export interface PhotoLockProps {
  /** The photograph or painting that fills the screen. Give this or `scene`. */
  image?: string;
  /** What it shows, for screen readers. */
  imageAlt?: string;
  /** Instead of a picture, anything that fills the screen (a painted sky with things in it, drifting clouds, falling petals): it is
   * pushed into like the picture is, so lay it out in a box that fills the screen. */
  scene?: ReactNode;
  /** CSS object-position: which part of the picture to keep when the screen is
   * narrower than it is. */
  focus?: string;
  /** Where the camera pushes in to, as a CSS transform-origin on the screen:
   * the doorway, the window, the gap in the trees. */
  zoomOrigin?: string;
  /** How far the camera pushes in (a scale). */
  zoom?: number;

  /** The monogram on the disc, e.g. "A & P". An "&" is picked out in the accent colour. */
  initials: string;
  /** The words under the monogram; they glow. */
  label?: string;
  /** Screen-reader label for the disc. */
  lockLabel?: string;
  /** Diameter of the disc in px. */
  size?: number;
  /** How far down the screen the disc floats, as a CSS length or percentage. */
  top?: string;
  /** The small ornament above the monogram. */
  ornament?: ReactNode;

  colors?: Partial<PhotoLockColors>;

  /** Ms from the tap until the camera is in and `onOpen` fires. */
  openMs?: number;
  /** Ms the cover then takes to fade away. */
  fadeMs?: number;
  /** At the tap itself (inside the click handler): start anything a browser only lets a tap start, like music. */
  onTap?: () => void;
  /** The camera is in: start revealing what's underneath. */
  onOpen?: () => void;
  /** The cover has faded and removed itself. */
  onOpened?: () => void;
}

const DEFAULT_COLORS: PhotoLockColors = {
  accent: '#c9962b',
  ink: '#3e2a12',
  disc: 'rgba(255, 251, 240, 0.86)',
  flash: '#fff6e0',
};

/**
 * A full-screen photograph with a glowing disc floating over it. The disc has a
 * gold ring that breathes, a halo that ripples out from it, a monogram, and a
 * "tap to open" line whose text glows. Tap it and the disc swells and fades
 * while the camera pushes into the picture (toward `zoomOrigin`), the screen
 * washes to light, then the cover fades to the page beneath.
 *
 * Any picture and any monogram work; the disc's size and position, the colours
 * and the camera's target and reach are props. Mount it over the page it
 * reveals and use `onOpen` to start that page's entrance. The glows are CSS
 * (.amb-glow-ring, .amb-halo, .amb-glow-text in motion.css), the push-in is
 * Framer Motion — invite layer only.
 */
export function PhotoLock({
  image,
  scene,
  imageAlt = '',
  focus = '50% 50%',
  zoomOrigin = '50% 45%',
  zoom = 2.6,
  initials,
  label = 'Tap to open',
  lockLabel = 'Tap to open the invitation',
  size = 200,
  top = '14%',
  ornament = '✦',
  colors,
  openMs = 1700,
  fadeMs = 900,
  onTap,
  onOpen,
  onOpened,
}: PhotoLockProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const { stage, opening, fading, open } = useOpenSequence({ openMs, fadeMs, onTap, onOpen, onOpened });

  if (stage === 'revealed') return null;

  const glow = { '--glow': c.accent } as CSSProperties;
  const [first, second] = initials.split('&').map((s) => s.trim());

  return (
    <m.div
      className="fixed inset-[0] z-content overflow-hidden"
      style={{ pointerEvents: stage === 'closed' ? 'auto' : 'none' }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fadeMs / 1000 }}
    >
      {/* The picture, which the camera pushes into. */}
      <m.div
        className="absolute inset-[0]"
        style={{ transformOrigin: zoomOrigin }}
        initial={false}
        animate={{ scale: opening ? zoom : 1 }}
        transition={{ duration: 1.9, ease: EASE.gate }}
      >
        {scene ?? (
          image && (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focus }}
            />
          )
        )}
      </m.div>

      {/* The light the camera walks into. */}
      <m.div
        aria-hidden
        className="absolute inset-[0]"
        style={{ background: c.flash }}
        initial={false}
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: EASE.standard }}
      />

      {/* The disc. */}
      <div className="absolute inset-x-[0] flex justify-center" style={{ top }}>
        <m.button
          type="button"
          onClick={open}
          aria-label={lockLabel}
          className="relative flex items-center justify-center rounded-pill"
          style={{ width: size, height: size, ...glow }}
          initial={false}
          animate={opening ? { scale: 1.35, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE.exit }}
        >
          {/* A ring that ripples outward and fades. */}
          <span
            aria-hidden
            className="amb-halo pointer-events-none absolute inset-[0] rounded-pill border-2"
            style={{ borderColor: c.accent }}
          />
          {/* The disc itself, with its breathing gold ring. */}
          <span
            className="amb-glow-ring absolute inset-[0] rounded-pill border-[3px] backdrop-blur-sm"
            style={{ borderColor: c.accent, background: c.disc }}
          />
          {/* A fine inner ring. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[8px] rounded-pill border"
            style={{ borderColor: `color-mix(in srgb, ${c.accent} 45%, transparent)` }}
          />

          <span className="relative flex flex-col items-center">
            <span aria-hidden className="text-[18px] leading-none" style={{ color: c.accent }}>
              {ornament}
            </span>
            <span className="display-lg mt-2 italic leading-none" style={{ color: c.ink }}>
              {second ? (
                <>
                  {first}
                  <span className="mx-1 not-italic" style={{ color: c.accent }}>
                    &amp;
                  </span>
                  {second}
                </>
              ) : (
                initials
              )}
            </span>
            <span aria-hidden className="mt-3 block h-[1px] w-[44px]" style={{ background: c.accent, opacity: 0.6 }} />
            <span
              className="amb-glow-text caption mt-3 font-bold uppercase tracking-[0.22em]"
              style={{ color: c.accent }}
            >
              {label}
            </span>
          </span>
        </m.button>
      </div>
    </m.div>
  );
}
