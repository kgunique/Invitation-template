'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { m } from 'motion/react';
import { TEMPLATE_NAMES } from '@/content/site';
import type { InviteDetail, InviteEvent, InviteLocation, InviteRegistry, InviteRsvp } from '@/content/invites';
import { ArchClosing } from '../ArchClosing';
import { ArchTimeline } from '../ArchTimeline';
import { BackLink } from '../BackLink';
import { CoupleScene } from '../CoupleScene';
import { CountdownReveal } from '../CountdownReveal';
import { DetailsSection } from '../DetailsSection';
import { EnvelopeLock, type EnvelopeLockProps } from '../EnvelopeLock';
import { GiftRegistry } from '../GiftRegistry';
import { FloatingOrderBar } from '../OrderButton';
import { GoldDivider } from '../GoldDivider';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { RsvpSection } from '../RsvpSection';
import type { SectionColors } from '../sectionTheme';
import { Starfield, type StarfieldProps } from '../Starfield';
import { VenueSection } from '../VenueSection';
import { formatDay } from '../dates';

/**
 * Starlit Envelope — the Gold-tier template. A night sky with a sealed envelope
 * on it; a gold light runs round the envelope's edge like a snake until the
 * guest taps it. The seal pops, the flap folds back, a letter rises out, and the
 * invitation fades in on the same sky.
 *
 * This file only composes shared parts: <Starfield /> is the sky, <EnvelopeLock />
 * the opening, and BackLink / FloatingOrderBar the chrome. A variation (other
 * colours, a faster snake, a different envelope) is a thin wrapper passing
 * `theme`, `lock` and `stars` — not a copy of this file (see
 * GujaratiKankotriYellowInvite for the pattern, and ai-doc/rule.md).
 *
 * After the opening: the couple scene, a first page, the date reveal
 * (CountdownReveal), the schedule (ArchTimeline), the location (VenueSection) and
 * the RSVP (RsvpSection), all shared sections given this theme's colours. More
 * sections come later, as they did for the Silver template.
 */

export interface NightTheme {
  /** The page background: any CSS background. A mid-night navy, not black, so
   * stars still read and the gold stands out. */
  sky: string;
  /** Gold: eyebrows, the Back pill, the divider. */
  accent: string;
  /** Names and the date. */
  ink: string;
  /** Greeting and venue. */
  inkSoft: string;
  /** What translucent pills (Back) darken to. */
  ground: string;
  /** Cards, inputs and the countdown card: a shade lighter than the sky. */
  card: string;
  /** The scratch-off foil's gradient stops. */
  foil: string[];
  /** The petals that shower on a reveal or a "yes". */
  confetti: string[];
}

const DEFAULT_THEME: NightTheme = {
  sky: 'linear-gradient(to bottom, #2c4170 0%, #1d2c52 55%, #141f3f 100%)',
  accent: '#e6c98a',
  ink: '#f6ecd9',
  inkSoft: '#c9c3dc',
  ground: '#1d2c52',
  card: '#22345f',
  foil: ['#e6c98a', '#c9a45c', '#8fa6e8', '#6d7fc7'],
  confetti: ['#e6c98a', '#f6ecd9', '#8fa6e8'],
};

const group = lineGroup(0.15);

export interface GoldEnvelopeInviteProps {
  bride: string;
  groom: string;
  greeting: string;
  /** The couple's artwork (groom on the left, bride on the right) for the opening
   * scene. Omit and the invitation starts at the text. */
  coupleImage?: string;
  venue?: string;
  /** ISO timestamp with offset. Shown as the date on the first page; the date reveal needs it. */
  weddingDate?: string;
  /** The date reveal (scratch card). On by default (given a date). */
  showCountdown?: boolean;
  /** The schedule, in order. The timeline needs at least one; without any it doesn't render. */
  events?: InviteEvent[];
  /** The "Schedule of events" timeline. On by default (given events). */
  showSchedule?: boolean;
  /** The venue, for the "Location" section. It needs this; without it it doesn't render. */
  location?: InviteLocation;
  /** The "Location" section. On by default (given a location). */
  showLocation?: boolean;
  /** The cards for "Wedding details" (a coordinator to call, …). The section needs at least one card or a registry. */
  details?: InviteDetail[];
  /** The gift registry, shown as a box that opens under the detail cards. */
  registry?: InviteRegistry;
  /** The "Wedding details" section. On by default (given details or a registry). */
  showDetails?: boolean;
  /** The arched closing with the couple's names, their picture (`coupleImage`) in a small cameo,
   * falling red hearts and the Get Invites credit. On by default. */
  showClosing?: boolean;
  /** Where replies go. The RSVP section needs it; without it the section doesn't render. */
  rsvp?: InviteRsvp;
  /** The RSVP. On by default (given `rsvp`). */
  showRsvp?: boolean;
  /** Re-colour the sky and text. A variation passes this. */
  theme?: Partial<NightTheme>;
  /** Overrides for the envelope opening: colours, snake, timings, lettering. */
  lock?: Omit<EnvelopeLockProps, 'onOpen' | 'onOpened'>;
  /** Overrides for the starfield. */
  stars?: StarfieldProps;
  /** What the Order button calls this template in the WhatsApp enquiry. A variation passes its own. */
  templateName?: string;
}

export function GoldEnvelopeInvite({
  bride,
  groom,
  greeting,
  coupleImage,
  venue,
  weddingDate,
  showCountdown = true,
  events,
  showSchedule = true,
  location,
  showLocation = true,
  details,
  registry,
  showDetails = true,
  showClosing = true,
  rsvp,
  showRsvp = true,
  theme,
  lock,
  stars,
  templateName = TEMPLATE_NAMES['gold-envelope'],
}: GoldEnvelopeInviteProps) {
  const [revealed, setRevealed] = useState(false);
  const t = { ...DEFAULT_THEME, ...theme };

  // The theme, as the palette the shared sections take.
  const sectionColors: Partial<SectionColors> = {
    ink: t.ink,
    body: t.inkSoft,
    muted: t.inkSoft,
    accent: t.accent,
    raised: t.card,
    line: `color-mix(in srgb, ${t.accent} 35%, transparent)`,
    danger: '#ff8a80',
  };

  // The names the invite tokens use, pinned to this palette so classes like
  // text-invite-metal and text-invite-ink mean what this theme says.
  const vars = {
    '--invite-ground': t.ground,
    '--invite-metal': t.accent,
    '--invite-ink': t.ink,
    '--invite-ink-soft': t.inkSoft,
  } as CSSProperties;

  return (
    <div style={{ ...vars, background: t.sky }} className="relative min-h-screen overflow-hidden">
      <Starfield {...stars} />

      {/* Back, top left. Above the cover (z-control) so it stays tappable. */}
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-5">
          <BackLink />
        </div>
      </div>

      {revealed && (
        <div className="relative z-content mx-auto w-full max-w-[480px]">
          {/* First, the artwork: groom's name on his side, bride's on hers, then
              they come together inside a red heart. */}
          {coupleImage && (
            <CoupleScene
              image={coupleImage}
              alt={`${groom} and ${bride}`}
              left={groom}
              right={bride}
              heart={{ ink: t.ink }}
            />
          )}

          <m.div
            variants={group}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            className="flex  flex-col items-center justify-center px-6 py-24 text-center"
          >
            <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
              Together with their families
            </m.p>
            <div className="mt-6">
              <RevealLine className="invite-names text-invite-ink">{bride}</RevealLine>
              <RevealLine className="display-lg text-invite-metal">&amp;</RevealLine>
              <RevealLine className="invite-names text-invite-ink">{groom}</RevealLine>
            </div>
            <m.p variants={fadeUp} className="body mt-6 max-w-[28ch] whitespace-pre-line text-invite-ink-soft">
              {greeting}
            </m.p>
            <GoldDivider className="mt-8" />
            {weddingDate && (
              <m.p variants={fadeUp} className="display-md mt-8 text-invite-ink">
                {formatDay(weddingDate, 'Asia/Kolkata')}
              </m.p>
            )}
            {venue && (
              <m.p variants={fadeUp} className="body-lg mt-2 text-invite-ink-soft">
                {venue}
              </m.p>
            )}
          </m.div>

          {/* The shared sections, in this theme's colours. They have no background
              of their own, so the sky and its stars show through. */}
          {showCountdown && weddingDate && (
            <CountdownReveal
              weddingDate={weddingDate}
              venue={venue}
              colors={sectionColors}
              foil={t.foil}
              confetti={t.confetti}
              cardBackground={t.card}
            />
          )}

          {showSchedule && events && events.length > 0 && (
            <ArchTimeline
              events={events}
              weddingDate={weddingDate}
              subtitle="A night to be written in the stars"
              colors={sectionColors}
            />
          )}

          {showLocation && location && <VenueSection location={location} colors={sectionColors} />}

          {showDetails && ((details && details.length > 0) || registry) && (
            <DetailsSection details={details ?? []} colors={sectionColors} cardBackground={t.card}>
              {registry && <GiftRegistry registry={registry} />}
            </DetailsSection>
          )}

          {showRsvp && rsvp && (
            <RsvpSection
              rsvp={rsvp}
              bride={bride}
              groom={groom}
              events={events}
              heading={['Confirm', 'Attendance']}
              intro="Let us know if you will celebrate with us under the stars."
              ctaLabel="Confirm RSVP"
              colors={sectionColors}
              confetti={t.confetti}
            />
          )}

          {showClosing ? (
            <ArchClosing
              bride={bride}
              groom={groom}
              weddingDate={weddingDate}
              portrait={coupleImage}
              colors={sectionColors}
            />
          ) : (
            // Room under the last section for the floating Order Now bar.
            <div aria-hidden className="h-24" />
          )}
        </div>
      )}

      <EnvelopeLock
        eyebrow="The Wedding Invitation"
        title={
          <>
            {bride} &amp; {groom}
          </>
        }
        initials={`${bride[0]} & ${groom[0]}`}
        {...lock}
        colors={{ accent: t.accent, ink: t.ink, ...lock?.colors }}
        onOpen={() => setRevealed(true)}
      />

      <FloatingOrderBar templateName={templateName} />
    </div>
  );
}
