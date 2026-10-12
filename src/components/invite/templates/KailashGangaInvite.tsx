'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { TEMPLATE_NAMES } from '@/content/site';
import { BackLink } from '../BackLink';
import { BlurReveal } from '../BlurReveal';
import type { InviteCouple, InviteEvent, InviteRsvp, InviteStory } from '@/content/invites';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { formatDayMonthYear } from '../dates';
import { FloatingOrderBar } from '../OrderButton';
import { NightHorizon } from '../NightHorizon';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { ScrollHint } from '../ScrollHint';
import { SlideLock, type SlideLockProps } from '../SlideLock';
import { tornFooter } from '../TornEdge';
import { Starfield } from '../Starfield';
import { useBackgroundMusic } from '../useBackgroundMusic';
import { gangaScript, gangaSerif } from './gangaFonts';
import { GangaClosing } from './gangaClosing';
import { GangaStretch } from './gangaStretch';
import { KailashMountain, KailashSky, LandedMoon, MOON_TARGET, NIGHT_FOOT } from './kailashGangaScene';

/**
 * Kailash–Ganga — a spiritual invitation that follows the river from the mountain to the shrine. Built one scene
 * at a time:
 *
 *  1. The gate (done): the Milky Way over the dark mountains, "you are invited to the wedding of", the two names
 *     in script, the date, and a glass slider with the moon on it — slide the moon across and the sky opens.
 *  2. Kailash by moonlight among turning clouds (done): the moon from the slider flies down onto the sky above the
 *     peak and settles there with a halo, and the names (in Hindi, as is every scene from here) rise over it.
 *  3. The Ganga is born at the mountain's foot and flows down the page, between two garlands, past the places where
 *     the sections will sit (in progress).
 *  …then the river runs down the whole page between garlands: the couple, the story, the events, the countdown,
 *  the RSVP, and at the foot the lingam being bathed by the last of the river, and the thank-you.
 *
 * This file only composes shared parts: <SlideLock /> is the gate, <NightHorizon /> and <Starfield /> its sky,
 * <BlurReveal /> its names, and BackLink / FloatingOrderBar the chrome. A variation (other colours, another
 * sky) is a thin wrapper passing `theme` and `lock` — not a copy of this file (see ai-doc/rule.md).
 */

const R = '/art/ganga/';

export interface KailashGangaTheme {
  /** The night under the pictures. */
  ground: string;
  /** The names, the date, and the small words. */
  ink: string;
  /** Gold: the slider's ring, the label's glow, the handle's halo. */
  accent: string;
  /** The page under the gate, once it has opened. */
  page: string;
}

const DEFAULT_THEME: KailashGangaTheme = {
  ground: '#050b1c',
  ink: '#f7ecd2',
  accent: '#e9c97a',
  page: 'linear-gradient(to bottom, #060d22 0%, #0b1736 55%, #12214a 100%)',
};

const intro = lineGroup(0.35);
// The scene after the gate: its words wait until the gate has opened, then rise one after another.
const scene = lineGroup(0.5);

export interface KailashGangaInviteProps {
  bride: string;
  groom: string;
  /** ISO timestamp with offset. The gate shows its day. */
  weddingDate?: string;
  venue?: string;
  /** The groom's and bride's names as written in the scenes after the gate (Hindi); `groom.name` / `bride.name` fall back to the short names. */
  couple?: InviteCouple;
  /** The story: its milestones are the chapters beside the river (in Hindi). */
  story?: InviteStory;
  /** The programme: a card each, beside the river after the story (in Hindi). */
  events?: InviteEvent[];
  /** How guests reply (the RSVP on the lake). */
  rsvp?: InviteRsvp;
  /** The note of thanks in the closing, to the guests (in Hindi). */
  thankYou?: string;
  /** Re-colour the night. A variation passes this. */
  theme?: Partial<KailashGangaTheme>;
  /** Overrides for the gate: the handle's size, where the track sits, the timings. */
  lock?: Partial<Omit<SlideLockProps, 'background' | 'handle' | 'onOpen' | 'onOpened'>>;
  /** What the Order button calls this template in the WhatsApp enquiry. A variation passes its own. */
  templateName?: string;
}

export function KailashGangaInvite({
  bride,
  groom,
  weddingDate,
  venue,
  couple,
  story,
  events,
  rsvp,
  thankYou,
  theme,
  lock,
  templateName = TEMPLATE_NAMES['kailash-ganga'],
}: KailashGangaInviteProps) {
  const [revealed, setRevealed] = useState(false);
  // The slider's moon has flown to the sky above Kailash and landed.
  const [landed, setLanded] = useState(false);
  // Still at the top of the page: the scroll-down hint shows until the guest has begun to scroll.
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Started by the slide that unlocks the gate (a browser only lets a gesture start sound); the button on the right pauses it.
  const music = useBackgroundMusic();
  const t = { ...DEFAULT_THEME, ...theme };

  // The names the invite tokens use, pinned to this palette; and the ones the music button reads.
  const vars = {
    '--invite-ground': '#0b1736',
    '--invite-metal': t.accent,
    '--invite-ink': t.ink,
    '--invite-ink-soft': t.ink,
    '--surface-raised': '#0f1b3d',
    '--ink-strong': t.ink,
    '--line-firm': t.accent,
  } as CSSProperties;

  return (
    <div style={{ ...vars, background: t.page, overflowX: 'clip' }} className="relative min-h-screen">
      {/* Back, top left. Above the cover (z-control) so it stays tappable. */}
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-5">
          <BackLink tone="gate" />
        </div>
      </div>

      {/* The page under the gate, mounted from the start so its pictures are loaded when the gate opens. */}
      <div className="relative isolate mx-auto min-h-[100svh] w-full max-w-[480px] overflow-hidden" style={{ aspectRatio: '375 / 812', background: NIGHT_FOOT }}>
        <KailashSky />
        <KailashMountain />
        <LandedMoon landed={landed} className="left-[50%] top-[36%] h-[76px] w-[76px] -ml-[38px] -mt-[38px]" />

        {/* The first words of the invitation, in Hindi: a blessing, the names, the day and the place. */}
        <m.div
          lang="hi"
          variants={scene}
          initial="hidden"
          animate={revealed ? 'shown' : 'hidden'}
          className="absolute inset-x-[0] top-[7%] z-[5] flex flex-col items-center px-6 text-center"
        >
          <RevealLine className={`${hindiBody.className} text-[22px] font-semibold text-invite-metal`}>शुभ विवाह</RevealLine>
          <BlurReveal className={`${hindiDisplay.className} mt-2 text-[56px] font-semibold leading-[1.3] text-invite-ink [text-shadow:0_2px_22px_rgba(8,16,44,0.85)]`}>
            {couple?.groom.name ?? groom}
            <span className="mx-2 text-[34px] text-invite-metal">&amp;</span>
            {couple?.bride.name ?? bride}
          </BlurReveal>
          {weddingDate && (
            <m.p variants={fadeUp} className={`${hindiDisplay.className} mt-1 text-[26px] font-medium text-invite-ink`}>
              {formatDayMonthYear(weddingDate, 'Asia/Kolkata', 'hi-IN')}
            </m.p>
          )}
          {venue && (
            <m.p variants={fadeUp} className={`${hindiBody.className} mt-1 text-[19px] italic text-invite-ink opacity-90`}>
              {venue}
            </m.p>
          )}
        </m.div>

        {/* The foot of the scene melts into the night the river runs through (the clouds turning round the mountain are cut at the edge otherwise). */}
        <span aria-hidden className="absolute inset-x-[0] bottom-[0] z-[4] h-[130px]" style={{ background: `linear-gradient(to bottom, transparent, ${NIGHT_FOOT})` }} />
      </div>

      {/* Scene 3: the Ganga is born at the mountain's foot and runs down the page between garlands. */}
      {/* The river's page ends in a tear: the sheet with the river on it is torn off across the pool, with a shadow on what is under it (the closing, which is pulled up behind the tear). */}
      <div className="relative z-[3] mx-auto w-full max-w-[480px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-[0] bottom-[-5px] h-[70px]" style={{ background: 'rgba(8,6,28,0.55)', clipPath: tornFooter(7, 18) }} />
        <div style={{ clipPath: tornFooter(7, 18, -420) }}>
          <GangaStretch groom={groom} bride={bride} couple={couple} story={story} events={events} weddingDate={weddingDate} rsvp={rsvp} />
        </div>
      </div>

      {/* The last scene: the thank-you, back under the night the page began in. */}
      <div className="relative z-[1] mx-auto w-full max-w-[480px]" style={{ marginTop: -40, paddingTop: 24, background: '#2c3569' }}>
        <GangaClosing groom={groom} bride={bride} couple={couple} thankYou={thankYou} />
      </div>

      <SlideLock
        lockLabel="Slide the moon to open the invitation"
        label="Slide the moon to open"
        colors={{ ground: t.ground, accent: t.accent, text: t.ink }}
        labelClassName=""
        bottom="16%"
        handle={<Image src={`${R}moon.webp`} alt="" fill sizes="64px" priority className="object-cover" />}
        footer={<p className={`${gangaSerif.className} text-[17px] italic`} style={{ color: t.ink, opacity: 0.88 }}>with the blessings of Mahadev</p>}
        background={
          <>
            {/* The Milky Way, with its stars, that we are slowly flying in towards: two copies half a lap apart, one always fully there. */}
            <div className="absolute inset-[0] overflow-hidden">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="amb-approach absolute inset-[0]"
                  style={{ ['--approach-dur' as string]: '46s', ['--approach-delay' as string]: i ? '-23s' : '0s', ['--approach-origin' as string]: '55% 34%' }}
                >
                  <Image src={`${R}stars.webp`} alt="" fill priority={i === 0} sizes="(min-width: 480px) 480px, 100vw" className="object-cover" />
                  <Starfield color={t.ink} count={44} constellations={false} />
                </div>
              ))}
            </div>
            <span aria-hidden className="absolute inset-x-[0] bottom-[0] h-[40%]" style={{ background: 'linear-gradient(to top, rgba(4,8,20,0.78), transparent)' }} />
            <div className="absolute inset-x-[0] bottom-[0] mx-auto h-full max-w-[480px]">
              <NightHorizon className="h-[21%]" />
            </div>
          </>
        }
        // The slider's moon flies to the sky above Kailash instead of fading with the cover.
        flyTo={MOON_TARGET}
        onLanded={() => setLanded(true)}
        openMs={900}
        fadeMs={1500}
        {...lock}
        onTap={music.play}
        onOpen={() => setRevealed(true)}
      >
        <m.div variants={intro} initial="hidden" animate="shown" className="flex flex-col items-center">
          <RevealLine className="text-[11px] font-semibold uppercase tracking-[0.3em] text-invite-ink">
            You are invited to the wedding of
          </RevealLine>
          <BlurReveal className={`${gangaScript.className} mt-3 text-[70px] leading-[1.05] text-invite-ink [text-shadow:0_2px_22px_rgba(10,20,50,0.8)]`}>
            {groom}
          </BlurReveal>
          <m.span variants={fadeUp} className={`${gangaScript.className} block text-[30px] leading-none text-invite-metal`}>
            &amp;
          </m.span>
          <BlurReveal className={`${gangaScript.className} text-[70px] leading-[1.05] text-invite-ink [text-shadow:0_2px_22px_rgba(10,20,50,0.8)]`}>
            {bride}
          </BlurReveal>
          {weddingDate && (
            <m.p variants={fadeUp} className={`${gangaSerif.className} mt-4 text-[24px] font-medium tracking-[0.04em] text-invite-ink`}>
              {formatDayMonthYear(weddingDate, 'Asia/Kolkata')}
            </m.p>
          )}
        </m.div>
      </SlideLock>

      {revealed && <FloatingOrderBar templateName={templateName} music={music} delay={1.2} />}

      {/* "Scroll down": the mouse and its chevron, in the middle of the screen's foot, until the guest begins to scroll. */}
      <m.div
        aria-hidden={!(landed && atTop)}
        className="pointer-events-none fixed inset-x-[0] bottom-[88px] z-[30] flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: landed && atTop ? 1 : 0 }}
        transition={{ duration: 0.6, delay: landed && atTop ? 0.8 : 0 }}
      >
        <span className={landed && atTop ? 'pointer-events-auto' : ''}>
          <ScrollHint label="नीचे स्क्रॉल करें" className="text-invite-ink" />
        </span>
      </m.div>
    </div>
  );
}
