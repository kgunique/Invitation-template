'use client';

import type { CSSProperties, ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { BananaTree } from './BananaTree';
import { BrandCredit } from './BrandCredit';
import { Kalash } from './Kalash';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const group = lineGroup(0.1);

const pop = {
  hidden: { opacity: 0, scale: 0.5, y: 12 },
  shown: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: EASE.entrance } },
};

/** A banana plant in a terracotta pot, its leaves swaying. */
function PottedBanana({ mirror = false, phase = 0 }: { mirror?: boolean; phase?: number }) {
  return (
    <div className="relative h-[116px] w-[78px]">
      <BananaTree
        fruit={false}
        ground={false}
        mirror={mirror}
        phase={phase}
        sway={3.6}
        className="absolute bottom-[34px] left-[50%] -ml-[46px] w-[92px]"
      />
      <svg viewBox="0 0 60 38" aria-hidden className="absolute bottom-[0] left-[50%] -ml-[27px] w-[54px]">
        <path d="M4 0h52l-5 36H9z" fill="#b8641f" />
        <path d="M2 0h56v7H2z" fill="#d6842c" />
        <path d="M10 14h40M12 24h36" stroke="#f6d88a" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.8" />
        <path d="M9 7l3 29h3L12 7z" fill="#ffffff" fillOpacity="0.14" />
      </svg>
    </div>
  );
}

export interface ThankYouSectionProps {
  bride: string;
  groom: string;
  /** The note to the guests. */
  message?: string;
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  /** The line under the names. */
  wish?: string;
  /** Art that hangs from the top of the section (garlands, a toran), absolutely placed children of the section, which is `relative`. */
  top?: ReactNode;
  /** Decorative scene filling the section behind its content. */
  backgroundScene?: ReactNode;
  /** Art along the foot of the section, full width. */
  scene?: ReactNode;
  /** Potted banana plants on either side of the names. */
  plants?: boolean;
  /** Marigold petals drifting down the whole section, as colours; `false` for none. */
  petals?: false | string[];
  /** The colour of the band under the scene (so a skyline stands on ground rather than on the page). Transparent by default. */
  base?: string;
  /** The section's own background: any CSS background. */
  background?: string;
  /** Palette. */
  colors?: Partial<SectionColors>;
  /** Localize text and type for the Hindi invitation. */
  lang?: string;
  displayClassName?: string;
  bodyClassName?: string;
  creditLabel?: string;
  creditByLabel?: string;
  /** Hide the kalash and use regular section spacing when no top artwork is supplied. */
  showKalash?: boolean;
  /** Keep the closing copy compact near the top when the background has a focal illustration. */
  compact?: boolean;
}

// A few gold sparkles round the kalash, each twinkling on its own beat.
const SPARKLES = [
  { x: 22, y: 232, size: 12, dur: 3.4, delay: -0.6 },
  { x: 74, y: 250, size: 9, dur: 4.1, delay: -1.9 },
  { x: 14, y: 298, size: 8, dur: 3.1, delay: -2.4 },
  { x: 84, y: 294, size: 13, dur: 3.8, delay: -0.2 },
  { x: 36, y: 268, size: 7, dur: 4.6, delay: -3.1 },
  { x: 62, y: 226, size: 8, dur: 3.3, delay: -1.2 },
];

const DEFAULT_PETALS = ['#f5a623', '#e8791a', '#f8c850'];

const DEFAULT_BACKGROUND = [
  'radial-gradient(ellipse 90% 38% at 50% 0%, rgba(255,222,120,0.55), rgba(255,222,120,0) 100%)',
  'radial-gradient(ellipse 60% 30% at 8% 30%, rgba(255,236,170,0.4), rgba(255,236,170,0) 100%)',
  'linear-gradient(to bottom, #fff8e2, #fffcf3 40%, #fdf0d8)',
].join(', ');

/**
 * The closing "Thank you": whatever hangs from the top (garlands, a toran) over
 * a soft watercolour wash of marigold yellow, a kalash that pops into place, a
 * tracked "with gratitude", the heading and a gold rule, the note to the
 * guests, the couple's names in gold italic between two swaying potted banana
 * plants, a wish, the "Designed with love by Get Invites" credit, marigold petals
 * drifting down the whole section, and a scene along its foot. Reveals line by
 * line as it scrolls into view. The art, the wash, the note and the palette are
 * all props.
 */
export function ThankYouSection({
  bride,
  groom,
  message = 'It is the greatest honour to have you as part of our story. May your life be filled with love, light and lasting joy. We cannot wait to celebrate with you!',
  eyebrow = 'With Gratitude',
  title = 'Thank You',
  wish = 'Wishing you a lifetime of love and happiness.',
  top,
  backgroundScene,
  scene,
  plants = true,
  petals = DEFAULT_PETALS,
  base = 'transparent',
  background = DEFAULT_BACKGROUND,
  colors,
  lang,
  displayClassName = '',
  bodyClassName = '',
  creditLabel,
  creditByLabel,
  showKalash = true,
  compact = false,
}: ThankYouSectionProps) {
  return (
    <section
      lang={lang}
      style={{ ...sectionVars(colors), background }}
      className={`relative overflow-hidden ${compact ? 'min-h-[620px] pt-4' : showKalash ? 'pt-[236px]' : 'pt-16'} ${bodyClassName}`}
    >
      {backgroundScene && (
        <div
          aria-hidden
          className="pointer-events-none z-0 overflow-hidden"
          style={{ position: 'absolute', inset: 0 }}
        >
          {backgroundScene}
        </div>
      )}
      {petals && <Petals color={petals} count={9} size={[8, 13]} speed={0.45} />}
      {top}

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        className={`relative z-10 mx-auto flex w-full flex-col items-center text-center ${compact ? 'max-w-[420px] px-6' : 'max-w-[400px] px-8'}`}
      >
        {showKalash && (
          <m.span variants={pop} aria-hidden className="block">
            <span className="amb-hop block">
              <Kalash className="h-[150px] w-[104px] drop-shadow-[0_8px_12px_rgba(120,60,10,0.28)]" />
            </span>
          </m.span>
        )}

        <m.p variants={fadeUp} className={`invite-eyebrow text-invite-metal ${compact ? 'mt-0' : 'mt-5'}`}>
          {eyebrow}
        </m.p>
        <div className={compact ? 'mt-0' : 'mt-3'}>
          <RevealLine className={`${compact ? 'display-md' : 'display-xl'} italic text-invite-ink ${displayClassName}`}>{title}</RevealLine>
        </div>
        <m.span
          variants={fadeUp}
          aria-hidden
          className={`block h-[1px] w-[88px] ${compact ? 'mt-1' : 'mt-4'}`}
          style={{ background: 'linear-gradient(to right, transparent, var(--invite-metal), transparent)' }}
        />
        <m.p variants={fadeUp} className={`${compact ? 'body-sm' : 'body-lg'} max-w-[32ch] text-ink-body ${compact ? 'mt-1' : 'mt-5'} ${bodyClassName}`}>
          {message}
        </m.p>

        {/* The names between the plants. */}
        <m.div
          variants={fadeUp}
          className={`flex w-full ${compact ? 'mt-1 flex-wrap items-center justify-center gap-x-2' : 'mt-6 items-end justify-between'}`}
        >
          {compact ? (
            <>
              <RevealLine className={`display-sm italic text-invite-metal ${displayClassName}`}>{bride}</RevealLine>
              <RevealLine className={`body-sm italic text-invite-metal ${displayClassName}`}>&amp;</RevealLine>
              <RevealLine className={`display-sm italic text-invite-metal ${displayClassName}`}>{groom}</RevealLine>
            </>
          ) : (
            <>
              {plants ? <PottedBanana phase={0.4} /> : <span className="w-[78px]" />}
              <div className="pb-2">
                <RevealLine className={`display-lg italic text-invite-metal ${displayClassName}`}>{bride}</RevealLine>
                <RevealLine className={`display-md italic text-invite-metal ${displayClassName}`}>&amp;</RevealLine>
                <RevealLine className={`display-lg italic text-invite-metal ${displayClassName}`}>{groom}</RevealLine>
              </div>
              {plants ? <PottedBanana mirror phase={2.1} /> : <span className="w-[78px]" />}
            </>
          )}
        </m.div>

        <m.p variants={fadeUp} className={`body-sm max-w-[36ch] italic text-ink-muted ${compact ? 'mt-1' : 'mt-4'} ${bodyClassName}`}>
          {wish}
        </m.p>
        <div className={`${compact ? 'mt-2' : 'mt-8'} flex flex-col items-center`}>
          <BrandCredit heart={false} compact designedWithLoveLabel={creditLabel} byLabel={creditByLabel} />
        </div>
      </m.div>

      {SPARKLES.map((sp, i) => (
        <span
          key={i}
          aria-hidden
          className="amb-twinkle pointer-events-none absolute text-invite-metal"
          style={
            {
              left: `${sp.x}%`,
              top: sp.y,
              fontSize: sp.size,
              lineHeight: 1,
              '--tw-dur': `${sp.dur}s`,
              '--tw-delay': `${sp.delay}s`,
              '--tw-base': 0.85,
              opacity: 0.6,
            } as CSSProperties
          }
        >
          ✦
        </span>
      ))}

      {scene && (
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: EASE.entrance, delay: DURATION.slow }}
          className="relative mt-12"
        >
          {scene}
        </m.div>
      )}
      <div aria-hidden className="h-[96px]" style={{ background: base }} />
    </section>
  );
}
