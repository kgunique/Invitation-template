'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { formatDay } from './dates';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';
import { useCountdown } from './useCountdown';

export interface GateColors {
  /** The doors: any CSS colour (they are shaded from it). */
  door: string;
  /** The gold of the seam, the ring and the frame: [light, deep]. */
  gold: [string, string];
  /** The disc in the ring, and what is written on it (the lettering takes the door colour if you leave it). */
  disc: string;
  discInk?: string;
  /** The light behind the doors, at its brightest. */
  light: string;
}

const DEFAULT_GATES: GateColors = {
  door: '#8b261c',
  gold: ['#f3d27a', '#b4761a'],
  disc: '#fff7e6',
  light: '#fff3c4',
};

const DEFAULT_CONFETTI = ['#f5a623', '#e8791a', '#f8c850', '#c0392b'];

const group = lineGroup(0.1);

export interface GateCountdownProps {
  /** ISO timestamp with an offset, e.g. "2027-04-18T06:30:00+05:30". */
  weddingDate: string;
  venue?: string;
  /** IANA zone the date is shown in. */
  timeZone?: string;
  /** The picture behind the section: any photograph. It is veiled to a faded print, so it stays recognisable behind the writing. */
  image: string;
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  /** The line under the title that tells you what to tap. */
  hint?: string;
  /** What the disc says. */
  openLabel?: string;
  /** Screen-reader label for the disc. */
  openAria?: string;
  /** The four units, in order, as written under the numbers. */
  unitLabels?: [string, string, string, string];
  gates?: Partial<GateColors>;
  /** How soft the picture is, in px of blur. 0 leaves it sharp (a faded print); a few px turns it into a haze. */
  blur?: number;
  /** A wash laid over the picture so the writing on it reads: any CSS background. */
  veil?: string;
  /** The petals that shower when the gates open. */
  confetti?: string[];
  /** The section's own background, under the picture: any CSS background. */
  background?: string;
  /** Palette for the writing. */
  colors?: Partial<SectionColors>;
}

/**
 * "Counting down the days": a heading over a pair of maroon doors with a gold
 * seam and a glowing ring in the middle that says OPEN. Tap the ring and the
 * doors swing wide on their outer hinges (in 3D), petals shower, and behind
 * them, in a golden glow, is the live countdown to the wedding — days, hours,
 * minutes, seconds — with the date and venue under it. The picture behind the
 * whole section is veiled to a faded print (still easy to make out) that fades
 * into the page at the top and bottom. The picture, the doors, the gold, the lettering and the
 * palette are all props. The doors and the countdown are Framer Motion; the
 * ring's glow is CSS (`amb-glow-ring`, `amb-halo`).
 */
export function GateCountdown({
  weddingDate,
  venue,
  timeZone = 'Asia/Kolkata',
  image,
  eyebrow = 'Join the Celebration',
  title = 'Counting Down the Days',
  hint = 'Tap the sacred center ring to swing the golden sanctuary gates open',
  openLabel = 'OPEN',
  openAria = 'Open the gates',
  unitLabels = ['Days', 'Hours', 'Minutes', 'Seconds'],
  gates,
  blur = 0,
  veil = 'linear-gradient(to bottom, rgba(255,249,236,0.7), rgba(255,246,228,0.52) 50%, rgba(255,249,236,0.66))',
  confetti = DEFAULT_CONFETTI,
  background = 'transparent',
  colors,
}: GateCountdownProps) {
  const g = { ...DEFAULT_GATES, ...gates };
  const [opened, setOpened] = useState(false);
  const [burst, setBurst] = useState(false);
  const left = useCountdown(weddingDate);
  const units = [left.days, left.hours, left.minutes, left.seconds];

  function open() {
    setOpened(true);
    setBurst(true);
  }

  const goldFlat = `linear-gradient(135deg, ${g.gold[0]}, ${g.gold[1]} 55%, ${g.gold[0]})`;
  const seam = `linear-gradient(to bottom, ${g.gold[0]}, ${g.gold[1]} 50%, ${g.gold[0]})`;
  const doorFace = (side: 'left' | 'right') =>
    ({
      background: [
        'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.1), transparent 62%)',
        `linear-gradient(${side === 'left' ? 100 : 260}deg, color-mix(in srgb, ${g.door} 82%, #000), ${g.door} 55%, color-mix(in srgb, ${g.door} 88%, #000))`,
      ].join(', '),
      backfaceVisibility: 'hidden',
    }) as CSSProperties;

  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-20 pt-20">
      {/* The picture: soft, warm and veiled, melting into the page above and below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[0] overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, #000 60px, #000 calc(100% - 60px), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 60px, #000 calc(100% - 60px), transparent)',
        }}
      >
        <div className="absolute inset-[0]" style={blur ? { transform: 'scale(1.15)' } : undefined}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 480px) 480px, 100vw"
            className="object-cover"
            style={{ filter: `${blur ? `blur(${blur}px) ` : ''}sepia(0.35) saturate(1.25)`, objectPosition: '50% 42%' }}
          />
        </div>
        <div className="absolute inset-[0]" style={{ background: veil }} />
      </div>

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto flex w-full max-w-[420px] flex-col items-center text-center [text-shadow:0_0_10px_rgba(255,248,232,0.95),0_0_22px_rgba(255,248,232,0.75)]"
      >
        <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-4">
          <RevealLine className="display-lg text-[26px] italic leading-[30px] text-invite-ink">{title}</RevealLine>
        </div>
        <m.p variants={fadeUp} className="body-sm mt-2 max-w-[30ch] italic text-ink-body">
          {hint}
        </m.p>

        {/* The sanctuary: the countdown in a golden glow, and the doors in front of it. */}
        <m.div variants={fadeUp} className="relative mt-10 aspect-[4/3] w-[76%] max-w-[300px]" style={{ perspective: 1100 }}>
          <div
            className="absolute inset-[0] flex flex-col items-center justify-center rounded-md border px-2"
            style={{
              background: `radial-gradient(ellipse at 50% 55%, ${g.light} 0%, color-mix(in srgb, ${g.gold[0]} 70%, ${g.light}) 55%, ${g.gold[0]} 100%)`,
              borderColor: g.gold[1],
              boxShadow: `inset 0 0 28px color-mix(in srgb, ${g.gold[1]} 45%, transparent), 0 14px 30px rgba(90,40,10,0.25)`,
            }}
          >
            <div className="grid w-full grid-cols-4">
              {units.map((value, i) => (
                <div
                  key={unitLabels[i]}
                  className="flex flex-col items-center gap-1"
                  style={i ? { borderLeft: `1px solid color-mix(in srgb, ${g.gold[1]} 35%, transparent)` } : undefined}
                >
                  <span className="display-lg tabular" style={{ color: g.door }}>
                    {value}
                  </span>
                  <span className="text-[10px] font-bold uppercase leading-[14px] tracking-[0.03em]" style={{ color: g.gold[1] }}>
                    {unitLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* The two doors, hinged on the outer edges. */}
          {(['left', 'right'] as const).map((side) => (
            <m.div
              key={side}
              aria-hidden
              className={`absolute inset-y-[0] w-1/2 ${side === 'left' ? 'left-[0] rounded-l-md' : 'right-[0] rounded-r-md'}`}
              style={{ ...doorFace(side), transformOrigin: side === 'left' ? 'left center' : 'right center' }}
              initial={false}
              animate={{ rotateY: opened ? (side === 'left' ? -106 : 106) : 0, opacity: opened ? 0 : 1 }}
              transition={{
                rotateY: { duration: 1.5, ease: EASE.gate },
                opacity: { duration: 0.3, delay: 1.25 },
              }}
            >
              {/* An inner frame, and a bracket at each outer corner. */}
              <span
                className="pointer-events-none absolute inset-[8px] rounded-sm border"
                style={{ borderColor: `color-mix(in srgb, ${g.gold[0]} 28%, transparent)` }}
              />
              <span
                className={`pointer-events-none absolute top-[14px] h-[10px] w-[10px] border-t-2 ${
                  side === 'left' ? 'left-[14px] border-l-2' : 'right-[14px] border-r-2'
                }`}
                style={{ borderColor: `color-mix(in srgb, ${g.gold[0]} 55%, transparent)` }}
              />
              <span
                className={`pointer-events-none absolute bottom-[14px] h-[10px] w-[10px] border-b-2 ${
                  side === 'left' ? 'left-[14px] border-l-2' : 'right-[14px] border-r-2'
                }`}
                style={{ borderColor: `color-mix(in srgb, ${g.gold[0]} 55%, transparent)` }}
              />
              {/* The gold seam, half on each door. */}
              <span
                className={`absolute inset-y-[0] w-[3px] ${side === 'left' ? 'right-[0]' : 'left-[0]'}`}
                style={{ background: seam }}
              />
            </m.div>
          ))}

          {/* The ring over the seam. */}
          <div className="pointer-events-none absolute inset-[0] flex items-center justify-center">
            <m.button
              type="button"
              onClick={open}
              aria-label={openAria}
              aria-expanded={opened}
              className="pointer-events-auto relative flex h-[84px] w-[84px] items-center justify-center rounded-pill"
              style={{ ['--glow' as string]: g.gold[0] } as CSSProperties}
              initial={false}
              animate={opened ? { scale: 1.6, opacity: 0, pointerEvents: 'none' } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE.exit }}
            >
              <span
                aria-hidden
                className="amb-halo pointer-events-none absolute inset-[0] rounded-pill border-2"
                style={{ borderColor: g.gold[0] }}
              />
              <span className="amb-glow-ring absolute inset-[0] rounded-pill" style={{ background: goldFlat }} />
              <span className="absolute inset-[5px] rounded-pill" style={{ background: g.door }} />
              <span
                aria-hidden
                className="absolute inset-[9px] rounded-pill border"
                style={{ borderColor: `color-mix(in srgb, ${g.gold[0]} 55%, transparent)` }}
              />
              <span
                className="relative flex h-[56px] w-[56px] items-center justify-center rounded-pill shadow-md"
                style={{ background: g.disc }}
              >
                <span
                  className="text-[13px] font-bold tracking-[0.1em]"
                  style={{ fontFamily: 'var(--font-display)', color: g.discInk ?? g.door }}
                >
                  {openLabel}
                </span>
              </span>
            </m.button>
          </div>
        </m.div>

        {/* Once the gates are open: when and where. */}
        <m.p
          className="label mt-6 uppercase text-invite-ink"
          initial={false}
          animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 8 }}
          transition={{ duration: 0.8, delay: opened ? 1.2 : 0 }}
          aria-hidden={!opened}
        >
          {formatDay(weddingDate, timeZone)}
          {venue && (
            <>
              {' · '}
              <span className="text-invite-metal">{venue}</span>
            </>
          )}
        </m.p>
      </m.div>

      {burst && <Petals color={confetti} count={22} speed={2} loop={false} onDone={() => setBurst(false)} />}
    </section>
  );
}
