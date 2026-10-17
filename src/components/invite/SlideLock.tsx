'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { animate, m, useMotionValue, useTransform } from 'motion/react';
import { EASE } from '@/styles/motion';
import { useOpenSequence } from './useOpenSequence';

export interface SlideLockColors {
  /** What shows behind the cover's picture while it loads: any CSS colour. */
  ground: string;
  /** The slider's label and the line under it. */
  text: string;
  /** The slider's outline, the handle's glow and the label's shimmer. */
  accent: string;
  /** The slider's track: any CSS background (a translucent glass looks best over a picture). */
  track: string;
}

export interface SlideLockProps {
  /** What fills the screen behind everything: a photograph, a painted sky, anything absolutely placed (it is pushed in on as the cover opens). */
  background: ReactNode;
  /** The invitation's first words, centred in the upper part of the screen (names, a date). */
  children?: ReactNode;
  /** The picture on the handle: a round image, an icon. It fills the handle. */
  handle: ReactNode;
  /** The words inside the track, beside the handle: they fade as it slides. */
  label?: string;
  /** Screen-reader label for the handle. */
  lockLabel?: string;
  /** Anything that sits just above the track and can be tapped (a call screen's Remind me / Message buttons). */
  above?: ReactNode;
  /** A line under the track (a blessing). */
  footer?: ReactNode;
  /** Diameter of the handle in px. */
  handleSize?: number;
  /** How far across (0..1) the handle must be let go to unlock; short of it, it springs back. */
  threshold?: number;
  /** Where the track sits, as a CSS `bottom`. */
  bottom?: string;
  /** A CSS selector for an element in the page underneath (it must exist from the start, hidden): when the slide unlocks, the handle does not swell away but flies, still turning, to that element's place and size, and `onLanded` fires as it arrives. */
  flyTo?: string;
  onLanded?: () => void;
  /** The colour the label's glow breathes in (default: the accent). */
  labelGlow?: string;
  /** The faces for the label and the footer, if not the site's (see `hindiFonts.ts`). */
  labelClassName?: string;
  colors?: Partial<SlideLockColors>;

  /** Ms from the unlock until the page underneath may start (`onOpen`). */
  openMs?: number;
  /** Ms the cover then takes to fade away. */
  fadeMs?: number;
  /** At the unlock itself, inside the gesture's handler: start anything a browser only lets a gesture start (music). */
  onTap?: () => void;
  onOpen?: () => void;
  onOpened?: () => void;
}

const DEFAULT_COLORS: SlideLockColors = {
  ground: '#050b1c',
  text: '#f3e7cb',
  accent: '#e9c97a',
  track: 'rgba(255, 255, 255, 0.1)',
};

const PAD = 5;

/**
 * "Slide to unlock": a full-screen cover with a picture behind it, the invitation's first words on it, and, low
 * on the screen, a glass track with a round handle (a moon, say) to slide across. Slide it far enough and let
 * go and the cover opens — the picture is pushed in on, the words rise and fade, the handle swells into light —
 * and then fades away to the page; let go short of it and the handle springs back. Until it has been touched
 * the handle gives a small nudge every few seconds (not under reduced motion). Pointer dragging is done by hand
 * (the site loads Framer Motion without its drag feature); the keyboard unlocks with Enter, Space or the right
 * arrow, and a plain tap nudges the handle. The picture, the words, the handle and the colours are props.
 */
export function SlideLock({
  background,
  children,
  handle,
  label = 'Slide to open',
  lockLabel = 'Slide to open the invitation',
  above,
  footer,
  handleSize = 56,
  threshold = 0.82,
  bottom = '13%',
  labelClassName = '',
  labelGlow,
  flyTo,
  onLanded,
  colors,
  openMs = 1000,
  fadeMs = 1300,
  onTap,
  onOpen,
  onOpened,
}: SlideLockProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const { stage, opening, fading, open } = useOpenSequence({ openMs, fadeMs, onTap, onOpen, onOpened });

  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [max, setMax] = useState(0);
  const labelOpacity = useTransform(x, (v) => (max ? Math.max(0, 1 - (v / max) * 1.7) : 1));
  const drag = useRef<{ startX: number; from: number; moved: boolean } | null>(null);
  const hint = useRef<{ stop: () => void } | null>(null);
  const touched = useRef(false);
  const handleBtn = useRef<HTMLButtonElement>(null);
  const startRect = useRef<DOMRect | null>(null);
  // The handle in flight: where it starts and where it lands (viewport pixels), and whether it is still in the air.
  const [flight, setFlight] = useState<{ from: DOMRect; to: DOMRect } | null>(null);
  const [flying, setFlying] = useState(false);

  // The track's width decides how far the handle can go.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setMax(Math.max(0, el.clientWidth - handleSize - PAD * 2));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [handleSize]);

  // Until it is touched, the handle nudges to say "slide me".
  useEffect(() => {
    if (stage !== 'closed' || !max || touched.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const run = animate(x, [0, 26, 0], { duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.4 });
    hint.current = run;
    return () => run.stop();
  }, [stage, max, x]);

  const unlock = () => {
    // Where the handle is now, before anything moves: a flight starts from here.
    // (worked out from the track and the handle's motion value, not read from the page: the page shows the handle a frame behind it)
    const tr = track.current?.getBoundingClientRect();
    startRect.current = tr ? new DOMRect(tr.left + PAD + x.get(), tr.top + PAD, handleSize, handleSize) : (handleBtn.current?.getBoundingClientRect() ?? null);
    if (!flyTo) animate(x, max, { duration: 0.25, ease: 'easeOut' });
    open();
  };

  // Once opened (the page is at the top), measure where the handle must land and let it go.
  useLayoutEffect(() => {
    if (!opening || !flyTo || flight) return;
    const target = document.querySelector(flyTo)?.getBoundingClientRect();
    const from = startRect.current;
    if (target && from) {
      setFlight({ from, to: target });
      setFlying(true);
    }
  }, [opening, flyTo, flight]);
  const springBack = () => animate(x, 0, { type: 'spring', stiffness: 360, damping: 28 });

  const down = (e: PointerEvent<HTMLButtonElement>) => {
    if (stage !== 'closed') return;
    touched.current = true;
    hint.current?.stop();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* a synthetic pointer has nothing to capture */
    }
    drag.current = { startX: e.clientX, from: x.get(), moved: false };
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    x.set(Math.min(max, Math.max(0, d.from + dx)));
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (x.get() >= max * threshold) unlock();
    else {
      springBack();
      // a tap that did not slide: show which way to go
      if (!d.moved) animate(x, [0, 34, 0], { duration: 0.7, ease: 'easeInOut' });
    }
  };
  const key = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (stage !== 'closed') return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      touched.current = true;
      hint.current?.stop();
      unlock();
    }
  };

  if (stage === 'revealed' && !flying) return null;

  return (
    <>
    {stage !== 'revealed' && (
    <m.div
      className="fixed inset-[0] z-content overflow-hidden"
      style={{ background: c.ground, pointerEvents: stage === 'closed' ? 'auto' : 'none' }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fadeMs / 1000, ease: 'easeInOut' }}
    >
      {/* The picture, which is pushed in on as the cover opens. */}
      <m.div
        className="absolute inset-[0]"
        initial={false}
        animate={{ scale: opening ? 1.16 : 1 }}
        transition={{ duration: (openMs + fadeMs) / 1000, ease: EASE.gate }}
      >
        {background}
      </m.div>

      <div className="absolute inset-[0] flex justify-center">
        <div className="relative h-full w-full max-w-[480px]">
          {/* The first words rise and fade as it opens. */}
          <m.div
            className="absolute inset-x-[0] top-[0] flex h-[64%] flex-col items-center justify-center px-6 text-center"
            initial={false}
            animate={opening ? { opacity: 0, y: -28 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.exit }}
          >
            {children}
          </m.div>

          {/* The track and, under it, the blessing. */}
          <m.div
            className="absolute inset-x-[0] flex flex-col items-center px-8"
            style={{ bottom }}
            initial={false}
            animate={opening ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.exit }}
          >
            {above && <div className="mb-10 w-full">{above}</div>}
            <div
              ref={track}
              className="relative w-full max-w-[330px] rounded-pill border backdrop-blur-md"
              style={{ height: handleSize + PAD * 2, background: c.track, borderColor: `color-mix(in srgb, ${c.accent} 40%, transparent)` }}
            >
              <m.span
                aria-hidden
                className={`${labelClassName} amb-glow-text pointer-events-none absolute inset-y-[0] right-[0] flex items-center pr-6 text-[11px] font-semibold uppercase tracking-[0.26em]`}
                style={{ left: handleSize + PAD * 2, color: c.text, opacity: labelOpacity, ['--glow' as string]: labelGlow ?? c.accent }}
              >
                {label}
              </m.span>

              <m.div className="absolute left-[5px] top-[5px]" style={{ x }}>
                <m.div
                  initial={false}
                  animate={opening ? (flyTo ? { scale: 1, opacity: 0 } : { scale: 2.6, opacity: 0 }) : { scale: 1, opacity: 1 }}
                  transition={{ duration: flyTo ? 0.05 : 0.9, ease: EASE.exit }}
                >
                  <button
                    type="button"
                    aria-label={lockLabel}
                    onPointerDown={down}
                    onPointerMove={move}
                    onPointerUp={up}
                    onPointerCancel={up}
                    onKeyDown={key}
                    ref={handleBtn}
                    className="amb-glow-ring relative block touch-none cursor-grab overflow-hidden rounded-pill active:cursor-grabbing"
                    style={{ width: handleSize, height: handleSize, ['--glow' as string]: c.accent }}
                  >
                    {handle}
                  </button>
                </m.div>
              </m.div>
            </div>

            {footer && <div className="mt-5 text-center">{footer}</div>}
          </m.div>
        </div>
      </div>
    </m.div>
    )}

    {/* The handle, flying to its place in the page under the cover. It outlasts the cover: the cover fades away round it. */}
    {flight && flying && (
      <m.div
        aria-hidden
        className="pointer-events-none fixed z-[45]"
        style={{ left: flight.from.left, top: flight.from.top, width: flight.from.width, height: flight.from.height, transformOrigin: '0 0' }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        animate={{
          x: flight.to.left - flight.from.left,
          y: flight.to.top - flight.from.top,
          scale: flight.to.width / flight.from.width,
          opacity: 1,
        }}
        transition={{ duration: 1.7, delay: 0.12, ease: [0.5, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          onLanded?.();
          // the page's own moon takes over under it; let go of the copy a beat later
          window.setTimeout(() => setFlying(false), 140);
        }}
      >
        <div className="amb-glow-ring relative h-full w-full overflow-hidden rounded-pill" style={{ ['--glow' as string]: c.accent }}>
          {handle}
        </div>
      </m.div>
    )}
    </>
  );
}
