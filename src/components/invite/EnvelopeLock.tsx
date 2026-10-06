'use client';

import type { CSSProperties, ReactNode } from 'react';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { EnvelopeIcon } from './icons';
import { SnakePaths } from './SnakePaths';
import { useOpenSequence } from './useOpenSequence';

export interface EnvelopeLockColors {
  /** The eyebrow, the envelope's outline and X lines, the snake and the tap button. */
  accent: string;
  /** The title. */
  ink: string;
  /** The envelope body: any CSS background. */
  paper: string;
  /** The flap: any CSS background. */
  flap: string;
  /** The wax seal's gradient, and its lettering. */
  sealFrom: string;
  sealTo: string;
  sealInk: string;
  /** The letter that rises out, and its lettering. */
  letter: string;
  letterInk: string;
}

export interface EnvelopeLockProps {
  /* ---- content ---- */
  /** Small tracked line above the title. */
  eyebrow?: ReactNode;
  /** The big line, e.g. the couple's names. */
  title?: ReactNode;
  /** Lettering on the seal and on the letter, e.g. "L & E". */
  initials?: string;
  /** The tiny word under the initials on the seal. */
  sealLabel?: string;
  /** The line on the letter that rises out. */
  letterLabel?: string;
  /** Label on the pill under the envelope. */
  buttonLabel?: string;
  /** Screen-reader label for the seal. */
  lockLabel?: string;

  /* ---- look ---- */
  colors?: Partial<EnvelopeLockColors>;
  /** Widest the envelope gets, in px. On a phone it fills the screen minus a
   * 12px margin either side; this only caps it on wider screens. */
  width?: number;

  /* ---- motion ---- */
  /** The gold light running round the envelope's edge. `false` turns it off;
   * `duration` is seconds per lap. */
  snake?: false | { duration?: number };
  /** Ms from the tap until the letter is up and `onOpen` fires. */
  openMs?: number;
  /** Ms the cover then takes to fade away. */
  fadeMs?: number;

  /** The letter is up: start revealing what's underneath. */
  onOpen?: () => void;
  /** The cover has faded and removed itself. */
  onOpened?: () => void;
}

const DEFAULT_COLORS: EnvelopeLockColors = {
  accent: '#e6c98a',
  ink: '#f6ecd9',
  paper: 'linear-gradient(135deg, #34497b, #263861)',
  flap: 'linear-gradient(to bottom, #3c5287, #30457a)',
  sealFrom: '#f6e4ae',
  sealTo: '#d6ab52',
  sealInk: '#4a3410',
  letter: '#f6ecd9',
  letterInk: '#4a3410',
};

/**
 * A full-screen envelope gate: a sealed envelope with a title above it and a
 * "tap to open" pill below, and a light running round its edge like a snake.
 * Tap the seal (or the pill) and the seal pops, the flap folds back, a letter
 * rises out, then the whole cover fades and removes itself.
 *
 * The cover has no background of its own: it sits over whatever the page puts
 * behind it (the Gold template puts a starry sky there). Everything visual is a
 * prop — colours, envelope width, lettering, snake speed, timings — so a
 * variation re-skins it without a copy of this file. Mount it over the page it
 * reveals and use `onOpen` to start that page's entrance.
 *
 * Invite layer only — it uses Framer Motion, which (site) must never import.
 */
export function EnvelopeLock({
  eyebrow,
  title,
  initials = '',
  sealLabel = 'Open',
  letterLabel = 'You are invited',
  buttonLabel = 'Tap to open',
  lockLabel = 'Tap to open the invitation',
  colors,
  width = 420,
  snake = {},
  openMs = 1700,
  fadeMs = 900,
  onOpen,
  onOpened,
}: EnvelopeLockProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const { stage, opening, fading, open } = useOpenSequence({ openMs, fadeMs, onOpen, onOpened });

  if (stage === 'revealed') return null;

  const lap = snake ? snake.duration ?? 6 : 6;

  const vars = { '--invite-metal': c.accent, '--invite-ink': c.ink } as CSSProperties;

  return (
    <m.div
      style={{ ...vars, pointerEvents: stage === 'closed' ? 'auto' : 'none' }}
      className="fixed inset-[0] z-content flex flex-col items-center justify-center px-3 text-center"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fadeMs / 1000 }}
    >
      <div className="flex w-full flex-col items-center" style={{ maxWidth: width }}>
        {/* The heading steps aside as the flap folds up and the letter rises into its space. */}
        <m.div
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.4, delay: opening ? 0.1 : 0 }}
          className="flex flex-col items-center"
        >
          {eyebrow && <p className="invite-eyebrow text-invite-metal">{eyebrow}</p>}
          {title && <p className="display-xl mt-4 text-invite-ink">{title}</p>}
        </m.div>

        {/* The perspective is for the flap, which folds back in 3D. */}
        <div className="relative mt-10 aspect-[3/2] w-full [perspective:900px]">
          <div
            className="absolute inset-[0] border shadow-[0_18px_40px_rgba(6,12,30,0.45)]"
            style={{ background: c.paper, borderColor: 'color-mix(in srgb, var(--invite-metal) 55%, transparent)' }}
          />

          {/* Flap: the top triangle, hinged on the top edge. */}
          <m.div
            className="absolute inset-x-[0] top-[0] h-1/2"
            style={{ background: c.flap, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformOrigin: 'top' }}
            initial={false}
            animate={{ rotateX: opening ? -180 : 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE.standard }}
          />

          {/* The X from the corners to the seal. */}
          <m.svg
            aria-hidden
            viewBox="0 0 300 200"
            preserveAspectRatio="none"
            className="absolute inset-[0] h-full w-full"
            fill="none"
            stroke={c.accent}
            strokeOpacity="0.55"
            strokeWidth="1.2"
            initial={false}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <path vectorEffect="non-scaling-stroke" d="M0 0L150 100M300 0L150 100M0 200L150 100M300 200L150 100" />
          </m.svg>

          {/* The snake running round the edge. */}
          {snake && (
            <m.svg
              aria-hidden
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              className="absolute inset-[0] h-full w-full overflow-visible"
              fill="none"
              style={{ filter: `drop-shadow(0 0 3px color-mix(in srgb, ${c.accent} 85%, transparent))` }}
              initial={false}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <SnakePaths d="M0 0H300V200H0Z" color={c.accent} duration={lap} />
            </m.svg>
          )}

          {/* The seal. */}
          <div className="pointer-events-none absolute inset-[0] flex items-center justify-center">
            <m.button
              type="button"
              onClick={open}
              aria-label={lockLabel}
              className="pointer-events-auto flex h-[68px] w-[68px] flex-col items-center justify-center rounded-pill shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
              style={{ background: `linear-gradient(135deg, ${c.sealFrom}, ${c.sealTo})`, color: c.sealInk }}
              initial={false}
              animate={{ scale: opening ? 0 : 1, opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.35, ease: EASE.exit }}
            >
              <span className="festive-sm text-[16px] font-bold leading-none">{initials}</span>
              <span className="mt-1 text-[6px] font-bold uppercase leading-none tracking-[0.2em]">● {sealLabel} ●</span>
            </m.button>
          </div>

          {/* The letter, which rises out once the flap is back. */}
          <m.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[8%] bottom-[10%] top-[10%] flex flex-col items-center justify-center rounded-sm border"
            style={{ background: c.letter, borderColor: c.accent, color: c.letterInk }}
            initial={false}
            animate={opening ? { opacity: 1, y: '-58%', scale: 1.05 } : { opacity: 0, y: '0%', scale: 0.9 }}
            transition={{ duration: 0.8, delay: opening ? 0.75 : 0, ease: EASE.entrance }}
          >
            <span className="festive-md leading-none">{initials}</span>
            <span className="caption mt-2 uppercase tracking-[0.2em]">{letterLabel}</span>
          </m.div>
        </div>

        <m.button
          type="button"
          onClick={open}
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="action mt-10 inline-flex items-center gap-2 rounded-pill border border-[color-mix(in_srgb,var(--invite-metal)_40%,transparent)] bg-[color-mix(in_srgb,#ffffff_6%,transparent)] px-6 py-3 uppercase tracking-[0.18em] text-invite-metal"
        >
          <EnvelopeIcon /> {buttonLabel}
        </m.button>
      </div>
    </m.div>
  );
}
