'use client';

import { useState } from 'react';
import { m } from 'motion/react';
import { formatDay } from './dates';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { ScratchCard } from './ScratchCard';
import { sectionVars, type SectionColors } from './sectionTheme';
import { useCountdown } from './useCountdown';

// Gold -> coral -> rose -> lilac: the marigold, rani and lilac of the Silver
// invite, as one foil.
const DEFAULT_FOIL = ['#f2c879', '#f0a58b', '#d97aa0', '#a68cd6'];
const DEFAULT_CONFETTI = ['#f2c879', '#e8590c', '#d97aa0', '#a68cd6'];

const group = lineGroup(0.2);

const CORNERS = [
  'left-3 top-3 border-l-2 border-t-2 rounded-tl-lg',
  'right-3 top-3 border-r-2 border-t-2 rounded-tr-lg',
  'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
  'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg',
] as const;

/** The countdown card. Ticks on its own, so the scratch card around it never
 * re-renders each second. */
function CountdownFace({ weddingDate, venue, timeZone }: { weddingDate: string; venue?: string; timeZone: string }) {
  const left = useCountdown(weddingDate);
  const units = [
    { label: 'Days', value: left.days },
    { label: 'Hours', value: left.hours },
    { label: 'Minutes', value: left.minutes },
    { label: 'Seconds', value: left.seconds },
  ];

  return (
    <div className="px-4 pb-6 pt-8 text-center">
      <div className="relative rounded-[22px] border border-[color-mix(in_srgb,var(--invite-metal)_35%,transparent)] px-2 py-6">
        {CORNERS.map((corner) => (
          <span
            key={corner}
            aria-hidden
            className={`pointer-events-none absolute h-[22px] w-[22px] border-[color-mix(in_srgb,var(--invite-metal)_55%,transparent)] ${corner}`}
          />
        ))}
        <div className="grid grid-cols-4">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className={`flex flex-col items-center gap-2 ${
                i ? 'border-l border-[color-mix(in_srgb,var(--invite-metal)_30%,transparent)]' : ''
              }`}
            >
              <span className="display-xl tabular text-invite-ink">{unit.value}</span>
              <span className="caption font-bold uppercase tracking-[0.05em] text-invite-metal">{unit.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="label mt-5 uppercase text-invite-ink">
        {formatDay(weddingDate, timeZone)}
        {venue && (
          <>
            {' · '}
            <span className="text-invite-metal">{venue}</span>
          </>
        )}
      </p>
    </div>
  );
}

export interface CountdownRevealProps {
  /** ISO timestamp with an offset, e.g. "2027-02-21T19:00:00+05:30". */
  weddingDate: string;
  venue?: string;
  /** IANA zone the date is shown in. */
  timeZone?: string;
  /** The heading, one entry per line. */
  heading?: string[];
  /** The text printed on the foil. */
  label?: string;
  /** The foil's gradient stops. */
  foil?: string[];
  /** The petals that shower when it is revealed. */
  confetti?: string[];
  /** What the countdown card sits on once the foil is gone: any CSS colour. */
  cardBackground?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own sky. */
  background?: string;
  /** Palette for the heading and the countdown card. Defaults to the Silver cream/plum. */
  colors?: Partial<SectionColors>;
}

/**
 * A date reveal: a heading, then one scratch card. Scratch the foil away and
 * the countdown beneath it is revealed, with a small shower of petals. The
 * foil, the confetti, the card and the whole palette are props, so it works on
 * a white page (Silver) or a night sky (Gold). Reveals on scroll.
 */
export function CountdownReveal({
  weddingDate,
  venue,
  timeZone = 'Asia/Kolkata',
  heading = ['The Celebration', 'Begins In'],
  label = 'Scratch to reveal details',
  foil = DEFAULT_FOIL,
  confetti = DEFAULT_CONFETTI,
  cardBackground = '#faf7f0',
  background = 'transparent',
  colors,
}: CountdownRevealProps) {
  const [burst, setBurst] = useState(false);

  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-6 pb-24 pt-16">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto w-full max-w-[420px] text-center"
      >
        {heading.map((line) => (
          <RevealLine key={line} className="display-lg text-invite-ink">
            {line}
          </RevealLine>
        ))}

        <m.div variants={fadeUp} className="mt-8">
          <ScratchCard
            colors={foil}
            label={label}
            className="rounded-[28px] shadow-lg"
            style={{ background: cardBackground }}
            onReveal={() => setBurst(true)}
          >
            <CountdownFace weddingDate={weddingDate} venue={venue} timeZone={timeZone} />
          </ScratchCard>
        </m.div>
      </m.div>

      {burst && <Petals color={confetti} count={22} speed={2} loop={false} onDone={() => setBurst(false)} />}
    </section>
  );
}
