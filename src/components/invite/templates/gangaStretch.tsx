import type { CSSProperties } from 'react';
import Image from 'next/image';
import { AbhishekShrine } from '../AbhishekShrine';
import { ChapterCard, ChapterNode, type ChapterTimelineColors } from '../ChapterTimeline';
import { CountdownTiles } from '../CountdownTiles';
import { Damru } from '../Damru';
import { PersonCard, type CouplePortraitsColors } from '../CouplePortraits';
import { formatTimeHi, formatWeekdayDate } from '../dates';
import { Diya } from '../Diya';
import { EventPoster, type PosterScene } from '../EventPoster';
import { Lotus, Marigold } from '../FloatingFlora';
import type { Floater } from '../GangaRiver';
import { GarlandEdge } from '../GarlandEdge';
import { Grain } from '../Grain';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { PillHeading } from '../PillHeading';
import type { RiverPoint } from '../river';
import { RiverColumn, type ColumnSection } from '../RiverColumn';
import type { SlotSide } from '../riverLayout';
import { RsvpSection } from '../RsvpSection';
import { SCENE_H } from '../shrine';
import { TouchReveal } from '../TouchReveal';
import type { InviteCouple, InviteEvent, InviteRsvp, InviteStory } from '@/content/invites';
import { NIGHT_FOOT } from './kailashGangaScene';

/**
 * Scenes 3 onward of the Kailash–Ganga template: the Ganga being born, and the sections that sit beside it. Under the
 * mountain the night thins into dawn and the page turns to paper; the river wells up out of Kailash's lower slope, a
 * thread of moonlit water in a bed of cloud, and runs down the page between two garlands of marigolds, carrying lotuses,
 * lily pads, marigolds, jasmine, petals and lamps. The sections (the couple, the story…) are listed in order for a
 * `RiverColumn`: each is a block on one side of the page, the river keeps to the other bank and crosses over in the free
 * paper between two sections that face opposite ways, so it changes direction down the whole page; its water swells and
 * narrows as it goes, and the page measures the sections so the river keeps its distance whatever their text.
 */
const R = '/art/ganga/';

/** The paper the river runs on. */
export const PAPER = '#efe3cc';

/** How far the river's box rises over the mountain scene above it, px: the water wells up out of Kailash's lower slope, not below it. */
const OVERLAP = 190;

/** The river before the first section: from its source at Kailash's foot to its first bank. */
const LEAD: RiverPoint[] = [
  { y: 0, x: 0.5, w: 0.08 },
  { y: 110, x: 0.5, w: 0.11 },
  { y: 250, x: 0.58, w: 0.13 },
  { y: 430, x: 0.69, w: 0.16 },
];

/** Where the river's edge nearest the content runs (see `RiverLayoutOptions`), how wide the water gets, and how the page is spaced. */
const NEAR = { left: 0.64, right: 0.362 };
const WIDTH = { min: 0.13, max: 0.24 };
const LAKE = { x: 0.5, w: 0.9 };
const START = 650;
const CROSSING = 200;
const GAP = 30;
const TAIL = 250;

/** The sections' own colours: warm cream, marigold gold and a saffron accent, on the paper. */
const PALETTE = {
  gold: '#c8962a',
  accent: '#b4501b',
  ink: '#16224a',
  body: '#3b3147',
  line: '#e2cb97',
  card: 'linear-gradient(to bottom, rgba(255,251,240,0.97), rgba(250,240,218,0.97))',
};
const CARD_COLORS: CouplePortraitsColors = PALETTE;
const CHAPTER_COLORS: ChapterTimelineColors = { ...PALETTE, glow: '#38bdf8' };

const WORDS = {
  couple: { eyebrow: 'शुभ परिणय', title: 'वर-वधू', groom: 'वर', bride: 'वधू' },
  story: { eyebrow: 'प्रेम की धारा', title: 'हमारी पावन कथा' },
  events: { eyebrow: 'शुभ आयोजन', title: 'वैवाहिक कार्यक्रम', labels: { event: 'कार्यक्रम', onwards: 'से', map: 'स्थान का मानचित्र देखें' } },
  countdown: { eyebrow: 'शुभ मुहूर्त', title: 'शुभ घड़ी की गिनती', prompt: 'त्रिशूल को छुएँ', button: 'छुएँ', labels: ['दिन', 'घंटे', 'मिनट', 'सेकंड'] as [string, string, string, string] },
  rsvp: { heading: ['आपकी', 'उपस्थिति'], intro: 'माँ गंगा की धारा की तरह आप भी हमारे उत्सव में आइए। कृपया बताइए कि आप पधारेंगे।', cta: 'उपस्थिति बताएँ' },
  shrine: { blessing: 'ॐ नमः शिवाय' },
  hint: 'पानी को छुएँ, दीप बहाएँ',
};

/** The river's colours for the RSVP form on its raft. */
const RSVP_COLORS = { ink: PALETTE.ink, body: PALETTE.body, muted: '#6b5e78', accent: PALETTE.accent, raised: '#fffaf0', line: PALETTE.line, danger: '#c0392b' };
const flip = (s: SlotSide): SlotSide => (s === 'left' ? 'right' : 'left');

/** Every event card: warm cream, with a faint lotus in its corner. */
const EVENT_SCENE: PosterScene = {
  background: PALETTE.card,
  behind: <Lotus className="pointer-events-none absolute -bottom-[14px] -right-[14px] h-[120px] w-[120px] opacity-[0.13]" />,
};
const EVENT_COLORS = { accent: PALETTE.accent, ink: PALETTE.ink, body: PALETTE.body, line: PALETTE.line, buttonEnd: '#8f3a10' };
const lines = (s?: string) => s?.split('\n').filter(Boolean);

const PETALS = ['#ff9a3c', '#f06292', '#fff4e0', '#ffc94d', '#f48fb1'];

/** What floats on a stretch of river about 2300px long: spread along it, so every screen has some (the column repeats the set for a longer river). */
const FLOATERS: Floater[] = [
  { kind: 'lotus', size: 62, lane: 0.1, speed: 22, phase: 0.04, spin: 40 },
  { kind: 'pad', size: 73, lane: -0.5, speed: 20, phase: 0.1, spin: 60 },
  { kind: 'marigold', size: 34, lane: 0.55, speed: 26, phase: 0.16, spin: 200 },
  { kind: 'petal', size: 21, lane: -0.2, speed: 29, phase: 0.2, spin: 260, color: PETALS[0] },
  { kind: 'jasmine', size: 31, lane: 0.3, speed: 25, phase: 0.27, spin: 120 },
  { kind: 'lotus', size: 54, lane: -0.7, speed: 21, phase: 0.33, spin: -50 },
  { kind: 'petal', size: 19, lane: 0.7, speed: 31, phase: 0.38, spin: -200, color: PETALS[1] },
  { kind: 'diya', size: 38, lane: 0.0, speed: 23, phase: 0.44, spin: 20 },
  { kind: 'pad', size: 63, lane: 0.45, speed: 19, phase: 0.5, spin: -40 },
  { kind: 'marigold', size: 31, lane: -0.4, speed: 27, phase: 0.56, spin: -180 },
  { kind: 'petal', size: 20, lane: 0.15, speed: 30, phase: 0.61, spin: 220, color: PETALS[2] },
  { kind: 'lotus', size: 59, lane: 0.6, speed: 22, phase: 0.68, spin: 30 },
  { kind: 'jasmine', size: 29, lane: -0.15, speed: 26, phase: 0.74, spin: -90 },
  { kind: 'petal', size: 21, lane: -0.6, speed: 28, phase: 0.79, spin: 180, color: PETALS[3] },
  { kind: 'diya', size: 35, lane: 0.35, speed: 24, phase: 0.85, spin: -15 },
  { kind: 'marigold', size: 34, lane: 0.0, speed: 25, phase: 0.9, spin: 150 },
  { kind: 'petal', size: 19, lane: 0.5, speed: 30, phase: 0.95, spin: -240, color: PETALS[4] },
  { kind: 'pad', size: 68, lane: -0.3, speed: 20, phase: 0.98, spin: 50 },
];

/** The low clouds thin out towards their lower edge, so they melt into the dawn. */
const CLOUD_FADE = 'linear-gradient(to bottom, #000 45%, transparent)';

/** The mist the river is born in, over its source: a pale glow and two low clouds. */
function Source() {
  return (
    <>
      <span
        aria-hidden
        className="amb-breathe pointer-events-none absolute left-[50%] top-[-30px] h-[240px] w-[70%] -translate-x-1/2 rounded-pill"
        style={{ background: 'radial-gradient(closest-side, rgba(196,222,255,0.8), rgba(150,190,255,0.25) 55%, transparent)', ['--breathe-dur' as string]: '5s' }}
      />
      <Image src={`${R}cloud-b.webp`} alt="" width={900} height={351} sizes="400px" className="pointer-events-none absolute -left-[16%] top-[70px] h-auto w-[66%] max-w-none opacity-80" style={{ filter: 'brightness(1.1)', maskImage: CLOUD_FADE, WebkitMaskImage: CLOUD_FADE }} />
      <Image src={`${R}cloud-a.webp`} alt="" width={900} height={526} sizes="400px" className="pointer-events-none absolute -right-[18%] top-[56px] h-auto w-[62%] max-w-none -scale-x-100 opacity-75" style={{ filter: 'brightness(1.1)', maskImage: CLOUD_FADE, WebkitMaskImage: CLOUD_FADE }} />
    </>
  );
}

export interface GangaStretchProps {
  /** The short names, used where `couple` has no full name. */
  groom: string;
  bride: string;
  /** The couple as the cards show them (Hindi): name, blessing above it, portrait, family lines (one per line). */
  couple?: InviteCouple;
  /** The story: its milestones become the chapters beside the river. */
  story?: InviteStory;
  /** The programme: a card each, beside the river after the story. */
  events?: InviteEvent[];
  /** The wedding's moment: what the countdown counts to (the trishul is touched to show it). */
  weddingDate?: string;
  /** How guests reply: the lake's raft. Omit and there is no raft. */
  rsvp?: InviteRsvp;
}

/**
 * The river's region, to be placed straight under the mountain scene. Its background carries the night into dawn and then
 * paper; the river's column rises `OVERLAP` px over the scene above.
 */
export function GangaStretch({ groom, bride, couple, story, events, weddingDate, rsvp }: GangaStretchProps) {
  const g = couple?.groom;
  const b = couple?.bride;
  const faces = { displayClassName: hindiDisplay.className, bodyClassName: hindiBody.className };
  const heading = (w: { eyebrow: string; title: string }) => (
    <PillHeading eyebrow={w.eyebrow} title={w.title} {...faces} accent={PALETTE.accent} line={PALETTE.line} ink={PALETTE.ink} />
  );

  const sections: ColumnSection[] = [
    // Scene 4: the groom, then (the river having crossed) the bride.
    {
      side: 'left',
      est: 590,
      content: (
        <>
          {heading(WORDS.couple)}
          <div className="mt-6">
            <PersonCard compact person={{ title: g?.blessing, name: g?.name ?? groom, image: g?.image, family: lines(g?.family) }} label={WORDS.couple.groom} side="right" c={CARD_COLORS} {...faces} />
          </div>
        </>
      ),
    },
    {
      side: 'right',
      est: 410,
      content: <PersonCard compact person={{ title: b?.blessing, name: b?.name ?? bride, image: b?.image, family: lines(b?.family) }} label={WORDS.couple.bride} side="left" c={CARD_COLORS} {...faces} />,
    },
  ];

  // Scene 5: the story, a chapter a section, the sides alternating, each marked by a node on the river's bank.
  (story?.milestones ?? []).forEach((ms, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    sections.push({
      side,
      est: 280 + (i === 0 ? 190 : 0),
      content: (
        <>
          {i === 0 && <div className="mb-6">{heading(WORDS.story)}</div>}
          <div className="relative">
            <ChapterCard
              compact
              from={side}
              chapter={{ year: ms.year, label: ms.label ?? '', title: ms.title, subtitle: ms.subtitle, text: ms.text, tag: ms.tag, note: ms.note }}
              c={CHAPTER_COLORS}
              {...faces}
            />
            <ChapterNode index={i} c={CHAPTER_COLORS} bodyClassName={hindiBody.className} className={`top-[20px] ${side === 'left' ? 'right-[-14px]' : 'left-[-14px]'}`} />
          </div>
        </>
      ),
    });
  });

  // Scene 6: the programme, an event a section, taking up the sides where the story left off.
  const last = sections[sections.length - 1]?.side ?? 'right';
  (events ?? []).forEach((ev, i) => {
    const side = (i % 2 === 0) === (last === 'left') ? 'right' : 'left';
    sections.push({
      side,
      est: 350 + (i === 0 ? 190 : 0),
      content: (
        <>
          {i === 0 && <div className="mb-6">{heading(WORDS.events)}</div>}
          <EventPoster
            compact
            event={ev}
            index={i}
            scene={EVENT_SCENE}
            labels={WORDS.events.labels}
            formatDate={(iso, tz) => formatWeekdayDate(iso, tz, 'hi-IN')}
            formatClock={formatTimeHi}
            lang="hi"
            colors={EVENT_COLORS}
            {...faces}
          />
        </>
      ),
    });
  });

  // Scene 7: the countdown. The trishul is the thing to touch: it rings and the days appear.
  if (weddingDate) {
    sections.push({
      side: flip(sections[sections.length - 1]?.side ?? 'right'),
      est: 520,
      content: (
        <>
          <div className="mb-6">{heading(WORDS.countdown)}</div>
          <TouchReveal
            compact
            medallionSize={124}
            displayClassName={faces.displayClassName}
            bodyClassName={faces.bodyClassName}
            lang="hi"
            colors={{ card: 'linear-gradient(165deg, #0a1330 0%, #1b2a58 58%, #0a1330 100%)', gold: '#e9c97a', line: 'rgba(233, 201, 122, 0.55)', button: `linear-gradient(to right, ${PALETTE.accent}, #8f3a10)` }}
            medallion={
              <span className="amb-bob block" style={{ ['--bob-dur' as string]: '3s', ['--bob-y' as string]: '-3px' }}>
                <Image src={`${R}trishul-head.webp`} alt="" width={248} height={447} sizes="120px" className="block h-[96px] w-auto drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
              </span>
            }
            prompt={WORDS.countdown.prompt}
            button={WORDS.countdown.button}
          >
            <CountdownTiles
              columns={2}
              weddingDate={weddingDate}
              labels={WORDS.countdown.labels}
              displayClassName={faces.displayClassName}
              bodyClassName={faces.bodyClassName}
              numberColor="#f6d98a"
              labelColor="#c9d4f0"
              caption={`${formatWeekdayDate(weddingDate, 'Asia/Kolkata', 'hi-IN')} · ${formatTimeHi(weddingDate, 'Asia/Kolkata')}`}
            />
          </TouchReveal>
        </>
      ),
    });
  }

  // Scene 8: the RSVP. The river opens into a lake and the form floats on it, on a raft of paper with flowers round it.
  if (rsvp) {
    sections.push({
      side: 'wide',
      est: 560,
      content: (
        <div className="relative py-12">
          <div className="relative overflow-hidden rounded-[26px] shadow-[0_20px_44px_rgba(4,24,40,0.55)]" style={{ background: 'linear-gradient(to bottom, #f8eed8, #efe3cc)', border: `1.5px solid ${PALETTE.line}` }}>
            <RsvpSection
              locale="hi"
              rsvp={rsvp}
              bride={couple?.bride.name ?? bride}
              groom={couple?.groom.name ?? groom}
              events={events}
              heading={WORDS.rsvp.heading}
              intro={WORDS.rsvp.intro}
              ctaLabel={WORDS.rsvp.cta}
              colors={RSVP_COLORS}
              confetti={['#f5a623', '#e8791a', '#f06292', '#fff4e0']}
            />
          </div>
          <Lotus className="amb-bob pointer-events-none absolute -left-[14px] top-[18px] h-[52px] w-[52px]" style={{ ['--bob-dur' as string]: '3.4s' } as CSSProperties} />
          <Marigold className="amb-bob pointer-events-none absolute -right-[10px] top-[30px] h-[38px] w-[38px]" style={{ ['--bob-dur' as string]: '2.7s' } as CSSProperties} />
          <Diya className="pointer-events-none absolute -bottom-[2px] left-[6px] h-[40px] w-[40px]" />
          <Lotus className="amb-bob pointer-events-none absolute -bottom-[4px] -right-[12px] h-[56px] w-[56px]" style={{ ['--bob-dur' as string]: '3.9s' } as CSSProperties} />
        </div>
      ),
    });
  }

  // Between the lake and the pool the river runs narrow down the middle, with Shiva's two things either side of it: the damru, shaking from the wrist, and the trishul, standing and swaying, with a glint on its prongs.
  sections.push({
    side: 'both',
    est: 270,
    content: (
      <div className="grid grid-cols-[1fr_27%_1fr] items-center py-4">
        <div className="flex justify-center">
          <Damru className="w-[88%] max-w-[112px] drop-shadow-[0_6px_6px_rgba(60,30,5,0.3)]" />
        </div>
        <span aria-hidden />
        <div className="relative flex justify-center">
          <span aria-hidden className="amb-breathe pointer-events-none absolute left-[50%] top-[2%] h-[110px] w-[110px] -translate-x-1/2 rounded-pill" style={{ background: 'radial-gradient(closest-side, rgba(255,214,140,0.7), rgba(255,190,100,0.14) 60%, transparent)', ['--breathe-dur' as string]: '4s' }} />
          <span className="amb-limb relative block" style={{ ['--limb-origin' as string]: '50% 100%', ['--limb-angle' as string]: '2.6deg', ['--limb-dur' as string]: '3.2s' }}>
            <Image src={`${R}trishul.webp`} alt="" width={248} height={663} sizes="100px" className="block h-[218px] w-auto max-w-none drop-shadow-[0_8px_6px_rgba(60,30,5,0.35)]" />
          </span>
          {[
            { left: '24%', top: '2%', size: 13, dur: 2.6, delay: -0.4 },
            { left: '70%', top: '12%', size: 10, dur: 3.2, delay: -1.5 },
            { left: '46%', top: '-6%', size: 9, dur: 2.2, delay: -0.9 },
          ].map((st, i) => (
            <span key={i} aria-hidden className="amb-twinkle pointer-events-none absolute text-[#e9b23c]" style={{ left: st.left, top: st.top, fontSize: st.size, lineHeight: 1, ['--tw-dur' as string]: `${st.dur}s`, ['--tw-delay' as string]: `${st.delay}s`, ['--tw-base' as string]: 0.9 }}>
              ✦
            </span>
          ))}
        </div>
      </div>
    ),
  });

  // Scene 9: the river's end. It opens into a pool; Shiva stands in it and is bathed, with Nandi on a stone beside.
  sections.push({
    side: 'end',
    est: SCENE_H,
    content: (
      <AbhishekShrine
        lang="hi"
        displayClassName={faces.displayClassName}
        bodyClassName={faces.bodyClassName}
        lingam={{ src: '/art/rudra/shiva-abhishek-lingam.webp', width: 900, height: 482, landing: { x: 0.428, y: 0.06 }, pool: { cx: 0.43, cy: 0.74, rx: 0.405, ry: 0.11 }, dome: { halfWidth: 0.097, foot: 0.44 } }}
        nandi={{ src: `${R}nandi.webp`, width: 640, height: 618 }}
        words={WORDS.shrine}
        stone={`${R}pebbles.webp`}
      />
    ),
  });

  return (
    <div className="relative mx-auto flow-root w-full max-w-[480px]" style={{ background: `linear-gradient(to bottom, ${NIGHT_FOOT} 0, #0c1736 90px, #27355f 190px, #7d86ab 300px, #cfc9c4 430px, ${PAPER} 560px)` }}>
      {/* Paper grain over the dawn and the paper, not over the night at the top. */}
      <div className="absolute inset-x-[0] bottom-[0] top-[200px]" style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 220px)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 220px)' }}>
        <Grain opacity={0.22} />
      </div>

      <RiverColumn
        lang="hi"
        overlap={OVERLAP}
        sections={sections}
        floaters={FLOATERS}
        lead={LEAD}
        start={START}
        near={NEAR}
        width={WIDTH}
        lake={LAKE}
        crossing={CROSSING}
        gap={GAP}
        tail={TAIL}
        fadeStart={70}
        releasable
        hint={WORDS.hint}
        hintAt={500}
        hintClassName={hindiBody.className}
        before={<Source />}
      />

      <GarlandEdge side="both" top={300} fadeIn={220} />
    </div>
  );
}
