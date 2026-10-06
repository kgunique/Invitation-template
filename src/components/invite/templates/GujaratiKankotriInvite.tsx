'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { DURATION } from '@/styles/motion';
import { BackLink } from '../BackLink';
import { FloatingOrderBar, OrderButton } from '../OrderButton';
import { RevealLine, lineGroup } from '../RevealLines';
import { SimpleLock, type SimpleLockProps } from '../SimpleLock';
import { SwingArt } from '../SwingArt';
import type { InviteDetail, InviteEvent, InviteRsvp } from '@/content/invites';
import { TEMPLATE_NAMES } from '@/content/site';
import { KankotriClosing } from './KankotriClosing';
import { KankotriCountdown } from './KankotriCountdown';
import { KankotriDetails } from './KankotriDetails';
import { KankotriLetter } from './KankotriLetter';
import { KankotriRsvp } from './KankotriRsvp';
import { KankotriWaiting } from './KankotriWaiting';
import { KankotriSchedule } from './KankotriSchedule';

/**
 * Gujarati Kankotri — the Silver-tier template. The hero (couple backdrop and
 * names) is always mounted underneath; <SimpleLock /> sits over it and
 * removes itself once opened. SimpleLock's defaults are the maroon/gold look
 * this template wants. A variation of the template is a thin wrapper that
 * passes `lock` (colors, gradient, animation, petals…) — see
 * GujaratiKankotriYellowInvite — rather than a copy of this file.
 *
 * Backdrops are flat JPGs recompressed to webp — no alpha, which is fine for
 * a full-bleed cover background (not an overlay sticker).
 */

export interface GujaratiKankotriInviteProps {
  bride: string;
  groom: string;
  greeting: string;
  /** Hero backdrop. Omit and the hero shows without one. */
  coupleImage?: string;
  /** Overrides for the opening lock; this is how a variation re-skins it. */
  lock?: Omit<SimpleLockProps, 'onOpen' | 'onOpened'>;
  /** What the Order buttons call this template in the WhatsApp enquiry. A variation passes its own. */
  templateName?: string;
  /** The "Dear friends and family" section under the hero. On by default. */
  showLetter?: boolean;
  /** Shown beside the countdown date. */
  venue?: string;
  /** ISO timestamp with offset. The countdown section needs it; without one it doesn't render. */
  weddingDate?: string;
  /** The "Celebration begins in" scratch-card countdown. On by default (given a date). */
  showCountdown?: boolean;
  /** The schedule, in order. The schedule section needs at least one; without any it doesn't render. */
  events?: InviteEvent[];
  /** The "Schedule of events" timeline. On by default (given events). */
  showSchedule?: boolean;
  /** The cards for the "Wedding details" section. It needs at least one; without any it doesn't render. */
  details?: InviteDetail[];
  /** The "Wedding details" cards. On by default (given details). */
  showDetails?: boolean;
  /** Where replies go. The RSVP section needs it; without it the section doesn't render. */
  rsvp?: InviteRsvp;
  /** The RSVP form. On by default (given `rsvp`). */
  showRsvp?: boolean;
  /** Artwork for "We will wait for you". Falls back to `coupleImage`. */
  waitingImage?: string;
  /** The "We will wait for you" section before the closing credit. On by default. */
  showWaiting?: boolean;
  /** The closing artwork and "Designed with Love by Marry Me" credit. On by default. */
  showClosing?: boolean;
}

export function GujaratiKankotriInvite({
  bride,
  groom,
  greeting,
  coupleImage,
  lock,
  templateName = TEMPLATE_NAMES['gujarati-kankotri'],
  showLetter = true,
  venue,
  weddingDate,
  showCountdown = true,
  events,
  showSchedule = true,
  details,
  showDetails = true,
  rsvp,
  showRsvp = true,
  waitingImage,
  showWaiting = true,
  showClosing = true,
}: GujaratiKankotriInviteProps) {
  const [revealing, setRevealing] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* `revealing` flips as the panels start to slide, so the backdrop and
          name stagger play through the widening gap. */}
      <RevealHero bride={bride} groom={groom} coupleImage={coupleImage} visible={revealing} />

      {showLetter && <KankotriLetter />}

      {showCountdown && weddingDate && <KankotriCountdown weddingDate={weddingDate} venue={venue} />}

      {showSchedule && events && events.length > 0 && <KankotriSchedule events={events} weddingDate={weddingDate} />}

      {showDetails && details && details.length > 0 && <KankotriDetails details={details} />}

      {showRsvp && rsvp && <KankotriRsvp rsvp={rsvp} bride={bride} groom={groom} events={events} />}

      {showWaiting && <KankotriWaiting bride={bride} groom={groom} image={waitingImage ?? coupleImage} />}

      {showClosing && <KankotriClosing />}

      {/* Mounted once the panels start to part, so the buttons aren't in the tab
          order while the lock covers the page. */}
      {revealing && <FloatingOrderBar templateName={templateName} music style={HERO_COLORS} />}

      <SimpleLock
        eyebrow="The Wedding Invitation"
        title={
          <>
            {bride} &amp; {groom}
          </>
        }
        message={greeting}
        topLeft={<BackLink />}
        bottomLeft={<OrderButton templateName={templateName} />}
        {...lock}
        onOpen={() => setRevealing(true)}
      />
    </div>
  );
}

// Starts at 0.6s so the first line rises just as the panels clear the centre.
const heroLines = lineGroup(0.6);

// The couple illustrations are JPGs with a baked-in pure-white background, so
// the hero is pinned to the same white and to the light-theme ink. Without
// this, an OS-dark visitor gets dark tokens: a dark page around a white
// picture, with cream text on top of it.
const HERO_COLORS = {
  '--surface-page': '#ffffff',
  '--surface-raised': '#ffffff',
  '--surface-sunken': '#fdf1dd',
  '--invite-ink': '#2a1b3d',
  '--ink-strong': '#2a1b3d',
  '--ink-muted': '#74627f',
  '--line-firm': '#e2caa4',
} as CSSProperties;

function RevealHero({
  bride,
  groom,
  coupleImage,
  visible,
}: {
  bride: string;
  groom: string;
  coupleImage?: string;
  visible: boolean;
}) {
  return (
    // The page is white edge to edge; the content is a phone-width column, so
    // on a desktop the invite stays a centred card instead of stretching.
    <div style={HERO_COLORS} className="relative min-h-screen overflow-hidden bg-surface-page">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden px-6 pb-16 pt-5 text-center">
        <div className="pointer-events-none absolute -right-12 -top-10" aria-hidden>
          <Image
            src="/art/floral/hero-floral-left.webp"
            alt=""
            width={700}
            height={700}
            className="h-[200px] w-auto -scale-x-100 opacity-90 sm:h-[260px]"
          />
        </div>

        <div className="relative z-content flex items-center justify-between">
          <BackLink tone="page" />
        </div>

        {/* The names are centred in the page's own white space above the
            picture — never over the couple. */}
        <div className="relative z-content flex flex-1 items-center justify-center py-2">
          <m.div variants={heroLines} initial="hidden" animate={visible ? 'shown' : 'hidden'}>
            <RevealLine className="invite-names text-invite-ink">{bride}</RevealLine>
            <RevealLine className="display-lg text-marigold-500">&amp;</RevealLine>
            <RevealLine className="invite-names text-invite-ink">{groom}</RevealLine>
            <div className="mt-4">
              <RevealLine className="display-md uppercase tracking-[0.25em] text-ink-muted">Wedding Day</RevealLine>
            </div>
            <div className="mt-2">
              <RevealLine className="body-lg uppercase tracking-[0.16em] text-ink-muted">
                Join us to celebrate
              </RevealLine>
              <RevealLine className="body-lg uppercase tracking-[0.16em] text-ink-muted">our love</RevealLine>
            </div>
          </m.div>
        </div>

        {/* The whole illustration (contain, not cover), edge to edge: -mx-6
            cancels the column padding. Its white margins merge with the page. */}
        <div className="relative -mx-6 aspect-square">
          {coupleImage && (
            <m.div
              className="pointer-events-none absolute inset-[0]"
              initial={{ opacity: 0 }}
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ duration: DURATION.slow, delay: 0.3 }}
            >
              {/* The couple sit on a swing, so the picture rocks forward and back. */}
              <SwingArt>
                <Image
                  src={coupleImage}
                  alt=""
                  fill
                  sizes="(min-width: 480px) 480px, 100vw"
                  className="object-contain"
                />
              </SwingArt>
            </m.div>
          )}
        </div>
      </div>
    </div>
  );
}
