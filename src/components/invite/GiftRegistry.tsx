'use client';

import { useEffect, useState } from 'react';
import { m } from 'motion/react';
import type { InviteRegistry } from '@/content/invites';
import { EASE } from '@/styles/motion';
import { fadeUp } from './RevealLines';

type Phase = 'closed' | 'opening' | 'open';

// Ms the lid takes to lift before the details take its place.
const OPEN_MS = 700;

const mix = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;

/** A "Copy" pill for one value. Falls back to doing nothing where the
 * clipboard isn't available (an insecure origin, an old browser). */
function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no clipboard: the value is still on screen to read */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="caption rounded-pill border px-2 py-1 font-bold uppercase tracking-[0.08em] text-ink-muted"
      style={{ borderColor: mix(30) }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export interface GiftRegistryProps {
  registry: InviteRegistry;
  /** The line under the closed box. */
  openLabel?: string;
  /** The button that puts the lid back. */
  closeLabel?: string;
}

/**
 * A gift box that opens: a drawn box and bow floats gently; tap it and the lid
 * lifts in a glow, then the box gives way to a card with the registry details
 * (what it is, whom it is paid to, and lines that each copy with one tap).
 * "Close box" puts the lid back. The box is an SVG in the section's accent and
 * `--surface-raised`, so it follows the palette around it.
 *
 * It is a single motion child (`variants={fadeUp}`), so put it inside a motion
 * group — in DetailsSection's `children`, say — and it joins that reveal.
 */
export function GiftRegistry({
  registry,
  openLabel = 'Tap to open registry',
  closeLabel = 'Close box',
}: GiftRegistryProps) {
  const [phase, setPhase] = useState<Phase>('closed');

  // Timer-driven, so a hidden tab or reduced motion can't leave the box half open.
  useEffect(() => {
    if (phase !== 'opening') return;
    const id = setTimeout(() => setPhase('open'), OPEN_MS);
    return () => clearTimeout(id);
  }, [phase]);

  const opening = phase === 'opening';

  return (
    <m.div variants={fadeUp} className="mt-12 text-center">
      {phase === 'open' ? (
        <m.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
          className="rounded-[20px] border bg-surface-raised px-5 py-8 shadow-lg"
          style={{ borderColor: mix(35) }}
        >
          <p className="caption uppercase tracking-[0.3em] text-invite-metal">Digital Registry Box</p>
          <p className="body-sm mt-2 font-bold uppercase tracking-[0.12em] text-invite-ink">
            {registry.method ?? 'Bank transfer'}
          </p>
          <p className="display-md mt-3 italic text-invite-ink">{registry.holder}</p>

          <dl className="mt-5 space-y-3">
            {registry.details.map((d) => (
              <div key={d.label} className="flex flex-wrap items-center justify-center gap-2">
                <dt className="caption uppercase tracking-[0.1em] text-ink-muted">{d.label}</dt>
                <dd className="body-sm font-bold text-invite-metal">{d.value}</dd>
                <CopyButton label={d.label} value={d.value} />
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => setPhase('closed')}
            className="action mt-8 rounded-pill border px-6 py-3 uppercase tracking-[0.14em] text-invite-ink"
            style={{ borderColor: mix(40) }}
          >
            {closeLabel}
          </button>
        </m.div>
      ) : (
        <button
          type="button"
          onClick={() => phase === 'closed' && setPhase('opening')}
          aria-label={openLabel}
          className="mx-auto block"
        >
          <span className={`block ${phase === 'closed' ? 'amb-bounce' : ''}`}>
            <svg
              viewBox="0 0 120 120"
              aria-hidden
              className="mx-auto h-[150px] w-[150px] overflow-visible text-invite-metal"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            >
              {/* The glow the lid lets out. */}
              <m.circle
                cx="60"
                cy="60"
                fill="currentColor"
                stroke="none"
                initial={false}
                animate={opening ? { r: 80, opacity: 0 } : { r: 18, opacity: 0.35 }}
                transition={{ duration: 0.7, ease: EASE.entrance }}
              />
              {/* The box. */}
              <rect x="22" y="58" width="76" height="48" rx="4" fill="var(--surface-raised)" />
              <rect x="54" y="58" width="12" height="48" fill="currentColor" fillOpacity="0.9" stroke="none" />
              <path d="M38 80a7 7 0 1 0 5 10 5.5 5.5 0 1 1-5-10z" strokeOpacity="0.7" />
              <path d="M84 78l1.5 3.5L89 83l-3.5 1.5L84 88l-1.5-3.5L79 83l3.5-1.5z" fill="currentColor" stroke="none" />
              {/* The lid and bow, which lift and tip back together. */}
              <m.g
                initial={false}
                animate={opening ? { y: -24, rotate: -14 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.6, ease: EASE.entrance }}
                style={{ originX: 0, originY: 1 }}
              >
                <rect x="16" y="42" width="88" height="18" rx="4" fill="var(--surface-raised)" />
                <rect x="54" y="42" width="12" height="18" fill="currentColor" fillOpacity="0.9" stroke="none" />
                <path d="M60 42C50 22 30 24 38 38c4 6 16 5 22 4z" />
                <path d="M60 42c10-20 30-18 22-4-4 6-16 5-22 4z" />
                <circle cx="60" cy="42" r="4.5" fill="currentColor" stroke="none" />
              </m.g>
            </svg>
          </span>
          <span className="caption mt-4 block uppercase tracking-[0.25em] text-ink-muted">{openLabel}</span>
        </button>
      )}
    </m.div>
  );
}
