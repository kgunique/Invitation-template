'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import type { InviteGalleryItem } from '@/content/invites';
import { EASE } from '@/styles/motion';

export interface PhotoStoriesProps {
  items: InviteGalleryItem[];
  /** The album's name over the grid, e.g. "Recents", and its count line ("6 photos"). */
  album?: string;
  countLabel?: (n: number) => string;
  /** The name and picture in the story viewer's corner. */
  owner?: string;
  ownerAvatar?: string;
  /** Ms each story stays before the next. */
  storyMs?: number;
  colors?: { ink?: string; soft?: string; ring?: string };
  className?: string;
}

/**
 * The gallery as a phone's photos: an album name and count over a grid (the first picture large, then three to a
 * row, square), each picture with a story ring; tap one and it opens full screen as a story — bars across the top
 * fill one by one, it moves on by itself, tap the right or left of the screen to go on or back, ✕ / Esc / the last
 * story's end to close. The viewer is portalled to `<body>` (above the page's chrome) and locks the page's scroll.
 * Under reduced motion it does not move on by itself.
 */
export function PhotoStories({
  items,
  album = 'Recents',
  countLabel = (n) => `${n} photos`,
  owner,
  ownerAvatar,
  storyMs = 4200,
  colors,
  className = '',
}: PhotoStoriesProps) {
  const c = { ink: '#ffffff', soft: 'rgba(255,255,255,0.6)', ring: 'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf)', ...colors };
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between px-1">
        <p className="text-[20px] font-semibold" style={{ color: c.ink }}>
          {album}
        </p>
        <p className="text-[13px]" style={{ color: c.soft }}>
          {countLabel(items.length)}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-[3px] overflow-hidden rounded-[18px]">
        {items.map((it, i) => (
          <m.button
            key={it.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open: ${it.alt}`}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE.entrance }}
            className={`relative aspect-square overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
          >
            <Image src={it.src} alt={it.alt} fill sizes={i === 0 ? '320px' : '160px'} className="object-cover transition-transform duration-500 hover:scale-105" />
          </m.button>
        ))}
      </div>

      {open !== null && <StoryViewer items={items} start={open} onClose={() => setOpen(null)} owner={owner} ownerAvatar={ownerAvatar} storyMs={storyMs} ring={c.ring} />}
    </div>
  );
}

function StoryViewer({
  items,
  start,
  onClose,
  owner,
  ownerAvatar,
  storyMs,
  ring,
}: {
  items: InviteGalleryItem[];
  start: number;
  onClose: () => void;
  owner?: string;
  ownerAvatar?: string;
  storyMs: number;
  ring: string;
}) {
  const [i, setI] = useState(start);
  const still = useReducedMotion();
  // past the last story, close
  const next = useCallback(() => (i + 1 < items.length ? setI(i + 1) : onClose()), [i, items.length, onClose]);
  const prev = () => setI((n) => Math.max(0, n - 1));

  useEffect(() => {
    if (still) return;
    const id = setTimeout(next, storyMs);
    return () => clearTimeout(id);
  }, [i, still, storyMs, next]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1));
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', key);
    };
  }, [onClose, next]);

  return createPortal(
    <m.div role="dialog" aria-modal="true" aria-label="Photo stories" className="fixed inset-[0] z-modal bg-[#000000]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="relative mx-auto h-full w-full max-w-[480px]">
        <AnimatePresence initial={false}>
          <m.div key={i} className="absolute inset-[0]" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <Image src={items[i].src} alt={items[i].alt} fill sizes="480px" className="object-cover" />
            <span className="absolute inset-x-[0] top-[0] h-[140px]" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)' }} />
            <span className="absolute inset-x-[0] bottom-[0] h-[160px]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <p className="absolute inset-x-[0] bottom-[48px] px-6 text-center text-[16px] font-medium" style={{ color: '#ffffff' }}>
              {items[i].alt}
            </p>
          </m.div>
        </AnimatePresence>

        {/* progress bars */}
        <div className="absolute inset-x-[0] top-[0] flex gap-1 px-3 pt-3">
          {items.map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-pill" style={{ background: 'rgba(255,255,255,0.35)' }}>
              {k < i && <span className="block h-full w-full" style={{ background: '#ffffff' }} />}
              {k === i && (
                <m.span key={i} className="block h-full" style={{ background: '#ffffff' }} initial={{ width: still ? '100%' : '0%' }} animate={{ width: '100%' }} transition={{ duration: storyMs / 1000, ease: 'linear' }} />
              )}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-[0] top-[16px] flex items-center justify-between px-3 pt-2">
          {owner && (
            <span className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: '#ffffff' }}>
              {ownerAvatar && (
                <span className="rounded-pill p-[2px]" style={{ background: ring }}>
                  <span className="relative block h-[30px] w-[30px] overflow-hidden rounded-pill border-2 border-[#000000]">
                    <Image src={ownerAvatar} alt="" fill sizes="30px" className="object-cover" />
                  </span>
                </span>
              )}
              {owner}
            </span>
          )}
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-[40px] w-[40px] place-items-center text-[22px]" style={{ color: '#ffffff' }}>
            ✕
          </button>
        </div>

        {/* tap the left third to go back, the rest to go on */}
        <button type="button" aria-label="Previous photo" onClick={prev} className="absolute bottom-[0] left-[0] top-[70px] w-1/3" />
        <button type="button" aria-label="Next photo" onClick={next} className="absolute bottom-[0] right-[0] top-[70px] w-2/3" />
      </div>
    </m.div>,
    document.body,
  );
}
