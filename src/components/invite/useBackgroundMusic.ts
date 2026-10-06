'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The sample track: a 53-second loop (a tanpura drone, a flute singing a slow
 * raga Bhoopali phrase, soft bells) that was synthesised from scratch for this
 * project, so there is no recording or licence behind it. Swap in a real,
 * licensed track by passing another `src`.
 */
export const SAMPLE_MUSIC = '/audio/raga-bhoopali-loop.mp3';

export interface BackgroundMusic {
  playing: boolean;
  /** Start (fading in). Call it from a tap: a browser only starts sound after one. */
  play: () => void;
  /** Stop (fading out). */
  pause: () => void;
  toggle: () => void;
}

const FADE_MS = 900;

/**
 * Looping background music with a play/pause that a button can drive. The audio
 * element is made on the first `play()` (so a page that never plays loads
 * nothing), fades in and out instead of cutting, falls silent when the tab is
 * hidden and comes back with it if the visitor had it on. If the browser refuses
 * to play, `playing` stays false and the button is still there to try again.
 */
export function useBackgroundMusic(src: string = SAMPLE_MUSIC, { volume = 0.55 } = {}): BackgroundMusic {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number | null>(null);
  const wanted = useRef(false);
  const [playing, setPlaying] = useState(false);

  const ramp = useCallback((to: number, then?: () => void) => {
    const a = audio.current;
    if (!a) return;
    if (fade.current) window.clearInterval(fade.current);
    const from = a.volume;
    const steps = 18;
    let i = 0;
    fade.current = window.setInterval(() => {
      i += 1;
      a.volume = Math.min(1, Math.max(0, from + ((to - from) * i) / steps));
      if (i >= steps) {
        if (fade.current) window.clearInterval(fade.current);
        fade.current = null;
        then?.();
      }
    }, FADE_MS / steps);
  }, []);

  const play = useCallback(() => {
    wanted.current = true;
    if (!audio.current) {
      const a = new Audio(src);
      a.loop = true;
      a.preload = 'auto';
      audio.current = a;
    }
    const a = audio.current;
    a.volume = 0;
    a.play().then(
      () => {
        setPlaying(true);
        ramp(volume);
      },
      () => setPlaying(false),
    );
  }, [src, volume, ramp]);

  const pause = useCallback(() => {
    wanted.current = false;
    setPlaying(false);
    ramp(0, () => audio.current?.pause());
  }, [ramp]);

  const toggle = useCallback(() => (wanted.current ? pause() : play()), [play, pause]);

  useEffect(() => {
    const onVisibility = () => {
      const a = audio.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else if (wanted.current) a.play().catch(() => setPlaying(false));
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (fade.current) window.clearInterval(fade.current);
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  return { playing, play, pause, toggle };
}
