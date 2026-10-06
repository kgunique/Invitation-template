'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollToTop } from './scrollToTop';

export type OpenStage = 'closed' | 'opening' | 'open' | 'revealed';

export interface OpenSequenceOptions {
  /** Ms from the tap until the page underneath should start: `onOpen` fires then. */
  openMs: number;
  /** Ms the cover then takes to fade away before it removes itself. */
  fadeMs: number;
  /** Called at the tap itself, synchronously, inside the click handler: the place to start anything a browser only lets a tap start (sound). */
  onTap?: () => void;
  onOpen?: () => void;
  onOpened?: () => void;
}

/**
 * The timeline every full-screen cover shares: closed -> opening (the tap, and
 * whatever animation the cover plays) -> open (`onOpen` fired; the cover fades)
 * -> revealed (gone; `onOpened` fired). Tapping also jumps the page to the top,
 * so an invite always starts from its first screen.
 *
 * It is driven by timers, not animation callbacks: the cover is full screen, so
 * it must never wait on something that might not fire (a hidden tab, reduced
 * motion) and leave itself stuck over the page. Callbacks are read through refs,
 * so a new function each render doesn't restart a timer.
 *
 * `open()` does nothing unless the cover is closed. `opening` is true from the
 * tap on; `fading` is true while the cover fades out.
 */
export function useOpenSequence({ openMs, fadeMs, onTap, onOpen, onOpened }: OpenSequenceOptions) {
  const [stage, setStage] = useState<OpenStage>('closed');

  const onTapRef = useRef(onTap);
  const onOpenRef = useRef(onOpen);
  const onOpenedRef = useRef(onOpened);
  useEffect(() => {
    onTapRef.current = onTap;
    onOpenRef.current = onOpen;
    onOpenedRef.current = onOpened;
  });

  useEffect(() => {
    if (stage === 'opening') {
      const id = setTimeout(() => {
        onOpenRef.current?.();
        setStage('open');
      }, openMs);
      return () => clearTimeout(id);
    }
    if (stage === 'open') {
      const id = setTimeout(() => {
        setStage('revealed');
        onOpenedRef.current?.();
      }, fadeMs);
      return () => clearTimeout(id);
    }
  }, [stage, openMs, fadeMs]);

  function open() {
    if (stage !== 'closed') return;
    scrollToTop();
    onTapRef.current?.();
    setStage('opening');
  }

  return { stage, opening: stage !== 'closed', fading: stage === 'open', open };
}
