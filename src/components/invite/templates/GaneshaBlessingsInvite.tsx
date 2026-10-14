'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteCouple, InviteEvent, InviteGalleryItem, InviteRsvp, InviteStory } from '@/content/invites';
import { TEMPLATE_NAMES } from '@/content/site';
import { BackLink } from '../BackLink';
import { BrandCredit } from '../BrandCredit';
import { CelestialStarPetalsShower } from '../CelestialStarPetalsShower';
import { CelestialThemeBackground } from '../CelestialThemeBackground';
import { ChapterTimeline } from '../ChapterTimeline';
import { CountdownTiles } from '../CountdownTiles';
import { CouplePortraits } from '../CouplePortraits';
import { formatDayMonthYear } from '../dates';
import { DivineGate, type DivineGateProps } from '../DivineGate';
import { EventPoster } from '../EventPoster';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { InteractiveGallerySection } from '../InteractiveGallerySection';
import { Mandala } from '../Mandala';
import { MoonDateRevealer } from '../MoonDateRevealer';
import { FloatingOrderBar } from '../OrderButton';
import { PillHeading } from '../PillHeading';
import { PoeticInviteSection } from '../PoeticInviteSection';
import { fadeUp, lineGroup } from '../RevealLines';
import { RsvpSection } from '../RsvpSection';
import { ScrollHint } from '../ScrollHint';
import { SnehabhilashiSection } from '../SnehabhilashiSection';
import { Starfield } from '../Starfield';
import { useBackgroundMusic } from '../useBackgroundMusic';

function StarDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-[180px] sm:w-[220px] mx-auto my-3 sm:my-4 opacity-90 ${className}`}>
      <span
        className="h-[1px] flex-1 block"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #e6be60 100%)' }}
      />
      <span className="text-[16px] text-[#e6be60] leading-none drop-shadow-[0_0_8px_rgba(230,190,96,0.9)]">✦</span>
      <span
        className="h-[1px] flex-1 block"
        style={{ background: 'linear-gradient(90deg, #e6be60 0%, transparent 100%)' }}
      />
    </div>
  );
}

export interface GaneshaBlessingsTheme {
  ground: string;
  ink: string;
  accent: string;
  card: string;
  line: string;
  page: string;
}

const DEFAULT_THEME: GaneshaBlessingsTheme = {
  ground: '#030816',
  ink: '#fdf9ee',
  accent: '#e6be60',
  card: 'rgba(9, 19, 41, 0.88)',
  line: 'rgba(230, 190, 96, 0.28)',
  page: 'linear-gradient(to bottom, #020614 0%, #061129 25%, #0a1b40 50%, #061026 80%, #020612 100%)',
};

export interface GaneshaBlessingsInviteProps {
  bride: string;
  groom: string;
  weddingDate?: string;
  venue?: string;
  couple?: InviteCouple;
  story?: InviteStory;
  events?: InviteEvent[];
  rsvp?: InviteRsvp;
  thankYou?: string;
  gallery?: InviteGalleryItem[];
  theme?: Partial<GaneshaBlessingsTheme>;
  lock?: Partial<DivineGateProps>;
  templateName?: string;
}

const intro = lineGroup(0.4);

/**
 * GaneshaBlessingsInvite — A divine spiritual wedding invitation template.
 *
 * Centered to a 480px column on wide screens with full-screen starry sky.
 * Uses Hindi fonts (hindiDisplay, hindiBody) throughout.
 */
export function GaneshaBlessingsInvite({
  bride,
  groom,
  weddingDate = '2027-02-28T18:30:00+05:30',
  venue = 'अहमदाबाद, गुजरात',
  couple,
  story,
  events,
  gallery,
  rsvp,
  thankYou = 'हमारे इस पावन अवसर पर पधारकर नवदंपति को अपना स्नेह एवं शुभाशीष प्रदान करें।',
  theme,
  lock,
  templateName = TEMPLATE_NAMES['ganesha-blessings'],
}: GaneshaBlessingsInviteProps) {
  const [revealed, setRevealed] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const music = useBackgroundMusic();
  const t = { ...DEFAULT_THEME, ...theme };

  const vars = {
    '--invite-ground': t.ground,
    '--invite-metal': t.accent,
    '--invite-ink': t.ink,
    '--invite-ink-soft': t.ink,
    '--surface-raised': t.card,
    '--ink-strong': t.ink,
    '--line-firm': t.accent,
  } as CSSProperties;

  const formattedDate = weddingDate ? formatDayMonthYear(weddingDate, 'Asia/Kolkata', 'hi-IN') : '';

  const groomDisplayName = couple?.groom.name?.split(' ')[0] || groom || 'आरव';
  const brideDisplayName = couple?.bride.name?.split(' ')[0] || bride || 'काव्या';

  const isAhmedabad = !venue || venue.includes('अहमदाबाद');
  const residenceText = isAhmedabad
    ? 'अ म दा वा द \u00A0\u00A0 नि वा सी'
    : `${venue.split(',')[0].trim()} निवासी`;

  return (
    <div
      lang="hi"
      style={{ ...vars, background: '#020614', overflowX: 'clip' }}
      className="relative min-h-screen text-[#fcf8ef]"
    >
      {/* 1. Full Theme Celestial Cosmic Background (Moon, Orbiting Planets, Constellations) */}
      <CelestialThemeBackground withPetals={false} />

      {/* 2. Floating Shower of Twinkling Stars & Petals Falling from Top to Bottom */}
      <CelestialStarPetalsShower count={42} />

      {/* Top chrome: BackLink on the invite page */}
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-5">
          <BackLink tone="gate" />
        </div>
      </div>

      {/* Floating Order Bar */}
      <FloatingOrderBar templateName={templateName} music={music} />

      {/* 1. DivineGate Opening Screen */}
      <DivineGate
        onTap={music.play}
        onOpen={() => setRevealed(true)}
        topChrome={<BackLink tone="gate" />}
        {...lock}
      />

      {/* 2. Invitation Page underneath */}
      <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center">
        {/* Subtle background starfield */}
        <div className="absolute inset-[0] pointer-events-none opacity-40">
          <Starfield count={55} color="#fedb88" />
        </div>

        {/* Hero / Landing Section (Inspired by user mockup) */}
        <m.section
          variants={intro}
          initial="hidden"
          animate={revealed ? 'shown' : 'hidden'}
          className="relative isolate flex min-h-[100svh] w-full flex-col items-center text-center overflow-hidden px-6 pt-20 sm:pt-24 pb-8"
        >
          {/* Top: Auspicious Header & Star Divider */}
          <m.div variants={fadeUp} className="flex flex-col items-center pt-2 sm:pt-4">
            <h2 className={`${hindiDisplay.className} text-[30px] sm:text-[38px] font-semibold tracking-normal text-[#e6be60] drop-shadow-[0_2px_14px_rgba(230,190,96,0.6)] leading-normal`}>
              || शुभ विवाह ||
            </h2>
            <StarDivider className="mt-4 mb-2" />
          </m.div>

          {/* Center: Groom & Bride Names + Divider + Residence */}
          <m.div variants={fadeUp} className="flex flex-col items-center mt-4 sm:mt-7 mb-4 z-10">
            <h1 className={`${hindiDisplay.className} text-[56px] sm:text-[68px] font-bold tracking-normal text-[#fff9eb] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-[1.15]`}>
              {groomDisplayName}
            </h1>
            <p className="text-[34px] sm:text-[42px] font-normal text-[#e6be60] my-2 sm:my-3 drop-shadow-[0_0_14px_rgba(230,190,96,0.8)] leading-none">
              &amp;
            </p>
            <h1 className={`${hindiDisplay.className} text-[56px] sm:text-[68px] font-bold tracking-normal text-[#fff9eb] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-[1.15]`}>
              {brideDisplayName}
            </h1>

            <StarDivider className="mt-4 mb-2" />

            <p className={`${hindiBody.className} text-[28px] sm:text-[32px] font-semibold text-white tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] leading-normal`}>
              {residenceText}
            </p>
          </m.div>

          {/* Bottom-Center: Scroll Down Mouse Indicator */}
          <m.div
            variants={fadeUp}
            className={`mt-auto relative z-10 transition-opacity duration-500 pb-2 ${atTop ? 'opacity-90' : 'opacity-0'}`}
          >
            <ScrollHint label="नीचे स्क्रॉल करें" className="text-[#fdf9ee]/80 hover:text-white" />
          </m.div>

          {/* Bottom-Right: Rotating Round Chakra (Mandala) with warm golden aura */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[60px] sm:-right-[40px] bottom-[60px] sm:-bottom-[30px] w-[300px] sm:w-[360px] h-[300px] sm:h-[360px] z-[1]"
          >
            {/* Radiant golden sunburst glow behind chakra */}
            <div className="absolute inset-[0] rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,195,85,0.45)_0%,_rgba(215,145,35,0.2)_45%,_transparent_72%)] blur-md amb-divine-aura" />
            {/* Round Chakra SVG rotating */}
            <Mandala
              turn="cw"
              duration={110}
              color="#e6be60"
              className="w-full h-full drop-shadow-[0_0_20px_rgba(230,190,80,0.6)] opacity-95"
            />
          </div>
        </m.section>

        {/* Content sections underneath Hero */}
        <div className="relative z-10 w-full px-5 pt-8 pb-28">
          {/* Meet the Couple Section */}
          {couple && (
            <section className="relative z-10 w-full mt-8 mb-16">
              <CouplePortraits
                eyebrow="शुभ विवाह"
                title="वर एवं वधू"
                groom={{
                  ...couple.groom,
                  name: couple.groom.name || groom,
                  family: couple.groom.family ? couple.groom.family.split('\n') : undefined,
                }}
                bride={{
                  ...couple.bride,
                  name: couple.bride.name || bride,
                  family: couple.bride.family ? couple.bride.family.split('\n') : undefined,
                }}
                labels={{ groom: 'वर', bride: 'वधू' }}
                lang="hi"
                colors={{
                  gold: t.accent,
                  accent: t.accent,
                  ink: t.ink,
                  body: '#d6c7a9',
                  line: t.line,
                  card: t.card,
                }}
                displayClassName={hindiDisplay.className}
                bodyClassName={hindiBody.className}
              />
            </section>
          )}

          {/* Auspicious Poetic Invitation Section (Inspired by user mockup - Tahuko in Hindi) */}
          <PoeticInviteSection />

          {/* Celestial Moon Date Revealer (Rotating Moon, Shake on Click & Blast to Reveal Date) */}
          <MoonDateRevealer weddingDate={weddingDate} venue={venue} />

          {/* Interactive Photo Gallery (Click to Zoom, Bottom Shadow & Caption Reveal) */}
          <InteractiveGallerySection
            items={
              gallery && gallery.length >= 5
                ? gallery.map((g, i) => ({
                    id: `gallery-${i}`,
                    src: g.src,
                    alt: g.alt,
                    caption: g.alt,
                  }))
                : undefined
            }
          />

          {/* Wedding Story Section */}
          {story && story.milestones && story.milestones.length > 0 && (
            <section className="relative z-10 w-full mb-16">
              <ChapterTimeline
                withStars
                eyebrow="पावन कथा"
                title="हमारी प्रेम कथा"
                subtitle="प्रथम मिलन से सात फेरों तक का सफर"
                chapters={story.milestones.map((m) => ({
                  year: m.year,
                  label: m.label || '',
                  title: m.title,
                  subtitle: m.subtitle,
                  text: m.text,
                  tag: m.tag,
                  note: m.note,
                }))}
                lang="hi"
                tabsLabel="अध्याय"
                displayClassName={hindiDisplay.className}
                bodyClassName={hindiBody.className}
                colors={{
                  accent: t.accent,
                  gold: t.accent,
                  ink: t.ink,
                  body: '#d6c7a9',
                  line: t.line,
                  card: t.card,
                  glow: '#38bdf8',
                }}
                neon
              />
            </section>
          )}

          {/* Wedding Events / Ceremonies */}
          {events && events.length > 0 && (
            <section className="relative z-10 w-full mb-16">
              <PillHeading
                plainEyebrow
                eyebrow="मांगलिक उत्सव"
                title="विवाह कार्यक्रम"
                subtitle="आपकी पावन उपस्थिति हमारे उत्सव की शोभा बढ़ाएगी"
                accent={t.accent}
                ink={t.ink}
                body="#d4c3a3"
                line={t.line}
                displayClassName={hindiDisplay.className}
                bodyClassName={hindiBody.className}
              />
              <div className="mt-8 space-y-6">
                {events.map((evt, idx) => (
                  <EventPoster
                    key={idx}
                    event={evt}
                    index={idx}
                    dark
                    celestialBackground
                    labels={{ event: 'समारोह', onwards: 'से', map: 'स्थान देखें' }}
                    displayClassName={hindiDisplay.className}
                    bodyClassName={hindiBody.className}
                    lang="hi"
                    colors={{
                      accent: t.accent,
                      ink: '#ffd875',
                      body: '#fff0bd',
                      line: 'rgba(230, 190, 96, 0.45)',
                      buttonEnd: '#1e3a8a',
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Wedding Countdown */}
          {weddingDate && (
            <section className="relative z-10 w-full mb-16 text-center">
              <PillHeading
                plainEyebrow
                eyebrow="शुभ घड़ी"
                title="शुभ मुहूर्त"
                subtitle="विवाह के पावन क्षण"
                accent={t.accent}
                ink={t.ink}
                body="#d4c3a3"
                line={t.line}
                displayClassName={hindiDisplay.className}
                bodyClassName={hindiBody.className}
              />
              <div className="mt-8 rounded-lg p-6 border border-[#e6be60]/30 bg-[#07132a]/85 backdrop-blur-md">
                <CountdownTiles
                  weddingDate={weddingDate}
                  labels={['दिन', 'घंटे', 'मिनट', 'सेकंड']}
                  caption="विवाह समारोह प्रारंभ होने में शेष समय"
                  displayClassName={hindiDisplay.className}
                  bodyClassName={hindiBody.className}
                  numberColor={t.accent}
                  labelColor="#d4c7a9"
                  tile="rgba(4, 11, 26, 0.75)"
                  line={t.line}
                />
              </div>
            </section>
          )}

          {/* RSVP Section */}
          {rsvp && (
            <section className="relative z-10 w-full mb-16">
              <div className="rounded-lg border border-[#e6be60]/30 bg-[#07132a]/85 backdrop-blur-md p-6">
                <RsvpSection
                  rsvp={rsvp}
                  bride={bride}
                  groom={groom}
                  events={events || []}
                  locale="hi"
                  colors={{
                    ink: '#fff9eb',
                    body: '#e8d5b5',
                    muted: '#d4c3a3',
                    accent: t.accent,
                    raised: t.card,
                    line: t.line,
                    danger: '#ff9f89',
                  }}
                />
              </div>
            </section>
          )}

          {/* Family Well-Wishers Section (|| સ્નેહાભિલાષી ||) - Before Thank You */}
          <SnehabhilashiSection />

          {/* Thank You & Brand Credit */}
          <footer className="relative z-10 w-full pt-8 pb-12 text-center space-y-6">
            <p className={`${hindiBody.className} text-sm text-[#d4c7a9] max-w-sm mx-auto leading-relaxed`}>
              {thankYou}
            </p>
            <div className="pt-4">
              <BrandCredit />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
