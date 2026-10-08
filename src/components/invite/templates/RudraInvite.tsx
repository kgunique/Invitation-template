'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Great_Vibes } from 'next/font/google';
import { m } from 'motion/react';
import type { InviteCouple, InviteEvent, InviteStory } from '@/content/invites';
import { TEMPLATE_NAMES } from '@/content/site';
import { EASE } from '@/styles/motion';
import { BackLink } from '../BackLink';
import { BlurReveal } from '../BlurReveal';
import { ChapterTimeline } from '../ChapterTimeline';
import { CountdownTiles } from '../CountdownTiles';
import { formatTimeHi, formatWeekdayDate } from '../dates';
import { EventPoster } from '../EventPoster';
import { ConvergingPieces } from '../ConvergingPieces';
import { CouplePortraits } from '../CouplePortraits';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { LotusIcon, SparkleIcon, TridentIcon } from '../icons';
import { FloatingOrderBar } from '../OrderButton';
import { Petals } from '../Petals';
import { PhotoLock, type PhotoLockProps } from '../PhotoLock';
import { PillHeading } from '../PillHeading';
import { QuoteSection } from '../QuoteSection';
import { RevealLine, lineGroup } from '../RevealLines';
import { ScrollHint } from '../ScrollHint';
import { SlideInFigure } from '../SlideInFigure';
import { TouchReveal } from '../TouchReveal';
import { TornEdge } from '../TornEdge';
import { useBackgroundMusic } from '../useBackgroundMusic';
import { rudraEventScenes } from './rudraEventScenes';
import { AbhishekWater, RudraGateScene, TEMPLE_GROUND, TEMPLE_SKY, TempleDressing } from './rudraScene';

/**
 * Rudra — a Shiva-themed invitation. The first screen is a bright Himalayan sky with Shiva's
 * lingam under a stream of water and a gold disc ("K & N", a trident over it) floating above;
 * tap the disc and the camera pushes into the lingam, the screen washes to light, and the
 * temple opens: a stone temple among snow peaks, dressed with a toran, marigold strands and
 * bells; the lingam being bathed in front of it with petals showering down on it; the
 * words "The wedding celebration of" and the two names coming into focus; and the groom and
 * the bride walking in from the left and the right, hands joined in prayer. A scrolling
 * mouse invites you down to the rest.
 *
 * This file only composes shared parts: <PhotoLock scene={…} /> is the opening,
 * <BlurReveal />, <SlideInFigure />, <Petals /> and <ScrollHint /> the
 * landing's furniture (<DriftingClouds /> the gate's), and BackLink / FloatingOrderBar the chrome. The artwork is in
 * ./rudraScene.tsx. A variation (another temple, other colours) is a thin wrapper passing
 * `theme` and `lock` — not a copy of this file (see ai-doc/rule.md).
 *
 * Only the opening and the landing exist so far; the sections after it come later, as they did for the other templates.
 */

// The names are set in a script face, loaded for this template alone.
const script = Great_Vibes({ subsets: ['latin'], weight: '400' });

const R = '/art/rudra/';
// Behind the phone-width column on a wide screen: the sky running down into the ground, as it does in the column.
const PAGE = `linear-gradient(to bottom, #174f7c 0, #2f7aa6 200px, ${TEMPLE_SKY} 420px, ${TEMPLE_SKY} 520px, ${TEMPLE_GROUND} 700px, #231a21 1100px) ${TEMPLE_GROUND}`;
const FADE = 'linear-gradient(to bottom, transparent 0%, #000 5%, #000 84%, transparent 100%)';

export interface RudraTheme {
  /** The sky over the temple, from the top of the screen down to where the temple picture begins: any CSS background. It must end on TEMPLE_SKY. */
  sky: string;
  /** The ground under the temple: any CSS background. It must begin on TEMPLE_GROUND. */
  ground: string;
  /** Gold: the ampersand, the trident, the ring on the opening disc. */
  accent: string;
  /** The names and the line above them. */
  ink: string;
  /** What translucent pills (Back) darken to: a deep maroon. */
  deep: string;
  /** The petals showering on the lingam. */
  petals: string[];
  /** The soft light behind the lingam. */
  glow: string;
  /** The paper of the sections after the landing: any CSS background (a pale morning sky). */
  paper: string;
  /** The sky-blue of the label pills and the family boxes' bars. */
  blue: string;
  /** The names and headings on that paper: a deep indigo. */
  navy: string;
}

const DEFAULT_THEME: RudraTheme = {
  sky: `linear-gradient(to bottom, #174f7c 0%, #2f7aa6 22%, ${TEMPLE_SKY} 42%)`,
  ground: `linear-gradient(to bottom, ${TEMPLE_GROUND} 0%, #3b2a29 55%, #231a21 100%)`,
  accent: '#e9b23c',
  ink: '#fffaf0',
  deep: '#7a1f3b',
  petals: ['#f06292', '#ffffff', '#ff9a3c', '#f8c850', '#e8457a'],
  glow: 'rgba(255, 214, 120, 0.55)',
  paper: 'linear-gradient(to bottom, #f4f9fd 0%, #e7f3fb 50%, #f4f9fd 100%)',
  blue: '#0f77b5',
  navy: '#1c2540',
};

// The words of the sections after the landing, in Hindi. A variation (another language, other wording) passes `copy`.
const DEFAULT_COPY = {
  couple: { eyebrow: 'शुभ परिणयोत्सव', title: 'दिव्य मिलन', groom: 'वर', bride: 'वधू' },
  quote:
    'जैसे शिव और शक्ति एक हुए, वैसे ही दो आत्माएँ एक दिव्य पथ पर मिल रही हैं। पावन कृपा और श्रद्धा के साथ, हम विनम्रता से आपकी उपस्थिति और आशीर्वाद की कामना करते हैं।',
  handsAlt: 'शिव और शक्ति के हाथ एक-दूसरे को थामे हुए',
  story: {
    eyebrow: 'ब्रह्मांडीय गाथा',
    title: 'हमारी पावन कथा',
    subtitle: 'दो आत्माएँ, ब्रह्मांड में एक-दूसरे के लिए रची गईं, हाथ थामे अनंत की ओर बढ़ रही हैं।',
    tabs: 'कथा के अध्याय',
  },
  countdown: {
    eyebrow: 'शुभ मुहूर्त',
    title: 'शुभ घड़ी की गिनती',
    subtitle: 'देवताओं के शुभ संयोग के बीच, हम अपने पावन मिलन की प्रतीक्षा कर रहे हैं।',
    prompt: 'दिव्य त्रिशूल को छुएँ',
    button: 'प्रकट करने के लिए छुएँ',
    labels: ['दिन', 'घंटे', 'मिनट', 'सेकंड'] as [string, string, string, string],
  },
  events: {
    eyebrow: 'शुभ आयोजन',
    title: 'वैवाहिक कार्यक्रम',
    labels: { event: 'कार्यक्रम', onwards: 'से', map: 'स्थान का मानचित्र देखें' },
    noteTitle: 'नोट',
    note: 'बारात हमारे निवास स्थान से संध्या 6 बजे निजी वाहन द्वारा “रूपा मैरेज हॉल” आलमगंज, गायघाट के लिए प्रस्थान करेगी।',
  },
};
export type RudraCopy = typeof DEFAULT_COPY;

// The colour the landing's ground ends on (its last stop), which the tear is painted in so the two join with no seam, and the fibre showing along it.
const GROUND_END = '#231a21';
const GROUND_RIM = '#4d3b39';

const hero = lineGroup(0.15);

// The order the landing appears in, in seconds after it mounts (the gate's cover is still fading for the first moments):
// the sky and the names come into focus and the temple fades in behind them; then the lingam; then the hand that pours;
// then the water starts to run and the petals to fall; last, the groom and the bride walk in, and the mouse appears.
const AT = { temple: 0.4, lingam: 2.4, hand: 3.6, water: 4.9, groom: 6.2, bride: 6.7, hint: 8.2 };
// How many pictures the landing waits for: the temple, the lingam and its pool, the pouring hand, the groom and the bride.
const LANDING_PICTURES = 5;
// If a picture never arrives, start anyway after this many ms.
const LANDING_PATIENCE = 12000;

export interface RudraInviteProps {
  bride: string;
  groom: string;
  greeting?: string;
  venue?: string;
  /** ISO timestamp with offset. The countdown ticks to it. Omit and that section is left out. */
  weddingDate?: string;
  /** Portraits, names and family lines for "The Divine Union". Omit and that section is left out. A person's `blessing` is the small title above the name (आयुष्मान्), and `family` is one line per newline. */
  couple?: InviteCouple;
  /** The milestones for "हमारी पावन कथा" (each can carry a `label`, a `subtitle`, a footer `tag` and `note`). Omit and that section is left out. */
  story?: InviteStory;
  /** The programme for "वैवाहिक कार्यक्रम": one poster card each, in order. An event's `art` picks its scene ("haldi", "dev", "vivah", "swagat"; omit and they are taken in turn). Omit and that section is left out. */
  events?: InviteEvent[];
  /** The wording of the sections after the landing (Hindi by default). */
  copy?: { couple?: Partial<RudraCopy['couple']>; quote?: string; handsAlt?: string; story?: Partial<RudraCopy['story']>; countdown?: Partial<RudraCopy['countdown']>; events?: Partial<RudraCopy['events']> };
  /** Re-colour the scene and text. A variation passes this. */
  theme?: Partial<RudraTheme>;
  /** Overrides for the opening: the disc's size and position, its colours, the camera's target and reach, the timings. */
  lock?: Partial<Omit<PhotoLockProps, 'onOpen' | 'onOpened'>>;
  /** What the Order button calls this template in the WhatsApp enquiry. A variation passes its own. */
  templateName?: string;
}

export function RudraInvite({ bride, groom, weddingDate, couple, story, events, copy, theme, lock, templateName = TEMPLATE_NAMES.rudra }: RudraInviteProps) {
  const [revealed, setRevealed] = useState(false);
  // The landing is mounted from the first moment (behind the gate's cover), so its pictures load while the visitor is
  // still looking at the gate. Its sequence (the `AT` timings) starts only once the gate has opened AND all of them
  // are in: on a slow connection the order would otherwise be lost, the water and the garlands running over empty ground.
  const [seen, setSeen] = useState<ReadonlySet<string>>(new Set());
  const [impatient, setImpatient] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setImpatient(true), LANDING_PATIENCE);
    return () => window.clearTimeout(id);
  }, []);
  // Each picture counts once, however often its load event fires (a browser may fetch another size and fire it again).
  const loaded = (id: string) => () => setSeen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  const started = revealed && (seen.size >= LANDING_PICTURES || impatient);
  const fade = (delay: number, duration = 1) => ({
    initial: { opacity: 0 },
    animate: { opacity: started ? 1 : 0 },
    transition: { duration, delay },
  });
  // Started by the tap that opens the gate (a browser only lets a tap start sound), then the button on the right pauses and resumes it.
  const music = useBackgroundMusic();
  const t = { ...DEFAULT_THEME, ...theme };
  const words = {
    couple: { ...DEFAULT_COPY.couple, ...copy?.couple },
    quote: copy?.quote ?? DEFAULT_COPY.quote,
    handsAlt: copy?.handsAlt ?? DEFAULT_COPY.handsAlt,
    story: { ...DEFAULT_COPY.story, ...copy?.story },
    countdown: { ...DEFAULT_COPY.countdown, ...copy?.countdown },
    events: { ...DEFAULT_COPY.events, ...copy?.events },
  };
  // The first word of a full name: "करण कुमार" -> "करण".
  const first = (n: string) => n.split(' ')[0];
  const eventScenes = rudraEventScenes({
    haldi: ['#f5a623', '#e8791a', '#f8c850'],
    dev: ['#f06292', '#ffffff', '#f8c850'],
    vivah: t.petals,
  });
  const lines = (s?: string) => s?.split('\n').filter(Boolean);

  // The names the invite tokens use, pinned to this palette; and the ones the music button reads.
  const vars = {
    '--invite-ground': t.deep,
    '--invite-metal': t.accent,
    '--invite-ink': t.ink,
    '--invite-ink-soft': t.ink,
    '--surface-raised': '#fffaf0',
    '--ink-strong': '#2b2a4a',
    '--line-firm': t.accent,
  } as CSSProperties;

  return (
    <div style={{ ...vars, background: PAGE, overflowX: 'clip' }} className="relative min-h-screen">
      {/* Back, top left. Above the cover (z-control) so it stays tappable. */}
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-5">
          <BackLink tone="solid" />
        </div>
      </div>

      <div className="relative z-content w-full">
          {/* The landing: one screen tall, drawn on a phone-shaped stage so everything keeps its place. */}
          <section
            className="relative mx-auto w-full min-h-[100svh] max-w-[480px] overflow-hidden"
            style={{ aspectRatio: '375 / 812', background: TEMPLE_GROUND }}
          >
            {/* The sky, and the temple under it. The picture's own sky and ground are flat colours, so they run on into the page's. */}
            <div aria-hidden className="absolute inset-x-[0] top-[0] h-[40%]" style={{ background: t.sky }} />
            <div aria-hidden className="absolute inset-x-[0] bottom-[0] top-[40%]" style={{ background: t.ground }} />
            <m.div
              className="absolute inset-x-[0] top-[18%] aspect-square w-full"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, delay: AT.temple, ease: EASE.entrance }}
            >
              <Image
                src={`${R}kedarnath.webp`}
                alt="A stone temple among snow peaks"
                fill
                priority
                onLoad={loaded('temple')}
                onError={loaded('temple')}
                sizes="(min-width: 480px) 480px, 100vw"
                className="object-cover"
                // Its sky and its ground fade into the page's, so no edge shows.
                style={{ maskImage: FADE, WebkitMaskImage: FADE }}
              />
              <TempleDressing />
            </m.div>

            {/* The words, and the names, coming into focus. */}
            <m.div
              variants={hero}
              initial="hidden"
              animate={started ? 'shown' : 'hidden'}
              className="absolute inset-x-[0] top-[7.5%] flex flex-col items-center px-4 text-center"
            >
              <RevealLine className="invite-eyebrow text-invite-ink">The Wedding Celebration Of</RevealLine>
              <BlurReveal className={`${script.className} mt-1 text-[54px] leading-[1.1] text-invite-ink [text-shadow:0_2px_16px_rgba(8,34,64,0.55)]`}>
                {groom}
                <span className="mx-2 text-invite-metal">&amp;</span>
                {bride}
              </BlurReveal>
            </m.div>

            {/* A soft light behind the lingam rises with it. */}
            <m.span
              aria-hidden
              className="pointer-events-none absolute left-[50%] top-[70%] h-[38%] w-[96%] -translate-x-1/2 -translate-y-1/2"
              {...fade(AT.lingam, 1.6)}
            >
              <span
                className="amb-breathe block h-full w-full rounded-pill"
                style={{ background: `radial-gradient(closest-side, ${t.glow}, transparent)` }}
              />
            </m.span>

            {/* The lingam being bathed, in three layers that come one after another: the lingam and its pool, the hand that pours, and the moving water over them. The picture is turned about, so the arm pours from the left and the doorway stays clear. */}
            <div className="pointer-events-none absolute left-[-20.7%] top-[42.6%] w-[124%] max-w-none" style={{ aspectRatio: '900 / 800' }}>
              <div className="absolute inset-[0] -scale-x-100">
                <m.div
                  className="absolute inset-x-[0] top-[39.75%] h-[60.25%]"
                  initial={{ opacity: 0, y: 26 }}
                  animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                  transition={{ duration: 1.2, delay: AT.lingam, ease: EASE.entrance }}
                >
                  <Image
                    src={`${R}shiva-abhishek-lingam.webp`}
                    alt="Lord Shiva's lingam in its pool"
                    fill
                    loading="eager"
                    onLoad={loaded('lingam')}
                    onError={loaded('lingam')}
                    sizes="(min-width: 480px) 600px, 124vw"
                    className="object-contain"
                  />
                </m.div>
                {/* Local x is turned about with the picture: positive is the screen's left, where the arm comes from. */}
                <m.div
                  className="absolute inset-x-[0] top-[0] h-[40.25%]"
                  initial={{ opacity: 0, x: '38%' }}
                  animate={started ? { opacity: 1, x: '0%' } : { opacity: 0, x: '38%' }}
                  transition={{ duration: 1.3, delay: AT.hand, ease: EASE.entrance }}
                >
                  <Image
                    src={`${R}shiva-abhishek-hand.webp`}
                    alt="A hand pouring water over the lingam"
                    fill
                    loading="eager"
                    onLoad={loaded('hand')}
                    onError={loaded('hand')}
                    sizes="(min-width: 480px) 600px, 124vw"
                    className="object-contain"
                  />
                </m.div>
                <m.div className="absolute inset-[0]" {...fade(AT.water, 0.9)}>
                  <AbhishekWater />
                </m.div>
              </div>
            </div>

            {/* Petals showering down on the lingam, once the water runs. */}
            <m.div aria-hidden className="pointer-events-none absolute left-[27%] top-[38%] h-[28%] w-[46%]" {...fade(AT.water, 0.9)}>
              <Petals color={t.petals} count={16} size={[9, 16]} speed={0.6} fit pop />
            </m.div>

            {/* The couple walk in from either side, hands in prayer, and stand either side of the lingam. */}
            <SlideInFigure
              src={`${R}groom-praying.webp`}
              alt={groom}
              width={615}
              height={962}
              from="left"
              size="58%"
              edge="-17%"
              bottom="-2%"
              delay={AT.groom}
              play={started}
              onLoad={loaded('groom')}
            />
            <SlideInFigure
              src={`${R}bride-praying.webp`}
              alt={bride}
              width={1109}
              height={1480}
              from="right"
              size="66%"
              edge="-19%"
              bottom="-4%"
              delay={AT.bride}
              play={started}
              onLoad={loaded('bride')}
              breathe={3.9}
              fadeTop="10px"
            />

            <m.div className="absolute inset-x-[0] bottom-[2.5%] flex justify-center" {...fade(AT.hint, 1)}>
              <span className="rounded-pill bg-[rgba(24,12,14,0.42)] px-3 py-2 backdrop-blur-sm">
                <ScrollHint className="text-invite-ink" />
              </span>
            </m.div>
          </section>

          {revealed && (
          <>
          {/* What the mouse points to: the couple, on a pale morning sky. The landing's ground carries on past its edge and ends in a tear. */}
          {couple && (
            <div className="relative">
              <TornEdge sheet={GROUND_END} rim={GROUND_RIM} base={20} amp={22} seed={5} />
              <CouplePortraits
                lang="hi"
                displayClassName={hindiDisplay.className}
                bodyClassName={hindiBody.className}
                background={t.paper}
                eyebrow={words.couple.eyebrow}
                title={words.couple.title}
                labels={{ groom: words.couple.groom, bride: words.couple.bride }}
                cornerLeft={<TridentIcon />}
                cornerRight={<span className="block text-[22px] leading-none">☾</span>}
                colors={{ gold: t.accent, accent: t.blue, ink: t.navy }}
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

          {/* Shiva and Shakti: a pulled quote, then their two hands, one after the other, come together. */}
          {couple && (
            <QuoteSection
              lang="hi"
              quote={words.quote}
              label={`${first(couple.groom.name ?? groom)} & ${first(couple.bride.name ?? bride)}`}
              icon={<TridentIcon />}
              quoteClassName={`${hindiDisplay.className} text-[17px] leading-[1.9] text-invite-ink`}
              labelClassName={`${hindiBody.className} mt-5 text-[13px] font-semibold tracking-[0.12em] text-invite-metal`}
              background={t.paper}
              colors={{ ink: t.navy, body: t.navy, accent: t.blue, raised: '#ffffff', line: '#bfe3f6' }}
              scene={
                // Just the two hands, no frame and no ground: they come in from the page's own edges.
                <div className="relative mx-auto w-full max-w-[480px] pb-6" style={{ aspectRatio: '900 / 1010' }}>
                  <ConvergingPieces
                    alt={words.handsAlt}
                    pieces={[
                      { src: `${R}hands-shiva.webp`, from: 'right', delay: 0.2 },
                      { src: `${R}hands-shakti.webp`, from: 'left', delay: 1.9 },
                      // his thumb lies in front of her fingers, so it is a layer of its own that travels with his hand
                      { src: `${R}hands-thumb.webp`, from: 'right', delay: 0.2 },
                    ]}
                    meetAt={3.4}
                    sizes="(min-width: 480px) 480px, 100vw"
                    behind={
                      // A golden aura round the clasp, behind the hands so it never washes them out.
                      <span
                        className="amb-breathe absolute left-[52%] top-[26%] h-[56%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-pill"
                        style={{ background: 'radial-gradient(closest-side, rgba(255,205,110,0.55), transparent)' }}
                      />
                    }
                  />
                </div>
              }
            />
          )}

          {/* Our sacred story: three chapters on a rail. */}
          {story && story.milestones.length > 0 && (
            <ChapterTimeline
              lang="hi"
              displayClassName={hindiDisplay.className}
              bodyClassName={hindiBody.className}
              background={t.paper}
              eyebrow={words.story.eyebrow}
              eyebrowIcon={<SparkleIcon className="h-[14px] w-[14px]" />}
              title={words.story.title}
              subtitle={words.story.subtitle}
              tabsLabel={words.story.tabs}
              colors={{ accent: t.blue, gold: t.accent, ink: t.navy }}
              chapters={story.milestones.map((ms, i) => ({
                year: ms.year,
                label: ms.label ?? '',
                title: ms.title,
                subtitle: ms.subtitle,
                text: ms.text,
                tag: ms.tag,
                note: ms.note,
                icon: [<SparkleIcon key="s" />, <TridentIcon key="t" />, <LotusIcon key="l" />][i % 3],
              }))}
            />
          )}

          {/* "Counting down the days": touch the trishul and the countdown appears. */}
          {weddingDate && (
            <section lang="hi" style={{ background: t.paper }} className="relative px-4 pb-24 pt-[56px]">
              <div className="mx-auto w-full max-w-[480px]">
                <PillHeading
                  displayClassName={hindiDisplay.className}
                  bodyClassName={hindiBody.className}
                  accent={t.blue}
                  ink={t.navy}
                  eyebrow={words.countdown.eyebrow}
                  eyebrowIcon={<SparkleIcon className="h-[14px] w-[14px]" />}
                  title={words.countdown.title}
                  subtitle={words.countdown.subtitle}
                />
                <div className="mt-8">
                  <TouchReveal
                    displayClassName={hindiDisplay.className}
                    bodyClassName={hindiBody.className}
                    colors={{ gold: t.accent }}
                    medallion={<TridentIcon className="h-[44px] w-[44px]" />}
                    prompt={words.countdown.prompt}
                    button={words.countdown.button}
                  >
                    <CountdownTiles
                      weddingDate={weddingDate}
                      labels={words.countdown.labels}
                      displayClassName={hindiDisplay.className}
                      bodyClassName={hindiBody.className}
                      numberColor="#f6d98a"
                      caption={`${formatWeekdayDate(weddingDate, 'Asia/Kolkata', 'hi-IN')} · ${formatTimeHi(weddingDate, 'Asia/Kolkata')}`}
                    />
                  </TouchReveal>
                </div>
              </div>
            </section>
          )}

          {/* The programme: one poster card per event. */}
          {events && events.length > 0 && (
            <section lang="hi" style={{ background: t.paper }} className="relative px-4 pb-24 pt-[56px]">
              <div className="mx-auto w-full max-w-[480px]">
                <PillHeading
                  plainEyebrow
                  displayClassName={hindiDisplay.className}
                  bodyClassName={hindiBody.className}
                  accent={t.blue}
                  ink={t.navy}
                  eyebrow={words.events.eyebrow}
                  title={words.events.title}
                />
                <div className="mt-10 flex flex-col gap-8">
                  {events.map((ev, i) => {
                    const keys = Object.keys(eventScenes);
                    return (
                      <EventPoster
                        key={`${ev.startsAt}-${ev.title}`}
                        event={ev}
                        index={i}
                        scene={eventScenes[ev.art ?? ''] ?? eventScenes[keys[i % keys.length]]}
                        labels={words.events.labels}
                        formatDate={(iso, tz) => formatWeekdayDate(iso, tz, 'hi-IN')}
                        formatClock={formatTimeHi}
                        displayClassName={hindiDisplay.className}
                        bodyClassName={hindiBody.className}
                        lang="hi"
                        colors={{ accent: t.blue, ink: t.navy }}
                      />
                    );
                  })}
                </div>

                {words.events.note && (
                  <p
                    className={`${hindiBody.className} mt-8 rounded-[16px] border-l-4 bg-white px-4 py-3 text-[14px] leading-[1.8] shadow-[0_3px_12px_rgba(20,50,90,0.1)]`}
                    style={{ borderColor: t.blue, color: t.navy }}
                  >
                    <strong style={{ color: t.blue }}>{words.events.noteTitle}: </strong>
                    {words.events.note}
                  </p>
                )}
              </div>
            </section>
          )}
          </>
          )}
        </div>

      <PhotoLock
        scene={<RudraGateScene petals={t.petals} />}
        imageAlt="Lord Shiva's lingam under a stream of water, among snow peaks"
        // The lingam's body: on the centre line, a little below the middle. The disc floats above it.
        zoomOrigin="50% 62%"
        zoom={3.2}
        top="10%"
        size={150}
        ornament={<TridentIcon />}
        initials={`${groom[0]} & ${bride[0]}`}
        {...lock}
        colors={{ accent: t.accent, ink: '#2b2a4a', flash: '#eaf5fc', disc: 'rgba(255,255,255,0.9)', ...lock?.colors }}
        onTap={music.play}
        onOpen={() => setRevealed(true)}
      />

      <FloatingOrderBar templateName={templateName} music={music} />
    </div>
  );
}
