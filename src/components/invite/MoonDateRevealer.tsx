'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import { formatTime, formatTimeHi, formatWeekdayDate } from './dates';
import { hindiBody, hindiDisplay } from './hindiFonts';
import { NIGHT_GLASS, nightGlassVars, type NightGlassColors } from './nightGlass';
import { Starfield } from './Starfield';

export interface MoonDateWords {
  /** The moon button's accessible name. */
  tapLabel: string;
  /** The emoji bobbing over the prompt. */
  pointer: string;
  prompt: string;
  /** The small tracked line under the prompt. */
  hint: string;
  /** The pill at the top of the revealed card. */
  pill: string;
  /** Put after the time. */
  timeNote: string;
  /** Put before the venue. */
  venueLabel: string;
  /** The button at the foot of the card that bursts the moon again. */
  again: string;
}

const HINDI_WORDS: MoonDateWords = {
  tapLabel: 'चंद्रमा पर क्लिक करके शुभ तिथि देखें',
  pointer: '👆',
  prompt: 'चंद्रमा पर स्पर्श करें',
  hint: 'CLICK TO BLAST & REVEAL',
  pill: 'शुभ विवाह मुहूर्त',
  timeNote: '(शुभ लग्न एवं फेरे)',
  venueLabel: 'स्थान:',
  again: 'पुनः ब्लास्ट करने के लिए चाँद पर स्पर्श करें',
};

export interface MoonDateRevealerProps {
  weddingDate: string;
  venue?: string;
  timeZone?: string;
  lang?: string;
  /** Locale of the written-out day; a Hindi one (`hi-…`) also writes the time the Hindi way ("शाम 7:00 बजे"). */
  locale?: string;
  /** The round picture that turns and is tapped. */
  image?: string;
  imageAlt?: string;
  words?: Partial<MoonDateWords>;
  displayClassName?: string;
  bodyClassName?: string;
  colors?: Partial<NightGlassColors>;
  className?: string;
}

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

// 18 deterministic radial sparks for the cosmic blast; `tone` picks ink / bright / gold.
const BLAST_SPARKS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const distance = 130 + (i % 3) * 35;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    size: 14 + (i % 3) * 4,
    isStar: i % 2 === 0,
    tone: (['ink', 'bright', 'gold'] as const)[i % 3],
  };
});

/**
 * MoonDateRevealer — An interactive celestial date revealer section.
 * Features a continuously rotating Moon in a cosmic starfield.
 * On tap/click: triggers a vigorous shake animation, a burst of golden sparks,
 * and reveals the auspicious wedding date and muhurat details.
 */
export function MoonDateRevealer({
  weddingDate,
  venue,
  timeZone = 'Asia/Kolkata',
  lang = 'hi',
  locale = 'hi-IN',
  image = '/art/ganga/moon.webp',
  imageAlt = 'Sacred Moon',
  words,
  displayClassName = hindiDisplay.className,
  bodyClassName = hindiBody.className,
  colors,
  className = '',
}: MoonDateRevealerProps) {
  const [shaking, setShaking] = useState(false);
  const [blasting, setBlasting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const c = { ...NIGHT_GLASS, ...colors };
  const w = { ...HINDI_WORDS, ...words };

  const weekdayDate = formatWeekdayDate(weddingDate, timeZone, locale);
  const timeText = locale.startsWith('hi') ? formatTimeHi(weddingDate, timeZone) : formatTime(weddingDate, timeZone, true);

  const handleMoonClick = () => {
    // Trigger shake and blast
    setShaking(true);
    setBlasting(true);

    setTimeout(() => {
      setRevealed(true);
    }, 350);

    setTimeout(() => {
      setShaking(false);
    }, 700);

    setTimeout(() => {
      setBlasting(false);
    }, 900);
  };

  return (
    <section
      lang={lang}
      style={nightGlassVars(c)}
      className={`relative z-10 w-full min-h-[75vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-12 sm:py-16 mb-16 ${className}`}
    >
      {/* Subtle cosmic background starfield */}
      <div aria-hidden className="pointer-events-none absolute inset-[0] overflow-hidden opacity-50">
        <Starfield count={60} color={c.bright} constellations />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[440px] flex flex-col items-center">
        {/* Moon Sphere with Blast Animation */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Radial celestial halo behind moon */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-[-30px] rounded-pill transition-all duration-700 ${revealed ? 'scale-110' : ''}`}
            style={{
              background: revealed
                ? `radial-gradient(circle at center, ${mix(c.bright, 50)} 0%, ${mix(c.gold, 22)} 45%, transparent 72%)`
                : `radial-gradient(circle at center, ${mix(c.bright, 32)} 0%, ${mix(c.gold, 12)} 45%, transparent 72%)`,
            }}
          />

          {/* Interactive Moon with Continuous Rotation & On-Click Shake */}
          <m.button
            type="button"
            onClick={handleMoonClick}
            aria-label={w.tapLabel}
            animate={
              shaking
                ? {
                    x: [-9, 9, -7, 7, -5, 5, -2, 2, 0],
                    y: [-4, 4, -3, 3, 0],
                    rotate: [-6, 6, -5, 5, -2, 2, 0],
                    scale: [1, 1.12, 0.94, 1.06, 1],
                    filter: [
                      `drop-shadow(0 0 25px ${mix(c.bright, 50)})`,
                      `drop-shadow(0 0 55px ${mix(c.bright, 95)})`,
                      `drop-shadow(0 0 30px ${mix(c.bright, 60)})`,
                    ],
                  }
                : {
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    filter: revealed
                      ? `drop-shadow(0 0 35px ${mix(c.bright, 65)})`
                      : `drop-shadow(0 0 20px ${mix(c.bright, 40)})`,
                  }
            }
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="relative w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] rounded-pill cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            {/* The rotating Moon image */}
            <div className="amb-turn-slow relative w-full h-full rounded-pill overflow-hidden">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 480px) 260px, 280px"
                priority
                className="object-cover rounded-pill select-none pointer-events-none"
              />
            </div>
          </m.button>

          {/* Radial Sparks Burst on Blast */}
          <AnimatePresence>
            {blasting && (
              <div aria-hidden className="pointer-events-none absolute inset-[0] flex items-center justify-center z-20">
                {BLAST_SPARKS.map((sp, idx) => (
                  <m.span
                    key={idx}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                    animate={{ x: sp.x, y: sp.y, opacity: [1, 1, 0], scale: [0.4, 1.4, 0.2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="absolute leading-none font-bold select-none drop-shadow-[0_0_8px_color-mix(in_srgb,var(--ng-bright)_90%,transparent)]"
                    style={{
                      color: c[sp.tone],
                      fontSize: `${sp.size}px`,
                    }}
                  >
                    {sp.isStar ? '✦' : '•'}
                  </m.span>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* State A: Prompt to Tap (when not yet revealed) */}
        {!revealed && (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-3 cursor-pointer"
            onClick={handleMoonClick}
          >
            <span aria-hidden className="amb-bounce text-[32px] sm:text-[36px] leading-none select-none drop-shadow-md">
              {w.pointer}
            </span>

            <h3
              className={`${displayClassName} text-[24px] sm:text-[28px] font-semibold text-[color:var(--ng-gold)] drop-shadow-[0_2px_12px_color-mix(in_srgb,var(--ng-gold)_60%,transparent)]`}
            >
              {w.prompt}
            </h3>

            <p className="text-[12px] sm:text-[13px] tracking-[0.25em] font-medium uppercase text-[color:color-mix(in_srgb,var(--ng-bright)_80%,transparent)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {w.hint}
            </p>
          </m.div>
        )}

        {/* State B: Revealed Auspicious Wedding Date Card */}
        <AnimatePresence>
          {revealed && (
            <m.div
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full relative z-10"
            >
              <div className="relative rounded-[22px] border border-[color-mix(in_srgb,var(--ng-gold)_60%,transparent)] bg-[color-mix(in_srgb,var(--ng-card)_90%,transparent)] backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-center">
                <div className="inline-flex items-center gap-2 rounded-pill px-4 py-1.5 border border-[color-mix(in_srgb,var(--ng-gold)_40%,transparent)] bg-[var(--ng-card)] text-[13px] text-[color:var(--ng-bright)] font-semibold mb-4 shadow-sm">
                  <span>✦</span>
                  <span className={displayClassName}>{w.pill}</span>
                  <span>✦</span>
                </div>

                <h4
                  className={`${displayClassName} text-[26px] sm:text-[32px] font-bold text-[color:var(--ng-ink)] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] leading-tight mb-2`}
                >
                  {weekdayDate}
                </h4>

                <p className={`${bodyClassName} text-[18px] sm:text-[20px] font-semibold text-[color:var(--ng-gold)] mb-3`}>
                  {timeText} {w.timeNote}
                </p>

                {venue && (
                  <p className={`${bodyClassName} text-[15px] sm:text-[16px] text-[color:var(--ng-muted)] max-w-xs mx-auto mb-5`}>
                    {w.venueLabel} {venue}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleMoonClick}
                  className="inline-flex items-center gap-2 text-[13px] text-[color:color-mix(in_srgb,var(--ng-bright)_80%,transparent)] hover:text-[color:var(--ng-ink)] transition-colors pt-2 border-t border-[color-mix(in_srgb,var(--ng-gold)_20%,transparent)] w-full justify-center"
                >
                  <span>✦</span>
                  <span className={bodyClassName}>{w.again}</span>
                  <span>✦</span>
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
