'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteCouple, InviteEvent, InviteGalleryItem, InviteRsvp, InviteStory } from '@/content/invites';
import { TEMPLATE_NAMES } from '@/content/site';
import { EASE } from '@/styles/motion';
import { BackLink } from '../BackLink';
import { BananaTree } from '../BananaTree';
import { ElephantFrieze } from '../ElephantFrieze';
import { EventsSection } from '../EventsSection';
import { GallerySection } from '../GallerySection';
import { GateCountdown } from '../GateCountdown';
import { GuestRsvp } from '../GuestRsvp';
import { Grain, grainBackground } from '../Grain';
import { Mandala } from '../Mandala';
import { LineArtBackdrop } from '../LineArtBackdrop';
import { MeetTheCouple } from '../MeetTheCouple';
import { FloatingOrderBar } from '../OrderButton';
import { Petals } from '../Petals';
import { PhotoLock, type PhotoLockProps } from '../PhotoLock';
import { QuoteSection } from '../QuoteSection';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { ScrollHint } from '../ScrollHint';
import type { SectionColors } from '../sectionTheme';
import { TornEdge } from '../TornEdge';
import { SnakePaths } from '../SnakePaths';
import { StorySection } from '../StorySection';
import { ThankYouSection } from '../ThankYouSection';
import { TempleSkyline } from '../TempleSkyline';
import { useBackgroundMusic } from '../useBackgroundMusic';
import { platinumEventScenes } from './platinumEventScenes';
import { platinumThankYouScene, platinumThankYouTop } from './platinumThankYou';

/**
 * Divine Temple Cinematic — the Platinum-tier template (South Indian). The
 * first screen is a painting of a temple courtyard with a glowing gold disc
 * floating over it; tap the disc and the camera walks into the temple doorway,
 * the screen washes to light, and the invitation opens on warm ivory paper:
 * "the wedding of", the names big and italic, the same temple now framed in a
 * gold arch (drifting slowly, a gold light running round its edge, a glint
 * crossing it) with the venue on a plaque at its foot, banana plants swaying
 * behind it, marigold petals drifting down, and a scrolling mouse inviting you
 * down to the rest.
 *
 * This file only composes shared parts: <PhotoLock /> is the opening,
 * <BananaTree />, <SnakePaths />, <Petals />, <Grain /> and <ScrollHint /> the
 * landing's furniture, and BackLink / FloatingOrderBar the chrome. A variation
 * (another painting, other colours, a different disc) is a thin wrapper passing
 * `backdrop`, `theme` and `lock` — not a copy of this file (see ai-doc/rule.md).
 *
 * Only the opening, the landing and a first block of text exist so far; the rest
 * of the sections come later, as they did for the Silver and Gold templates.
 */

// The warm haze behind the countdown: a web-sized copy of
// public/art/platinum/dhaniel-hartono-JqwpMsiyPGs-unsplash.jpg (a photograph of a
// temple hung with lanterns; blurred, only its light shows).
const LANTERNS = '/art/platinum/temple-lanterns.webp';

// The template's own artwork: a web-sized copy of
// public/art/platinum/indian-temple-with-lotus-pond-people.jpg.
const TEMPLE = '/art/platinum/indian-temple-with-lotus-pond-people.webp';

export interface PlatinumTheme {
  /** The landing's paper: any CSS background. Warm champagne with a soft glow behind the arch. It runs the landing's height, and ends in a tear. */
  sky: string;
  /** The colour the landing's paper ends on, which the tear is painted in so the two join with no seam: the last colour of `sky`. */
  sheet: string;
  /** The thin darker fibre showing along the tear. */
  rim: string;
  /** The paper under the tear, which every section after the landing sits on: any CSS background. Paler than the landing so the tear reads. */
  page: string;
  /** Gold: eyebrows, the divider, the arch's border, the ring on the opening disc. */
  accent: string;
  /** Names and the date. */
  ink: string;
  /** Greeting and venue. */
  inkSoft: string;
  /** What translucent pills (Back) darken to, and the shade at the arch's foot: a deep maroon. */
  ground: string;
  /** The light that runs round the arch's edge: a pale gold. */
  glint: string;
  /** The gap between the arch's gold border and the picture. */
  paper: string;
  /** Marigold petals falling over the landing. */
  petals: string[];
  /** The doors of the countdown: a brick red. */
  door: string;
}

const DEFAULT_THEME: PlatinumTheme = {
  sky: [
    'radial-gradient(ellipse at 50% 46%, rgba(255,252,242,0.95), rgba(255,252,242,0) 62%)',
    'radial-gradient(ellipse at 50% 0%, rgba(214,170,84,0.28), transparent 55%)',
    'linear-gradient(to bottom, #f4ead2 0%, #efe0bd 55%, #e6d0a0 100%)',
  ].join(', '),
  sheet: '#e6d0a0',
  rim: '#c4a566',
  page: 'linear-gradient(to bottom, #fbf4e1, #f5ebd0)',
  accent: '#b88624',
  ink: '#4b1b26',
  inkSoft: '#6e4a3a',
  ground: '#7a1f3b',
  glint: '#fffbe6',
  paper: '#fbf3df',
  petals: ['#f5a623', '#e8791a', '#f8c850'],
  door: '#8b261c',
};

// A metallic gold, for the arch's border.
const GOLD_LEAF = 'linear-gradient(135deg, #d9b45a 0%, #a8761a 30%, #e8c872 50%, #8a5c10 75%, #c99a3a 100%)';
// The arch's outline, in a 300 x 420 box (a semicircle on two straight sides).
const ARCH = 'M1.5 418.5V150A148.5 148.5 0 0 1 298.5 150V418.5Z';

const DEFAULT_QUOTE =
  'Under the beautiful canopy of divine grace, two hearts unite in holy matrimony. A sacred covenant of eternal love, happiness, and shared dreams.';

const hero = lineGroup(0.1);

export interface PlatinumTempleInviteProps {
  bride: string;
  groom: string;
  greeting: string;
  venue?: string;
  /** ISO timestamp with offset. Shown as the date below the landing. */
  weddingDate?: string;
  /** The pictures for "Our love gallery". Omit and that section is left out. */
  gallery?: InviteGalleryItem[];
  /** How guests reply, for "Guest RSVP". Omit and that section is left out. */
  rsvp?: InviteRsvp;
  /** The note in the closing "Thank you". Omit and the template's own is used. */
  thankYou?: string;
  /** The schedule for "Wedding events". Omit and that section is left out. */
  events?: InviteEvent[];
  /** The couple's illustration and milestones for "How we met". Omit and that section is left out. */
  story?: InviteStory;
  /** The words in the pulled-quote section under the couple. */
  quote?: string;
  /** Portraits, full names and families for "Meet the couple". Omit and that section is left out. */
  couple?: InviteCouple;
  /** The painting or photograph: the opening screen, and the arch on the landing. */
  backdrop?: string;
  /** Re-colour the page and text. A variation passes this. */
  theme?: Partial<PlatinumTheme>;
  /** Overrides for the opening: the disc's size and position, its colours, the camera's target and reach, the timings. */
  lock?: Partial<Omit<PhotoLockProps, 'onOpen' | 'onOpened'>>;
  /** What the Order button calls this template in the WhatsApp enquiry. A variation passes its own. */
  templateName?: string;
}

export function PlatinumTempleInvite({
  bride,
  groom,
  venue,
  weddingDate,
  couple,
  story,
  events,
  gallery,
  rsvp,
  thankYou,
  quote = DEFAULT_QUOTE,
  backdrop = TEMPLE,
  theme,
  lock,
  templateName = TEMPLATE_NAMES['platinum-temple'],
}: PlatinumTempleInviteProps) {
  const [revealed, setRevealed] = useState(false);
  // Started by the tap that opens the gate (a browser only lets a tap start sound), then the button on the right pauses and resumes it.
  const music = useBackgroundMusic();
  const t = { ...DEFAULT_THEME, ...theme };
  const sectionColors: Partial<SectionColors> = {
    ink: t.ink,
    body: t.inkSoft,
    muted: t.inkSoft,
    accent: t.accent,
    raised: '#fffaf0',
    line: t.accent,
  };

  // The names the invite tokens use, pinned to this palette so classes like
  // text-invite-metal and text-invite-ink mean what this theme says; and the
  // ones the music button reads.
  const vars = {
    '--invite-ground': t.ground,
    '--invite-metal': t.accent,
    '--invite-ink': t.ink,
    '--invite-ink-soft': t.inkSoft,
    '--surface-raised': '#fffaf0',
    '--ink-strong': t.ink,
    '--line-firm': t.accent,
  } as CSSProperties;

  return (
    <div style={{ ...vars, background: t.page, overflowX: 'clip' }} className="relative min-h-screen">
      <Grain opacity={0.2} />

      {/* Back, top left. Above the cover (z-control) so it stays tappable. */}
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-5">
          <BackLink tone="solid" />
        </div>
      </div>

      {/* Marigold petals keep drifting down the whole invitation: over the content, under the Back and Order buttons. */}
      {revealed && (
        <div aria-hidden className="pointer-events-none fixed inset-[0] z-sticky">
          <Petals color={t.petals} count={12} size={[8, 14]} speed={0.45} />
        </div>
      )}

      {revealed && (
        <div className="relative z-content mx-auto w-full max-w-[480px]">
          {/* The landing: one screen tall. */}
          <section
            style={{ background: t.sky }}
            className="relative flex min-h-[calc(100svh-48px)] flex-col items-center overflow-hidden px-6 pb-6 pt-[84px] text-center"
          >
            <Grain opacity={0.2} />
            <m.div variants={hero} initial="hidden" animate="shown" className="flex flex-col items-center">
              <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
                The Wedding Of
              </m.p>
              <div className="mt-4">
                <RevealLine className="display-xl italic text-invite-ink">{bride}</RevealLine>
                <RevealLine className="display-md text-invite-metal">&amp;</RevealLine>
                <RevealLine className="display-xl italic text-invite-ink">{groom}</RevealLine>
              </div>
            </m.div>

            {/* The arch. The banana plants stand behind it, so their leaves reach out past its shoulders. */}
            <m.div
              className="relative mt-8 w-[80%] max-w-[320px]"
              initial={{ opacity: 0, y: 36, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.55, ease: EASE.entrance }}
            >
              <BananaTree extend={30} className="absolute -left-[52%] bottom-[-9%] w-[88%]" />
              <BananaTree mirror extend={30} phase={2.3} className="absolute -right-[55%] bottom-[-7%] w-[94%]" />

              <div
                className="relative aspect-[5/7] rounded-t-pill p-[4px] shadow-[0_24px_50px_rgba(90,50,10,0.32)]"
                style={{ background: GOLD_LEAF }}
              >
                <div className="h-full rounded-t-pill p-[5px]" style={{ background: t.paper }}>
                  <div className="relative h-full overflow-hidden rounded-t-pill shadow-[inset_0_0_36px_rgba(60,20,10,0.4)]">
                    <Image
                      src={backdrop}
                      alt="A temple courtyard with a flower rangoli floating on the pond"
                      fill
                      sizes="(min-width: 480px) 320px, 80vw"
                      className="amb-drift object-cover"
                      style={{ objectPosition: '50% 34%', ['--drift-dur' as string]: '24s' }}
                    />
                    {/* A glint that crosses the picture now and then. */}
                    <span
                      aria-hidden
                      className="amb-sheen pointer-events-none absolute inset-y-[0] left-[0] w-[34%]"
                      style={{ background: 'linear-gradient(to right, transparent, rgba(255,246,214,0.38), transparent)' }}
                    />
                    {/* The venue, on a plaque at the foot of the picture. */}
                    {venue && (
                      <div
                        className="absolute inset-x-[0] bottom-[0] flex justify-center px-8 pb-6 pt-20"
                        style={{ background: `linear-gradient(to top, color-mix(in srgb, ${t.ground} 78%, #000), transparent)` }}
                      >
                        <p className="label max-w-[22ch] uppercase leading-[1.6] text-[#fff3d6]">{venue}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* The gold light running round the arch's edge. */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 420"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-[0] h-full w-full overflow-visible"
                  fill="none"
                  style={{ filter: `drop-shadow(0 0 4px color-mix(in srgb, ${t.glint} 95%, transparent))` }}
                >
                  <SnakePaths d={ARCH} color={t.glint} duration={9} />
                </svg>
              </div>
            </m.div>

            <ScrollHint className="mt-8 text-invite-metal" />

          </section>

          {/* What the mouse points to: the couple, a pulled quote over a skyline of temples, then the first words. */}
          {couple && (
            <div className="relative">
              {/* The landing's paper carries on past its edge and ends in a tear; the bells hang from beneath it, and a mandala rises from behind it. */}
              <TornEdge
                sheet={`${grainBackground(0.2)}, ${t.sheet}`}
                rim={`${grainBackground(0.2)}, ${t.rim}`}
                base={20}
                amp={22}
                seed={3}
              />
              <MeetTheCouple
                groom={{ ...couple.groom, name: couple.groom.name ?? groom }}
                bride={{ ...couple.bride, name: couple.bride.name ?? bride }}
                colors={sectionColors}
                topArt={<Mandala color={t.accent} duration={110} className="w-[210px]" />}
              />
            </div>
          )}

          <QuoteSection
            quote={quote}
            colors={sectionColors}
            sides={
              <>
                <BananaTree fruit={false} ground={false} className="absolute -left-[10%] top-[34%] w-[24%]" />
                <BananaTree fruit={false} ground={false} mirror phase={1.7} className="absolute -right-[10%] top-[34%] w-[24%]" />
              </>
            }
            scene={<TempleSkyline className="w-full" />}
          />

          {story && (
            <StorySection
              milestones={story.milestones}
              image={story.image}
              colors={sectionColors}
              backdrop={<LineArtBackdrop color={t.accent} />}
            />
          )}

          {weddingDate && (
            <GateCountdown
              weddingDate={weddingDate}
              venue={venue}
              image={LANTERNS}
              colors={sectionColors}
              gates={{ door: t.door, gold: ['#f3d27a', t.accent] }}
            />
          )}

          {events && events.length > 0 && (
            <EventsSection events={events} scenes={platinumEventScenes(t.accent)} colors={sectionColors} />
          )}

          {/* Two lines of elephants, a lamp raised between each pair, to part the events from the pictures. */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: EASE.entrance }}
            className="px-5 pb-6 pt-2"
          >
            <ElephantFrieze className="mx-auto w-full max-w-[420px]" />
          </m.div>

          {gallery && gallery.length > 0 && <GallerySection items={gallery} colors={sectionColors} />}

          {rsvp && <GuestRsvp rsvp={rsvp} bride={bride} groom={groom} colors={sectionColors} />}

          <ThankYouSection
            bride={bride}
            groom={groom}
            message={thankYou}
            colors={sectionColors}
            petals={false}
            top={platinumThankYouTop()}
            scene={platinumThankYouScene()}
            base="#c3801f"
          />
        </div>
      )}

      <PhotoLock
        image={backdrop}
        imageAlt="A temple courtyard with a flower rangoli floating on the pond"
        // The painting's doorway: a little above the middle, on the centre line.
        // The disc floats right over it ("tap to go in"), so the whole tower
        // above stays in view.
        zoomOrigin="50% 41%"
        top="33%"
        initials={`${bride[0]} & ${groom[0]}`}
        {...lock}
        colors={{ accent: t.accent, ink: t.ink, ...lock?.colors }}
        onTap={music.play}
        onOpen={() => setRevealed(true)}
      />

      <FloatingOrderBar templateName={templateName} music={music} />
    </div>
  );
}
