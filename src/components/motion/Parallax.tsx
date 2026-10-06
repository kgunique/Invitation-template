'use client';

import { m, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useRef, type ReactNode } from 'react';

/**
 * Scroll-linked parallax. This is the clearest case for Framer Motion in the
 * whole product: `useScroll` gives a normalised progress value off a single
 * shared rAF loop, instead of every layer attaching its own scroll listener.
 *
 * Hand-rolling this means throttling, passive listeners, ResizeObserver and
 * cleanup on every bed. That is the code worth not owning.
 *
 * `speed` is a fraction of the element's travel: 0.2 drifts gently, negative
 * moves against the scroll.
 */
export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}%`, `${speed * 100}%`]);

  // Flat render under reduced motion — no listener, no transform, no cost.
  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y, willChange: 'transform' }}>{children}</m.div>
    </div>
  );
}
