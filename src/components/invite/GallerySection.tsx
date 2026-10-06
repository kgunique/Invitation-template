'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, m, useInView, useReducedMotion, type PanInfo } from 'motion/react';
import type { InviteGalleryItem } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { BackIcon, ChevronRightIcon, CloseIcon, ExpandIcon, HeartIcon } from './icons';
import { LineArtBackdrop } from './LineArtBackdrop';
import { Mandala } from './Mandala';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const mix = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;

const group = lineGroup(0.1);

// A slide arrives from the side the visitor is moving toward and the old one
// leaves the other way, a little slower, so the two overlap like paper sliding.
const slide = {
  enter: (dir: number) => ({ x: `${dir * 38}%`, opacity: 0, scale: 1.05 }),
  center: { x: '0%', opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: `${dir * -26}%`, opacity: 0, scale: 0.97 }),
};

const SWIPE = 55; // px of drag that counts as a swipe
const AUTOPLAY_MS = 4800;

export interface GallerySectionProps {
  /** The pictures, in order. At least two for the arrows and dots to make sense. */
  items: InviteGalleryItem[];
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  /** Move on by itself every few seconds while the section is on screen, until the visitor touches it. Never under reduced motion. */
  autoplay?: boolean;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own paper. */
  background?: string;
  /** Palette. */
  colors?: Partial<SectionColors>;
}

/**
 * "Our love gallery": a heading with a gold line and a heart, then a carousel
 * of the couple's pictures in a tall frame with a thin gold rim and a soft
 * shadow, a round arrow overlapping each side of it, and a row of dots under
 * it (the current one larger and ringed). Swipe, tap an arrow, tap a dot, press
 * the left and right keys, or leave it: it turns the pages itself while it is
 * on screen, and stops the moment you touch it. Tap a picture and it opens
 * full-screen in a lightbox you can swipe through, close with the button, the
 * backdrop or Escape. Behind the frame a very faint mandala turns and the
 * paper is spotted with line-art paisleys. Reveals on scroll.
 */
export function GallerySection({
  items,
  eyebrow = 'Captured Moments',
  title = 'Our Love Gallery',
  autoplay = true,
  background = 'transparent',
  colors,
}: GallerySectionProps) {
  const total = items.length;
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [box, setBox] = useState(false);
  const [touched, setTouched] = useState(false);
  const [held, setHeld] = useState(false);
  const dragged = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const onScreen = useInView(stage, { amount: 0.5 });
  const reduced = useReducedMotion();

  const go = useCallback(
    (to: number, by?: number) =>
      setPage(([cur]) => {
        const next = ((to % total) + total) % total;
        return [next, by ?? (next >= cur ? 1 : -1)];
      }),
    [total],
  );
  const step = useCallback((by: number) => setPage(([cur]) => [(((cur + by) % total) + total) % total, by]), [total]);

  // Turn the pages by itself, only while it is on screen, untouched and not paused under a finger or a pointer.
  useEffect(() => {
    if (!autoplay || reduced || touched || held || box || !onScreen || total < 2) return;
    const id = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, reduced, touched, held, box, onScreen, total, index, step]);

  function user(fn: () => void) {
    setTouched(true);
    fn();
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const power = Math.abs(info.offset.x) > SWIPE || Math.abs(info.velocity.x) > 500;
    if (power) user(() => step(info.offset.x < 0 ? 1 : -1));
    // Let the click that follows a drag pass before a tap can open the lightbox.
    window.setTimeout(() => (dragged.current = false), 60);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') user(() => step(1));
    if (e.key === 'ArrowLeft') user(() => step(-1));
  }

  const item = items[index];

  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-20 pt-16">
      <LineArtBackdrop ornaments={false} fadeFrom={20} opacity={0.15} />

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        className="relative flex flex-col items-center text-center"
      >
        <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-4">
          <RevealLine className="display-lg italic text-invite-ink">{title}</RevealLine>
        </div>
        <m.div variants={fadeUp} aria-hidden className="mt-4 flex items-center gap-3 text-invite-metal">
          <span className="block h-[1px] w-[56px]" style={{ background: 'linear-gradient(to right, transparent, var(--invite-metal))' }} />
          <HeartIcon className="h-[16px] w-[16px]" />
          <span className="block h-[1px] w-[56px]" style={{ background: 'linear-gradient(to left, transparent, var(--invite-metal))' }} />
        </m.div>
      </m.div>

      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        className="relative mx-auto mt-10 w-full max-w-[340px]"
      >
        {/* A faint mandala turning behind the frame, wider than the picture. */}
        <Mandala
          color="var(--invite-metal)"
          duration={140}
          className="pointer-events-none absolute left-[50%] top-[50%] -ml-[230px] -mt-[230px] w-[460px] opacity-[0.18]"
        />

        <div
          ref={stage}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
          className="relative mx-auto w-[86%] outline-none"
        >
          {/* The frame: a thin gold rim round a cream mat, and the picture inside it. */}
          <div
            className="rounded-[26px] p-[1.5px] shadow-[0_22px_44px_rgba(90,60,20,0.28)]"
            style={{ background: 'linear-gradient(145deg, #f3dc9a, #c08a2e 45%, #f3dc9a 70%, #a9791a)' }}
          >
            <div className="rounded-[25px] p-[7px]" style={{ background: 'var(--surface-raised)' }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[19px]" style={{ background: mix(12) }}>
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <m.div
                    key={index}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: EASE.standard }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.35}
                    onDragStart={() => {
                      dragged.current = true;
                      setHeld(true);
                    }}
                    onDragEnd={onDragEnd}
                    onClick={() => {
                      if (!dragged.current) setBox(true);
                    }}
                    className="absolute inset-[0] cursor-zoom-in touch-pan-y"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${total}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={index === 0}
                      draggable={false}
                      sizes="(min-width: 480px) 300px, 78vw"
                      className="select-none object-cover"
                    />
                  </m.div>
                </AnimatePresence>

                {/* A soft shade at the foot so the chips read on any picture. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-[0] bottom-[0] h-[22%]"
                  style={{ background: 'linear-gradient(to top, rgba(40,20,10,0.35), transparent)' }}
                />
                <span
                  aria-hidden
                  className="caption pointer-events-none absolute bottom-3 left-3 rounded-pill bg-[rgba(255,255,255,0.88)] px-3 py-1 font-bold tabular-nums tracking-[0.12em] text-ink-body"
                >
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-3 flex h-[28px] w-[28px] items-center justify-center rounded-pill bg-[rgba(255,255,255,0.88)] text-invite-metal"
                >
                  <ExpandIcon className="h-[13px] w-[13px]" />
                </span>
              </div>
            </div>
          </div>

          {/* The two arrows, half over the frame's edge. */}
          {total > 1 && (
            <>
              <ArrowButton side="left" label="Previous picture" onClick={() => user(() => step(-1))} />
              <ArrowButton side="right" label="Next picture" onClick={() => user(() => step(1))} />
            </>
          )}
        </div>

        {/* The dots. */}
        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3" role="tablist" aria-label="Choose a picture">
            {items.map((it, i) => {
              const on = i === index;
              return (
                <button
                  key={it.src}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={`Picture ${i + 1}: ${it.alt}`}
                  onClick={() => user(() => go(i))}
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-pill transition-[border-color,transform] duration-500"
                  style={{ border: `1.5px solid ${on ? mix(80) : 'transparent'}`, transform: on ? 'scale(1)' : 'scale(0.9)' }}
                >
                  <span
                    className="block rounded-pill transition-all duration-500"
                    style={{
                      width: on ? 10 : 8,
                      height: on ? 10 : 8,
                      background: on ? 'var(--invite-metal)' : mix(38),
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {item.alt}
        </p>
      </m.div>

      <Lightbox
        open={box}
        items={items}
        index={index}
        onClose={() => setBox(false)}
        onStep={(by) => user(() => step(by))}
      />
    </section>
  );
}

function ArrowButton({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  const Icon = side === 'left' ? BackIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-[50%] z-[2] flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-pill border bg-[rgba(255,255,255,0.96)] text-invite-metal shadow-[0_6px_16px_rgba(90,60,20,0.25)] transition-transform active:scale-90 ${
        side === 'left' ? '-left-[21px]' : '-right-[21px]'
      }`}
      style={{ borderColor: mix(40) }}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}

/** The full-screen view: the picture as large as it fits, swipeable, with its own arrows and close button. */
function Lightbox({
  open,
  items,
  index,
  onClose,
  onStep,
}: {
  open: boolean;
  items: InviteGalleryItem[];
  index: number;
  onClose: () => void;
  onStep: (by: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Drawn on <body>, outside the page's own stacking contexts, so nothing of the page (the Back pill, the order bar) is above it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, onStep]);

  const item = items[index];
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base }}
          className="fixed inset-[0] z-modal flex items-center justify-center"
          style={{ background: 'rgba(24, 12, 8, 0.94)' }}
          onClick={onClose}
        >
          <m.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE.entrance }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > SWIPE) onStep(info.offset.x < 0 ? 1 : -1);
            }}
            className="relative h-[82%] w-[92%] max-w-[560px] touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={item.src} alt={item.alt} fill sizes="100vw" draggable={false} className="select-none object-contain" />
          </m.div>

          <p className="caption absolute inset-x-[0] bottom-5 px-10 text-center italic text-[rgba(255,246,224,0.85)]">
            {item.alt} · {index + 1}/{items.length}
          </p>

          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-4 top-4 flex h-[44px] w-[44px] items-center justify-center rounded-pill border border-[rgba(255,246,224,0.35)] bg-[rgba(255,246,224,0.12)] text-[#fff6e0]"
          >
            <CloseIcon className="h-[20px] w-[20px]" />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous picture"
                onClick={(e) => {
                  e.stopPropagation();
                  onStep(-1);
                }}
                className="absolute left-3 top-[50%] flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-pill border border-[rgba(255,246,224,0.35)] bg-[rgba(255,246,224,0.12)] text-[#fff6e0]"
              >
                <BackIcon className="h-[20px] w-[20px]" />
              </button>
              <button
                type="button"
                aria-label="Next picture"
                onClick={(e) => {
                  e.stopPropagation();
                  onStep(1);
                }}
                className="absolute right-3 top-[50%] flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-pill border border-[rgba(255,246,224,0.35)] bg-[rgba(255,246,224,0.12)] text-[#fff6e0]"
              >
                <ChevronRightIcon className="h-[20px] w-[20px]" />
              </button>
            </>
          )}
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
