'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { HeartNames, type HeartNamesProps } from './HeartNames';

// The picture dissolves at both edges, so on a dark page it simply melts into
// the sky above and below it instead of ending in a hard line.
const FADE = 'linear-gradient(to bottom, transparent 0%, #000 8%, #000 60%, transparent 100%)';

export interface CoupleSceneProps {
  /** The artwork of the couple, groom on the left and bride on the right. */
  image: string;
  /** What the picture shows, for screen readers. */
  alt?: string;
  /** The groom's name: it stands on the left, under him. */
  left: string;
  /** The bride's name: it stands on the right, under her. */
  right: string;
  /** CSS object-position, for cropping a landscape picture into the portrait
   * frame: the point of the picture to keep in the middle. */
  focus?: string;
  /** Overrides for the names-into-a-heart animation (colours, timing). */
  heart?: Omit<HeartNamesProps, 'left' | 'right'>;
}

/**
 * An opening scene for a dark page: the couple's artwork, fading into the page
 * at its edges and settling in with a slow zoom, and under it the two names,
 * each on its own side, which come together and are packed into a red heart
 * (<HeartNames />). Works with any artwork and any two names.
 *
 * The artwork fills the width in a 4:5 frame; a wider picture is cropped
 * around `focus`. Invite layer only (Framer Motion).
 */
export function CoupleScene({ image, alt = '', left, right, focus = '45% 50%', heart }: CoupleSceneProps) {
  return (
    <section className="relative">
      <m.div
        className="relative aspect-[4/5] w-full"
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease: EASE.entrance }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="(min-width: 480px) 480px, 100vw"
          className="object-cover"
          style={{ objectPosition: focus }}
        />
      </m.div>

      {/* The names start over the lowest part of the picture, where it has
          already faded into the sky. */}
      <div className="relative -mt-[140px]">
        <HeartNames left={left} right={right} {...heart} />
      </div>
    </section>
  );
}
