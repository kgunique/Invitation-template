'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { DURATION, EASE } from '@/styles/motion';
import { GoldArch } from './GoldArch';
import { fadeUp, lineGroup } from './RevealLines';

export interface PortraitPerson {
  /** The small line above the name, e.g. "आयुष्मान्" or "Mr.". */
  title?: string;
  name: string;
  /** The picture, already cropped to the frame's shape (5:7, face on the centre line, eyes about a third of the way down). Omit and the name's first letter is drawn. */
  image?: string;
  /** What it shows, for screen readers. Defaults to the name. */
  imageAlt?: string;
  /** The lines of the family box, one per entry (parents, grandparents, the address). */
  family?: string[];
}

export interface CouplePortraitsColors {
  /** The gold of the picture frames, the medallion and the divider lines. */
  gold: string;
  /** The label pills and the accent bar on the family boxes. */
  accent: string;
  /** Names and the title. */
  ink: string;
  /** The family lines. */
  body: string;
  /** The cards' outline. */
  line: string;
  /** What the cards are filled with: any CSS background. */
  card: string;
}

const DEFAULT_COLORS: CouplePortraitsColors = {
  gold: '#d4a62a',
  accent: '#0f77b5',
  ink: '#1c2540',
  body: '#2f3a55',
  line: '#bfe3f6',
  card: 'linear-gradient(to bottom, rgba(255,255,255,0.96), rgba(240,248,253,0.96))',
};

export interface CouplePortraitsProps {
  /** The pill above the title. */
  eyebrow?: string;
  title: string;
  groom: PortraitPerson;
  bride: PortraitPerson;
  /** The pill under each picture. */
  labels?: { groom: string; bride: string };
  /** What sits in the medallion between the two cards. */
  joiner?: ReactNode;
  /** The class that sets the heading face and the one that sets the running-text face (see `hindiFonts.ts`), and the document language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  /** The section's own background: any CSS background. */
  background?: string;
  /** Small ornaments for the section's two top corners (a trident, a crescent). */
  cornerLeft?: ReactNode;
  cornerRight?: ReactNode;
  colors?: Partial<CouplePortraitsColors>;
}

const group = lineGroup(0.1);
const rise = {
  hidden: { opacity: 0, y: 40 },
  shown: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE.entrance } },
};
const pop = {
  hidden: { opacity: 0, scale: 0.6 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

/** The picture in the template's gold arch: the face lit from within, a glint that crosses it now and then. */
function ArchFrame({ person, c, bodyClassName, compact }: { person: PortraitPerson; c: CouplePortraitsColors; bodyClassName: string; compact: boolean }) {
  return (
    <GoldArch gold={c.gold} aspect="5 / 7" className={compact ? 'w-[82%]' : 'w-[68%] max-w-[240px]'}>
      {person.image ? (
        <Image
          src={person.image}
          alt={person.imageAlt ?? person.name}
          fill
          sizes={compact ? '180px' : '(min-width: 480px) 240px, 68vw'}
          className="object-cover"
        />
      ) : (
        <span className={`${bodyClassName} flex h-full items-center justify-center text-[64px]`} style={{ color: c.gold }}>
          {person.name.slice(0, 1)}
        </span>
      )}
      {/* A soft cream haze toward the edges, so a dark or grey background and a pale one sit alike in the frame. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[0]"
        style={{ background: 'radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(255,246,226,0.34) 100%)' }}
      />
      <span
        aria-hidden
        className="amb-sheen pointer-events-none absolute inset-y-[0] left-[0] w-[34%]"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,250,230,0.4), transparent)' }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-[0] shadow-[inset_0_0_26px_rgba(30,40,70,0.28)]" />
    </GoldArch>
  );
}

/**
 * One person's card: the picture in its arch, the label pill, the name under its small title, the family box.
 * `compact` is the narrow one (about 170px across), for a card that sits in the gap beside something else — a river —
 * instead of across the page: smaller type and padding, the picture wider in its card.
 */
export function PersonCard({
  person,
  label,
  side,
  c,
  displayClassName,
  bodyClassName,
  compact = false,
}: {
  person: PortraitPerson;
  label: string;
  /** Which side the accent bar of the family box is on. */
  side: 'left' | 'right';
  c: CouplePortraitsColors;
  displayClassName: string;
  bodyClassName: string;
  compact?: boolean;
}) {
  return (
    <m.article
      variants={rise}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
      className={`mx-auto w-full max-w-[400px] border-2 ${compact ? 'rounded-[20px] px-[10px] pb-4 pt-[16px] shadow-[0_8px_24px_rgba(60,40,10,0.18)]' : 'rounded-[28px] px-4 pb-6 pt-[28px] shadow-[0_10px_34px_rgba(40,90,140,0.12)]'}`}
      style={{ background: c.card, borderColor: c.line }}
    >
      <ArchFrame person={person} c={c} bodyClassName={bodyClassName} compact={compact} />

      <div className={`${compact ? 'mt-3' : 'mt-5'} flex justify-center`}>
        <span
          className={`${bodyClassName} rounded-pill font-semibold text-[#ffffff] shadow-sm ${compact ? 'px-3 py-[3px] text-[12px] tracking-[0.1em]' : 'px-4 py-[5px] text-[12px] tracking-[0.16em]'}`}
          style={{ background: c.accent }}
        >
          {label}
        </span>
      </div>

      <div className={`${compact ? 'mt-2' : 'mt-3'} text-center`}>
        {person.title && (
          <p className={`${bodyClassName} font-medium ${compact ? 'text-[13px]' : 'text-[14px]'}`} style={{ color: c.gold }}>
            {person.title}
          </p>
        )}
        <h3 className={`${displayClassName} font-semibold leading-[1.3] ${compact ? 'text-[26px]' : 'text-[30px]'}`} style={{ color: c.ink }}>
          {person.name}
        </h3>
      </div>

      {person.family && person.family.length > 0 && (
        <div
          className={`${bodyClassName} bg-white text-center shadow-[0_2px_10px_rgba(30,60,100,0.1)] ${compact ? 'mt-3 rounded-[12px] px-[10px] py-2 text-[13px] leading-[1.6]' : 'mx-1 mt-4 rounded-[14px] px-4 py-3 text-[14.5px] leading-[1.7]'}`}
          style={{
            color: c.body,
            [side === 'left' ? 'borderLeft' : 'borderRight']: `${compact ? 3 : 4}px solid ${c.accent}`,
          }}
        >
          {person.family.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </m.article>
  );
}

/**
 * The couple, one card each: a heading under a small pill, then the groom's card, a gold
 * medallion with a line either side, and the bride's card. Each card is a picture in an arch
 * of gold (every picture the same 5:7 shape, so the two sit alike), a label pill, the name
 * (with a small title above it) and a box of family lines whose accent bar is on the outer
 * side. The words are all props (written in any language — pass the Hindi faces from
 * `hindiFonts.ts` for Hindi), and so are the colours, the background and the corner
 * ornaments. Everything rises into place as it scrolls into view.
 */
export function CouplePortraits({
  eyebrow,
  title,
  groom,
  bride,
  labels = { groom: 'THE GROOM', bride: 'THE BRIDE' },
  joiner = '&',
  displayClassName = '',
  bodyClassName = '',
  lang,
  background = 'transparent',
  cornerLeft,
  cornerRight,
  colors,
}: CouplePortraitsProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const vars = { '--invite-metal': c.gold } as CSSProperties;

  return (
    <section lang={lang} style={{ ...vars, background }} className="relative overflow-hidden px-4 pb-20 pt-24">
      <div className="relative mx-auto w-full max-w-[480px]">
      <div aria-hidden className="absolute inset-x-[0] top-[78px]" style={{ color: c.gold }}>
        <div className="relative mx-auto h-[24px] w-full max-w-[480px]">
          <span className="absolute left-[18px] top-[0]">{cornerLeft}</span>
          <span className="absolute right-[18px] top-[0]">{cornerRight}</span>
        </div>
      </div>

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        className="relative flex flex-col items-center text-center"
      >
        {eyebrow && (
          <m.span
            variants={fadeUp}
            className={`${bodyClassName} rounded-pill border bg-white px-5 py-[7px] text-[13px] font-semibold tracking-[0.12em] shadow-sm`}
            style={{ color: c.accent, borderColor: c.line }}
          >
            {eyebrow}
          </m.span>
        )}
        <m.h2 variants={fadeUp} className={`${displayClassName} mt-5 text-[34px] font-semibold leading-[1.3]`} style={{ color: c.ink }}>
          {title}
        </m.h2>
        <m.span variants={fadeUp} aria-hidden className="mt-3 block h-[2px] w-[84px] rounded-pill" style={{ background: `linear-gradient(to right, transparent, ${c.accent}, transparent)` }} />
      </m.div>

      <div className="relative mt-10 flex flex-col items-center">
        <PersonCard person={groom} label={labels.groom} side="right" c={c} displayClassName={displayClassName} bodyClassName={bodyClassName} />

        <m.div
          variants={pop}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 1 }}
          className="my-6 flex w-full max-w-[300px] items-center gap-3"
        >
          <span aria-hidden className="h-[2px] flex-1 rounded-pill" style={{ background: `linear-gradient(to right, transparent, ${c.gold})` }} />
          <span
            className={`${displayClassName} flex h-[52px] w-[52px] items-center justify-center rounded-pill border-2 bg-white text-[24px] shadow-md`}
            style={{ borderColor: c.gold, color: c.accent }}
          >
            {joiner}
          </span>
          <span aria-hidden className="h-[2px] flex-1 rounded-pill" style={{ background: `linear-gradient(to left, transparent, ${c.gold})` }} />
        </m.div>

        <PersonCard person={bride} label={labels.bride} side="left" c={c} displayClassName={displayClassName} bodyClassName={bodyClassName} />
      </div>
      </div>
    </section>
  );
}
