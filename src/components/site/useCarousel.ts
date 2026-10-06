'use client';

import { useState } from 'react';

/** Sliding window over a fixed item list: steps by one (not by a full page),
 * wraps around, and tracks which direction moved last so the caller can
 * apply a matching slide-in transition. Shared by Testimonials and Reviews. */
export function useCarousel<T>(items: readonly T[], visibleCount: number) {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const visible = Array.from({ length: visibleCount }, (_, i) => items[(startIndex + i) % items.length]);

  function go(dir: 1 | -1) {
    setDirection(dir);
    setStartIndex((i) => (i + dir + items.length) % items.length);
  }

  return { visible, direction, startIndex, go };
}
