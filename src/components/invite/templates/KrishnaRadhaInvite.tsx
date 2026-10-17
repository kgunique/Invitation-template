'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteCouple, InviteEvent, InviteGalleryItem, InviteRsvp, InviteStory } from '@/content/invites';
import { TEMPLATE_NAMES } from '@/content/site';
import { BackLink } from '../BackLink';
import { Bansuri } from '../Bansuri';
import { BloomLock, type BloomLockProps } from '../BloomLock';
import { BlurReveal } from '../BlurReveal';
import { BudReveal } from '../BudReveal';
import { ChapterTimeline } from '../ChapterTimeline';
import { CountdownTiles } from '../CountdownTiles';
import { CouplePortraits } from '../CouplePortraits';
import { formatDayMonthYear, formatTimeHi, formatWeekdayDate } from '../dates';
import { EventPoster } from '../EventPoster';
import { GallerySection } from '../GallerySection';
import { Grain } from '../Grain';
import { HangingSprite } from '../HangingSprite';
import { PillHeading } from '../PillHeading';
import { QuoteSection } from '../QuoteSection';
import { RsvpSection } from '../RsvpSection';
import { Starfield } from '../Starfield';
import { ThankYouSection } from '../ThankYouSection';
import { krishnaEventScenes } from './krishnaEventScenes';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { ImageRing } from '../ImageRing';
import { FloatingOrderBar } from '../OrderButton';
import { PeacockFeather } from '../PeacockFeather';
import { Petals } from '../Petals';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { ScrollHint } from '../ScrollHint';
import { useBackgroundMusic } from '../useBackgroundMusic';
import { krishnaSerif } from './krishnaFonts';

/**
 * Krishna–Radha — a romantic Platinum invitation ("Vrindavan ki prem leela"): blush paper, rose red, gold, and the
 * blue-green of a peacock feather. Everything after the gate is in Hindi. Built one scene at a time:
 *
 *  1. The gate (approved): a rose hopping over "Touch the rose"; touched, rose grows out of rose in a turning spiral
 *     until the screen is nothing but roses, a gold zigzag draws down the middle, the screen opens along it like a
 *     gate and the roses scatter (`BloomLock`).
 *  2. The landing (in progress): rose petals falling over the whole page, peacock feathers swaying in two corners,
 *     "॥ श्री राधे कृष्ण ॥", the names inside a slowly turning wreath of roses (`ImageRing`), the day and the place.
 *  …then the couple, a quote with a flute, the story, a rose-bud countdown, the events, the gallery, the RSVP and the
 *  thank-you, one at a time.
 *
 * This file only composes shared parts. A variation (other colours, another flower) is a thin wrapper passing
 * `theme` and `lock` — not a copy of this file (see ai-doc/rule.md).
 */

const R = '/art/krishna/';

export interface KrishnaRadhaTheme {
  /** The page under the gate. */
  page: string;
  /** The names and the words. */
  ink: string;
  /** Gold: the seam, the small words. */
  accent: string;
  /** The petals falling over the page. */
  petals: string[];
  /** The paper the sections after the landing sit on. */
  paper: string;
  /** Rose red: pills, accent bars. */
  rose: string;
}

const DEFAULT_THEME: KrishnaRadhaTheme = {
  page: 'radial-gradient(circle at 50% 35%, #fff8f2 0%, #fbe8e1 60%, #f3d3cc 100%)',
  ink: '#7a1f2b',
  accent: '#c9962b',
  petals: ['#c8102e', '#e0384f', '#a50d24', '#f06b7e'],
  paper: 'linear-gradient(to bottom, #f3d3cc 0%, #fbe9e3 18%, #fff6f1 60%, #fbe9e3 100%)',
  rose: '#b3122e',
};

const scene = lineGroup(0.45);

/** A record's family text as lines (one per `\n`). */
const lines = (s?: string) => (s ? s.split('\n') : undefined);

const QUOTE = 'राधा के बिना कृष्ण अधूरे हैं, और कृष्ण के बिना राधा। प्रेम वही है, जहाँ दो आत्माएँ एक हो जाएँ।';

/** The sections' palette on the blush paper. */
const SECTION = {
  ink: '#7a1f2b',
  body: '#5c2a33',
  muted: '#8a5a62',
  accent: '#c9962b',
  raised: '#fffaf7',
  line: '#f1cfcf',
  danger: '#c0392b',
};

/** The night the closing ends in. */
const NIGHT = '#0d1736';

/** The event scenes in the order they are handed out when an event names none. */
const SCENE_ORDER = ['haldi', 'mehendi', 'vivah', 'reception'];
/** The scenes drawn at night, whose cards take the dark style. */
const DARK_SCENES = ['reception'];
/** The scene an event gets: the one its `art` names, or the next in turn. */
const sceneOf = (ev: InviteEvent, i: number) => (ev.art && SCENE_ORDER.includes(ev.art) ? ev.art : SCENE_ORDER[i % SCENE_ORDER.length]);

const EV = '/art/platinum/events/';
// [file, native width, native height, size on screen (%), side, offset from that side (%), swing seconds, delay]
const TORAN = [
  ['ugadi-top-1', 126, 906, 6, 'left', 2, 5.6, -0.8],
  ['ugadi-top-2', 140, 714, 6.6, 'left', 11, 4.7, -2.4],
  ['ugadi-top-3', 131, 515, 6, 'left', 20, 5.1, -1.7],
  ['ugadi-top-5', 126, 517, 6, 'right', 20, 4.9, -3.3],
  ['ugadi-top-6', 131, 722, 6.6, 'right', 11, 5.4, -0.3],
  ['ugadi-top-7', 130, 919, 6, 'right', 2, 4.5, -2.9],
] as const;

/** Strands of marigolds and mango leaves hanging across the top of the closing, each swaying on its own. */
function Toran() {
  return (
    <>
      {TORAN.map(([file, w, h, size, side, off, dur, delay]) => (
        <HangingSprite
          key={file}
          src={`${EV}${file}.webp`}
          width={w}
          height={h}
          size={`${size}%`}
          {...(side === 'left' ? { left: `${off}%` } : { right: `${off}%` })}
          angle={2.4}
          duration={dur}
          delay={delay}
        />
      ))}
    </>
  );
}

export interface KrishnaRadhaInviteProps {
  bride: string;
  groom: string;
  /** ISO timestamp with offset. The landing shows its day. */
  weddingDate?: string;
  /** Where (in Hindi): under the day on the landing. */
  venue?: string;
  /** The names as written in the scenes after the gate (Hindi); `groom.name` / `bride.name` fall back to the short names. */
  couple?: InviteCouple;
  /** The story: its milestones are the chapters (in Hindi). */
  story?: InviteStory;
  /** The programme: a poster each; an event's `art` picks its scene (`haldi`, `mehendi`, `vivah`, `reception`). */
  events?: InviteEvent[];
  gallery?: InviteGalleryItem[];
  /** How guests reply (the RSVP, on WhatsApp). */
  rsvp?: InviteRsvp;
  /** The note of thanks in the closing (in Hindi). */
  thankYou?: string;
  theme?: Partial<KrishnaRadhaTheme>;
  /** Overrides for the gate: the flower, its size, the pace, the seam, the timings. */
  lock?: Partial<Omit<BloomLockProps, 'onOpen' | 'onOpened' | 'onTap'>>;
  templateName?: string;
}

export function KrishnaRadhaInvite({
  bride,
  groom,
  weddingDate,
  venue,
  couple,
  story,
  events,
  gallery,
  rsvp,
  thankYou,
  theme,
  lock,
  templateName = TEMPLATE_NAMES['krishna-radha'],
}: KrishnaRadhaInviteProps) {
  const [revealed, setRevealed] = useState(false);
  // Started by the touch that opens the gate (a browser only lets a gesture start sound).
  const music = useBackgroundMusic();
  const t = { ...DEFAULT_THEME, ...theme };
  const scenes = krishnaEventScenes({ haldi: ['#f5a623', '#e8791a', '#f8c850'], rose: t.petals });

  // The names the shared chrome reads (Back pill, music button), pinned to this palette.
  const vars = {
    '--invite-ground': t.ink,
    '--invite-metal': t.accent,
    '--invite-ink': t.ink,
    '--ink-strong': t.ink,
    '--surface-raised': '#fff8f2',
    '--line-firm': t.accent,
  } as CSSProperties;

  return (
    <div style={{ ...vars, background: t.page, overflowX: 'clip' }} className="relative min-h-screen">
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-5">
          <BackLink tone="page" />
        </div>
      </div>

      {/* Rose petals falling over the whole page, once the gate has opened: what is left of the roses. */}
      {revealed && (
        <div aria-hidden className="pointer-events-none fixed inset-[0] z-sticky">
          <Petals color={t.petals} count={14} size={[9, 16]} speed={0.4} />
        </div>
      )}

      {/* Scene 2, the landing: one screen. Mounted from the start, under the gate, so it is painted when the gate opens. */}
      <section
        lang="hi"
        className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[480px] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-20 text-center"
      >
        <Grain opacity={0.16} />
        {/* Peacock feathers reaching in from two corners, swaying out of step. */}
        <PeacockFeather className="absolute -right-[18px] -top-[30px] w-[96px] rotate-[-142deg]" sway={4} phase={-2} />
        <PeacockFeather className="absolute -bottom-[34px] -left-[16px] w-[90px] rotate-[38deg]" sway={4} duration={8} />

        <m.div variants={scene} initial="hidden" animate={revealed ? 'shown' : 'hidden'} className="relative flex flex-col items-center text-invite-ink">
          <RevealLine className={`${hindiBody.className} text-[19px] font-semibold text-invite-metal`}>॥ श्री राधे कृष्ण ॥</RevealLine>
          <m.p variants={fadeUp} className={`${hindiBody.className} mt-2 text-[16px] opacity-80`}>
            के पावन आशीर्वाद से
          </m.p>

          {/* The names inside a wreath of roses that turns, slowly. */}
          <m.div variants={fadeUp} className="relative my-5 grid place-items-center">
            <ImageRing image={`${R}rose-cutout.webp`} count={16} radius={122} size={44} duration={150} />
            <div className="absolute inset-[0] grid place-items-center">
              <BlurReveal className={`${hindiDisplay.className} flex flex-col items-center leading-[1.25]`}>
                <span className="text-[50px] font-semibold">{couple?.groom.name ?? groom}</span>
                <span className="my-[2px] text-[28px] text-invite-metal">&amp;</span>
                <span className="text-[50px] font-semibold">{couple?.bride.name ?? bride}</span>
              </BlurReveal>
            </div>
          </m.div>

          <m.p variants={fadeUp} className={`${hindiBody.className} text-[17px] font-medium tracking-[0.02em] text-invite-metal`}>
            शुभ विवाह
          </m.p>
          {weddingDate && (
            <m.p variants={fadeUp} className={`${hindiDisplay.className} mt-1 text-[24px] font-medium`}>
              {formatDayMonthYear(weddingDate, 'Asia/Kolkata', 'hi-IN')}
            </m.p>
          )}
          {venue && (
            <m.p variants={fadeUp} className={`${hindiBody.className} mt-1 text-[17px] opacity-85`}>
              {venue}
            </m.p>
          )}
        </m.div>

        {revealed && <ScrollHint label="नीचे देखें" className="absolute bottom-[78px] left-1/2 -translate-x-1/2 text-invite-ink" />}
      </section>

      {/* Scene 3, the couple: the groom and the bride in arches of gold, a rose and a peacock feather in the corners. */}
      {couple && (
        <div className="relative mx-auto w-full max-w-[480px]">
          <CouplePortraits
            lang="hi"
            displayClassName={hindiDisplay.className}
            bodyClassName={hindiBody.className}
            background={t.paper}
            eyebrow="राधे कृष्ण"
            title="प्रेम का अनुपम मिलन"
            labels={{ groom: 'वर', bride: 'वधू' }}
            joiner={
              <span className="relative block h-[30px] w-[30px]">
                <Image src={`${R}rose-cutout.webp`} alt="" fill sizes="30px" className="object-contain" />
              </span>
            }
            cornerLeft={
              <span className="relative block h-[26px] w-[26px]">
                <Image src={`${R}rose-cutout.webp`} alt="" fill sizes="26px" className="object-contain" />
              </span>
            }
            cornerRight={<PeacockFeather className="block h-[60px] w-[18px] -translate-y-[16px] rotate-[18deg]" sway={3} />}
            colors={{
              gold: t.accent,
              accent: t.rose,
              ink: t.ink,
              body: '#5c2a33',
              line: '#f1cfcf',
              card: 'linear-gradient(to bottom, rgba(255,255,255,0.96), rgba(255,244,240,0.96))',
            }}
            groom={{
              title: couple.groom.blessing,
              name: couple.groom.name ?? groom,
              image: couple.groom.image,
              family: lines(couple.groom.family),
            }}
            bride={{
              title: couple.bride.blessing,
              name: couple.bride.name ?? bride,
              image: couple.bride.image,
              family: lines(couple.bride.family),
            }}
          />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[480px]" style={{ background: t.paper }}>
        {/* Scene 4, the quote: Radha and Krishna as one, a peacock feather over it and the flute playing under it. */}
        <QuoteSection
          lang="hi"
          quote={QUOTE}
          label={`${couple?.groom.name ?? groom} & ${couple?.bride.name ?? bride}`}
          icon={<PeacockFeather className="mx-auto block h-[84px] w-[26px]" sway={3} />}
          quoteClassName={`${hindiDisplay.className} text-[19px] leading-[1.9] text-invite-ink`}
          labelClassName={`${hindiBody.className} mt-5 text-[14px] font-semibold tracking-[0.12em] text-invite-metal`}
          colors={SECTION}
          scene={
            <div className="px-[10%] pb-8 pt-10">
              <Bansuri className="w-full rotate-[-4deg]" />
            </div>
          }
        />

        {/* Scene 5, the story: chapters on a rail, a rose and a peacock feather for badges in turn. */}
        {story && story.milestones.length > 0 && (
          <ChapterTimeline
            lang="hi"
            displayClassName={hindiDisplay.className}
            bodyClassName={hindiBody.className}
            eyebrow="प्रेम कथा"
            eyebrowIcon={<span className="text-[13px]">✿</span>}
            title="हमारी प्रेम कहानी"
            subtitle="पहली मुलाक़ात से सात फेरों तक"
            tabsLabel="अध्याय चुनें"
            colors={{ accent: t.rose, gold: t.accent, ink: t.ink, body: SECTION.body, line: SECTION.line }}
            chapters={story.milestones.map((ms, i) => ({
              year: ms.year,
              label: ms.label ?? '',
              title: ms.title,
              subtitle: ms.subtitle,
              text: ms.text,
              tag: ms.tag,
              note: ms.note,
              icon:
                i % 2 === 0 ? (
                  <span className="relative block h-[22px] w-[22px]">
                    <Image src={`${R}rose-cutout.webp`} alt="" fill sizes="22px" className="object-contain" />
                  </span>
                ) : (
                  <span className="text-[18px] leading-none">🦚</span>
                ),
            }))}
          />
        )}

        {/* Scene 6, the countdown: touch the rose bud, it blooms, and the time left rises under it. */}
        {weddingDate && (
          <section lang="hi" className="relative px-4 pb-20 pt-14">
            <PillHeading
              displayClassName={hindiDisplay.className}
              bodyClassName={hindiBody.className}
              eyebrow="शुभ मुहूर्त"
              title="शुभ घड़ी की गिनती"
              subtitle="कली को छुएँ और शुभ घड़ी तक का समय देखें"
              accent={t.rose}
              line={SECTION.line}
              ink={t.ink}
              body={SECTION.body}
            />
            <div className="mt-8">
              <BudReveal
                lang="hi"
                flower={`${R}rose-cutout.webp`}
                prompt="गुलाब की कली को छुएँ"
                button="समय देखें"
                displayClassName={hindiDisplay.className}
                bodyClassName={hindiBody.className}
                colors={{ ink: t.ink, button: t.rose, petals: t.petals }}
              >
                <CountdownTiles
                  weddingDate={weddingDate}
                  labels={['दिन', 'घंटे', 'मिनट', 'सेकंड']}
                  caption={`${formatWeekdayDate(weddingDate, 'Asia/Kolkata', 'hi-IN')} · ${formatTimeHi(weddingDate, 'Asia/Kolkata')}`}
                  displayClassName={hindiDisplay.className}
                  bodyClassName={hindiBody.className}
                  numberColor={t.ink}
                  labelColor={SECTION.body}
                  tile="#ffffff"
                  line={SECTION.line}
                />
              </BudReveal>
            </div>
          </section>
        )}

        {/* Scene 7, the events: a poster each, dressed by its own scene (krishnaEventScenes.tsx). */}
        {events && events.length > 0 && (
          <section lang="hi" className="relative px-4 pb-16 pt-6">
            <PillHeading
              displayClassName={hindiDisplay.className}
              bodyClassName={hindiBody.className}
              eyebrow="शुभ आयोजन"
              plainEyebrow
              title="वैवाहिक कार्यक्रम"
              accent={t.rose}
              line={SECTION.line}
              ink={t.ink}
              body={SECTION.body}
            />
            <div className="mt-8 flex flex-col gap-8">
              {events.map((ev, i) => (
                <EventPoster
                  key={`${ev.startsAt}-${ev.title}`}
                  event={ev}
                  index={i}
                  scene={scenes[sceneOf(ev, i)]}
                  dark={DARK_SCENES.includes(sceneOf(ev, i))}
                  labels={{ event: 'कार्यक्रम', onwards: 'से', map: 'स्थान का मानचित्र देखें' }}
                  formatDate={(iso, tz) => formatWeekdayDate(iso, tz, 'hi-IN')}
                  formatClock={formatTimeHi}
                  displayClassName={hindiDisplay.className}
                  bodyClassName={hindiBody.className}
                  lang="hi"
                  colors={{ accent: t.rose, ink: t.ink, buttonEnd: t.accent }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Scene 8, the gallery. */}
        {gallery && gallery.length > 0 && (
          <div lang="hi" className={hindiBody.className}>
            <GallerySection items={gallery} eyebrow="यादों के पल" title="हमारी तस्वीरें" colors={SECTION} />
          </div>
        )}

        {/* Scene 9, the RSVP: the reply goes to the hosts on WhatsApp; a shower of rose petals on a yes. */}
        {rsvp && (
          <RsvpSection
            locale="hi"
            rsvp={rsvp}
            bride={couple?.bride.name ?? bride}
            groom={couple?.groom.name ?? groom}
            events={events}
            heading={['आपकी', 'उपस्थिति']}
            intro="जैसे राधा कृष्ण की बाँसुरी की धुन पर खिंची चली आती थीं, वैसे ही आप भी हमारे उत्सव में पधारें। कृपया बताइए कि आप आएँगे।"
            ctaLabel="उपस्थिति बताएँ"
            colors={SECTION}
            confetti={t.petals}
          />
        )}
      </div>

      {/* Scene 10, the thank-you: a toran over it, the paper darkening into a Vrindavan night with the moon and stars, and the flute at the foot. */}
      <div className="relative mx-auto w-full max-w-[480px]">
        <ThankYouSection
          lang="hi"
          displayClassName={hindiDisplay.className}
          bodyClassName={hindiBody.className}
          // the shared closing prints `bride` first; this page writes the groom first everywhere
          bride={couple?.groom.name ?? groom}
          groom={couple?.bride.name ?? bride}
          eyebrow="हार्दिक आभार"
          title="धन्यवाद"
          message={thankYou ?? 'आपके स्नेह और आशीर्वाद के बिना यह उत्सव अधूरा है।'}
          wish="श्री राधे-कृष्ण का आशीर्वाद आप सब पर सदा बना रहे।"
          creditLabel="प्रेमपूर्वक बनाया"
          creditByLabel="द्वारा"
          showKalash={false}
          plants={false}
          petals={t.petals}
          top={<Toran />}
          colors={{ ink: '#fbeede', body: '#eadcec', muted: '#c4b6d6', accent: '#f0cf86' }}
          background={`linear-gradient(to bottom, #fbe9e3 0, #d9a8b4 10%, #5a3a6e 26%, #1b2c5e 48%, ${NIGHT} 80%)`}
          backgroundScene={
            <div className="absolute inset-[0]">
              <div className="absolute inset-x-[0] bottom-[0] top-[22%]">
                <Starfield count={50} color="#ffe9b0" constellations={false} />
              </div>
            </div>
          }
          scene={
            // the flute playing under the moon (the moon in the scene, so nothing in the section covers it)
            <div className="relative px-[12%] pb-24 pt-20">
              <span className="absolute left-[8%] top-[0] block h-[60px] w-[60px] drop-shadow-[0_0_18px_rgba(255,233,176,0.45)]">
                <span className="amb-turn-slow absolute inset-[0] block">
                  <Image src="/art/ganga/moon.webp" alt="" fill sizes="60px" className="rounded-pill object-cover" />
                </span>
              </span>
              <Bansuri className="w-full rotate-[-5deg]" colors={{ notes: ['#ffe9b0', '#f6b6c2', '#9fe3d6'] }} />
            </div>
          }
          base={NIGHT}
        />
      </div>

      <BloomLock
        image={`${R}rose-cutout.webp`}
        imageAlt="A red rose"
        labelClassName={`${krishnaSerif.className} text-[26px] font-medium`}
        colors={{ accent: t.accent, ink: t.ink }}
        {...lock}
        onTap={music.play}
        onOpen={() => setRevealed(true)}
      />

      {revealed && <FloatingOrderBar templateName={templateName} music={music} delay={1.2} />}
    </div>
  );
}
