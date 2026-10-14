'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import { formatDayMonthYear, formatTimeHi, formatWeekdayDate } from './dates';
import { hindiBody, hindiDisplay } from './hindiFonts';
import { Starfield } from './Starfield';

export interface MoonDateRevealerProps {
  weddingDate?: string;
  venue?: string;
  timeZone?: string;
  lang?: string;
  className?: string;
}

// 18 deterministic radial sparks for the cosmic blast
const BLAST_SPARKS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const distance = 130 + (i % 3) * 35;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    size: 14 + (i % 3) * 4,
    isStar: i % 2 === 0,
    color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#ffe58f' : '#ffd591',
  };
});

/**
 * MoonDateRevealer — An interactive celestial date revealer section.
 * Features a continuously rotating Moon in a cosmic starfield.
 * On tap/click: triggers a vigorous shake animation, a burst of golden sparks,
 * and reveals the auspicious wedding date and muhurat details in Hindi.
 */
export function MoonDateRevealer({
  weddingDate = '2027-02-28T18:30:00+05:30',
  venue = 'अहमदाबाद, गुजरात',
  timeZone = 'Asia/Kolkata',
  lang = 'hi',
  className = '',
}: MoonDateRevealerProps) {
  const [shaking, setShaking] = useState(false);
  const [blasting, setBlasting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const weekdayDate = weddingDate ? formatWeekdayDate(weddingDate, timeZone, 'hi-IN') : 'रविवार, 28 फ़रवरी 2027';
  const timeText = weddingDate ? formatTimeHi(weddingDate, timeZone) : 'शाम 6:30 बजे';
  const fullDate = weddingDate ? formatDayMonthYear(weddingDate, timeZone, 'hi-IN') : '28 फ़रवरी 2027';

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
      className={`relative z-10 w-full min-h-[75vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-12 sm:py-16 mb-16 ${className}`}
    >
      {/* Subtle cosmic background starfield */}
      <div aria-hidden className="pointer-events-none absolute inset-[0] overflow-hidden opacity-50">
        <Starfield count={60} color="#ffd666" constellations />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[440px] flex flex-col items-center">
        {/* Moon Sphere with Blast Animation */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Radial celestial halo behind moon */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-[-30px] rounded-full transition-all duration-700 ${
              revealed
                ? 'bg-[radial-gradient(circle_at_center,_rgba(255,235,180,0.5)_0%,_rgba(240,190,80,0.22)_45%,_transparent_72%)] scale-110'
                : 'bg-[radial-gradient(circle_at_center,_rgba(255,235,180,0.32)_0%,_rgba(215,180,100,0.12)_45%,_transparent_72%)]'
            }`}
          />

          {/* Interactive Moon with Continuous Rotation & On-Click Shake */}
          <m.button
            type="button"
            onClick={handleMoonClick}
            aria-label="चंद्रमा पर क्लिक करके शुभ तिथि देखें"
            animate={
              shaking
                ? {
                    x: [-9, 9, -7, 7, -5, 5, -2, 2, 0],
                    y: [-4, 4, -3, 3, 0],
                    rotate: [-6, 6, -5, 5, -2, 2, 0],
                    scale: [1, 1.12, 0.94, 1.06, 1],
                    filter: [
                      'drop-shadow(0 0 25px rgba(255,235,180,0.5))',
                      'drop-shadow(0 0 55px rgba(255,215,100,0.95))',
                      'drop-shadow(0 0 30px rgba(255,235,180,0.6))',
                    ],
                  }
                : {
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    filter: revealed
                      ? 'drop-shadow(0 0 35px rgba(255,215,100,0.65))'
                      : 'drop-shadow(0 0 20px rgba(255,235,180,0.4))',
                  }
            }
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="relative w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] rounded-full cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            {/* The rotating Moon image */}
            <div className="amb-turn-slow relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/art/ganga/moon.webp"
                alt="Sacred Moon"
                fill
                sizes="(max-width: 480px) 260px, 280px"
                priority
                className="object-cover rounded-full select-none pointer-events-none"
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
                    className="absolute leading-none font-bold select-none drop-shadow-[0_0_8px_rgba(255,215,100,0.9)]"
                    style={{
                      color: sp.color,
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
            {/* Bobbing Pointing Hand Emoji */}
            <span aria-hidden className="amb-bounce text-[32px] sm:text-[36px] leading-none select-none drop-shadow-md">
              👆
            </span>

            {/* Heading: चंद्रमा पर स्पर्श करें */}
            <h3
              className={`${hindiDisplay.className} text-[24px] sm:text-[28px] font-semibold text-[#e6be60] drop-shadow-[0_2px_12px_rgba(230,190,96,0.6)]`}
            >
              चंद्रमा पर स्पर्श करें
            </h3>

            {/* Subtitle: CLICK TO BLAST & REVEAL */}
            <p className="text-[12px] sm:text-[13px] tracking-[0.25em] font-medium uppercase text-[#ffd875]/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              CLICK TO BLAST &amp; REVEAL
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
              <div className="relative rounded-[22px] border border-[#e6be60]/60 bg-[#061229]/90 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-center">
                {/* Top Auspicious Pill */}
                <div className="inline-flex items-center gap-2 rounded-pill px-4 py-1.5 border border-[#e6be60]/40 bg-[#071736] text-[13px] text-[#ffd875] font-semibold mb-4 shadow-sm">
                  <span>✦</span>
                  <span className={hindiDisplay.className}>शुभ विवाह मुहूर्त</span>
                  <span>✦</span>
                </div>

                {/* Auspicious Full Date in Hindi */}
                <h4
                  className={`${hindiDisplay.className} text-[26px] sm:text-[32px] font-bold text-[#fff9eb] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] leading-tight mb-2`}
                >
                  {weekdayDate}
                </h4>

                {/* Auspicious Time & Muhurat */}
                <p className={`${hindiBody.className} text-[18px] sm:text-[20px] font-semibold text-[#e6be60] mb-3`}>
                  {timeText} (शुभ लग्न एवं फेरे)
                </p>

                {/* Venue */}
                {venue && (
                  <p className={`${hindiBody.className} text-[15px] sm:text-[16px] text-[#d4c3a3] max-w-xs mx-auto mb-5`}>
                    स्थान: {venue}
                  </p>
                )}

                {/* Re-blast Button / Instruction */}
                <button
                  type="button"
                  onClick={handleMoonClick}
                  className="inline-flex items-center gap-2 text-[13px] text-[#ffd875]/80 hover:text-[#fff] transition-colors pt-2 border-t border-[#e6be60]/20 w-full justify-center"
                >
                  <span>✦</span>
                  <span className={hindiBody.className}>पुनः ब्लास्ट करने के लिए चाँद पर स्पर्श करें</span>
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
