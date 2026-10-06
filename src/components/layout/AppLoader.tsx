'use client';

import { Dancing_Script } from 'next/font/google';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Boot placeholder — masks the blank first paint while fonts/CSS settle.
 * Mark, name and tagline are throwaway and get replaced with the real brand;
 * only the mechanism (hold, fade, unmount) should survive that swap. The
 * cursive face is scoped to this file rather than the shared font system in
 * lib/fonts.ts, since it belongs to this placeholder, not the design system.
 */
const cursive = Dancing_Script({ subsets: ['latin'], weight: '700' });

const HOLD_MS = 900;
const FADE_MS = 400;

export function AppLoader({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(hide);
  }, []);

  return (
    <>
      {children}
      {mounted && (
        <div
          aria-hidden="true"
          onTransitionEnd={() => setMounted(false)}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          className={`fixed inset-[0] z-[100] flex flex-col items-center justify-center gap-6 bg-surface-page transition-opacity ${
            visible ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Centering (translate) and spinning (rotate) are split across two
                elements on purpose: both are `transform`, and the amb-spin keyframe
                would otherwise overwrite the centering translate every frame. */}
            <span className="absolute left-1/2 top-1/2 h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2">
              <span className="amb-spin block h-full w-full rounded-pill border-[3px] border-line-soft border-t-invite-metal" />
            </span>
            <span
              className={`${cursive.className} flex h-24 w-24 items-center justify-center rounded-pill border-[1.5px] border-invite-metal bg-surface-raised text-[28px] text-ink-strong shadow-md`}
            >
              GI
            </span>
          </div>
          <div className="text-center">
            <p className="display-lg text-ink-strong">Get Invites</p>
            <p className="loader-fade-in label mt-2 uppercase text-ink-muted">Interactive wedding invitations</p>
          </div>
        </div>
      )}
    </>
  );
}
