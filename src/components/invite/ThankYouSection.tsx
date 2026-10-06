'use client';

import type { CSSProperties, ReactNode } from 'react';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { BananaTree } from './BananaTree';
import { MarryMeCredit } from './MarryMeCredit';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const group = lineGroup(0.1);

const pop = {
  hidden: { opacity: 0, scale: 0.5, y: 12 },
  shown: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: EASE.entrance } },
};

/** A kalash: a copper pot, a ring of marigolds round its neck, mango leaves fanning from its mouth and a coconut on top. */
function Kalash({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 -12 80 116" aria-hidden className={className}>
      <defs>
        <linearGradient id="ty-pot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0b25a" />
          <stop offset="0.5" stopColor="#c9792b" />
          <stop offset="1" stopColor="#8a4a14" />
        </linearGradient>
      </defs>
      {/* The mango leaves. */}
      {[-52, -26, 0, 26, 52].map((a, i) => (
        <path
          key={a}
          d="M0 0C-8 -12 -8 -30 0 -42C8 -30 8 -12 0 0Z"
          transform={`translate(40 46) rotate(${a})`}
          fill={i % 2 ? '#2f8a3f' : '#3f9d4c'}
        />
      ))}
            {/* The coconut, big, with its husk lines, three dark eyes and a tuft of fibre. */}
      <ellipse cx="40" cy="24" rx="15.5" ry="17.5" fill="#8a5a2b" />
      <ellipse cx="35" cy="17" rx="7" ry="9" fill="#ffffff" fillOpacity="0.12" />
      <path d="M28 20c3-9 21-9 24 0M26 26c4 8 24 8 28 0" fill="none" stroke="#6b3f17" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M40 7V41" stroke="#6b3f17" strokeWidth="0.9" strokeOpacity="0.55" />
      <circle cx="34.5" cy="27" r="2" fill="#3a220c" />
      <circle cx="45.5" cy="27" r="2" fill="#3a220c" />
      <circle cx="40" cy="33" r="2" fill="#3a220c" />
      <path d="M40 7l-5-9M40 7l5-9M40 7V-4M40 7l-9-5M40 7l9-5" stroke="#c9792b" strokeWidth="1.8" strokeLinecap="round" />
      {/* The pot. */}
      <ellipse cx="40" cy="48" rx="13" ry="3.4" fill="#f4c27a" />
      <path d="M28 49h24l-2 8H30z" fill="url(#ty-pot)" />
      <path d="M30 57C12 62 8 90 28 98h24C72 90 68 62 50 57z" fill="url(#ty-pot)" />
      <path d="M12 76C30 84 50 84 68 76" fill="none" stroke="#f6d88a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 82C32 90 48 90 66 82" fill="none" stroke="#7a3d10" strokeOpacity="0.5" strokeWidth="1" />
      {/* A swastika in kumkum on the belly. */}
      <path d="M40 66v14M33 73h14M40 66h5M47 73v5M40 80h-5M33 73v-5" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
      {/* The marigold garland round the neck. */}
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return <circle key={i} cx={26 + t * 28} cy={52 + Math.sin(t * Math.PI) * 5} r="3" fill={i % 2 ? '#f5a623' : '#e8591a'} />;
      })}
    </svg>
  );
}

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
 * plants, a wish, the "Designed with love by Marry Me" credit, marigold petals
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
  scene,
  plants = true,
  petals = DEFAULT_PETALS,
  base = 'transparent',
  background = DEFAULT_BACKGROUND,
  colors,
}: ThankYouSectionProps) {
  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden pt-[236px]">
      {petals && <Petals color={petals} count={9} size={[8, 13]} speed={0.45} />}
      {top}

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        className="relative mx-auto flex w-full max-w-[400px] flex-col items-center px-8 text-center"
      >
        <m.span variants={pop} aria-hidden className="block">
          {/* It hops now and then: up a little, down with a soft squash, a small second hop. */}
          <span className="amb-hop block">
            <Kalash className="h-[150px] w-[104px] drop-shadow-[0_8px_12px_rgba(120,60,10,0.28)]" />
          </span>
        </m.span>

        <m.p variants={fadeUp} className="invite-eyebrow mt-5 text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-3">
          <RevealLine className="display-xl italic text-invite-ink">{title}</RevealLine>
        </div>
        <m.span
          variants={fadeUp}
          aria-hidden
          className="mt-4 block h-[1px] w-[88px]"
          style={{ background: 'linear-gradient(to right, transparent, var(--invite-metal), transparent)' }}
        />
        <m.p variants={fadeUp} className="body-lg mt-5 max-w-[32ch] text-ink-body">
          {message}
        </m.p>

        {/* The names between the plants. */}
        <m.div variants={fadeUp} className="mt-6 flex w-full items-end justify-between">
          {plants ? <PottedBanana phase={0.4} /> : <span className="w-[78px]" />}
          <div className="pb-2">
            <RevealLine className="display-lg italic text-invite-metal">{bride}</RevealLine>
            <RevealLine className="display-md italic text-invite-metal">&amp;</RevealLine>
            <RevealLine className="display-lg italic text-invite-metal">{groom}</RevealLine>
          </div>
          {plants ? <PottedBanana mirror phase={2.1} /> : <span className="w-[78px]" />}
        </m.div>

        <m.p variants={fadeUp} className="body-sm mt-4 max-w-[36ch] italic text-ink-muted">
          {wish}
        </m.p>
        <div className="mt-8 flex flex-col items-center">
          <MarryMeCredit heart={false} compact />
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
