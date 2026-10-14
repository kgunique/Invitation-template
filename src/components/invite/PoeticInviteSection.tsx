'use client';

import type { CSSProperties } from 'react';
import { m } from 'motion/react';
import { Lotus } from './FloatingFlora';
import { hindiBody, hindiDisplay } from './hindiFonts';

export interface PoeticInviteSectionProps {
  quote?: string;
  title?: string;
  verses?: string[];
  signOff?: string;
  lang?: string;
  className?: string;
}

const DEFAULT_QUOTE = 'प्रेम एक अद्भुत अहसास है, जो दो आत्माओं को एक करता है और जीवन को सुंदर बनाता है।';
const DEFAULT_TITLE = '|| स्नेह निमंत्रण ||';
const DEFAULT_VERSES = [
  'चाँदनी रात है और तारों की बारात है,',
  'आज हमारे आँगन में मंगल उत्सव और मधुर गान है।',
  'स्नेह के पावन बंधन में बंधा यह पवित्र मिलन,',
  'आशीर्वाद देने अवश्य पधारें, यही हमारा मान और सम्मान है।',
];
const DEFAULT_SIGNOFF = '- हार्दिक निमंत्रण';

/**
 * PoeticInviteSection — Auspicious poetic wedding invitation verse ("स्नेह निमंत्रण" / Tahuko).
 * Features a top philosophical quote on love, a double-golden-bordered card with floral rosettes,
 * a faint sacred lotus watermark, and traditional poetic invitation stanzas in Hindi.
 */
export function PoeticInviteSection({
  quote = DEFAULT_QUOTE,
  title = DEFAULT_TITLE,
  verses = DEFAULT_VERSES,
  signOff = DEFAULT_SIGNOFF,
  lang = 'hi',
  className = '',
}: PoeticInviteSectionProps) {
  return (
    <section lang={lang} className={`relative z-10 w-full mb-16 text-center ${className}`}>
      {/* 1. Top Quote in Golden Serif */}
      {quote && (
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8 px-4"
        >
          <p
            className={`${hindiDisplay.className} text-[18px] sm:text-[22px] font-medium leading-[1.65] text-[#e6be60] drop-shadow-[0_2px_12px_rgba(230,190,96,0.4)] max-w-md mx-auto`}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </m.div>
      )}

      {/* 2. Double-Bordered Poetic Invitation Card */}
      <m.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-[440px]"
      >
        {/* Outer Golden Border & Translucent Dark Glass */}
        <div className="relative rounded-[24px] border border-[#e6be60]/60 bg-[#061229]/85 p-2 sm:p-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-md">
          {/* Top Border Floral Emblem */}
          <div
            aria-hidden
            className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-pill border border-[#e6be60]/80 bg-[#061229] text-[13px] text-[#e6be60] shadow-[0_0_10px_rgba(230,190,96,0.6)]"
          >
            ✿
          </div>

          {/* Inner Golden Concentric Border */}
          <div className="relative rounded-[17px] border border-[#e6be60]/40 px-5 sm:px-8 py-9 sm:py-11 overflow-hidden">
            {/* Sacred Lotus Background Watermark */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[24px] -bottom-[24px] w-[180px] h-[180px] opacity-[0.14] select-none"
            >
              <Lotus className="w-full h-full" outer={['#fbd38d', '#e6be60']} inner={['#fff8e7', '#f6ad55']} />
            </div>

            {/* Header: || स्नेह निमंत्रण || */}
            <h3
              className={`${hindiDisplay.className} text-[26px] sm:text-[30px] font-bold tracking-normal text-[#e6be60] drop-shadow-[0_2px_10px_rgba(230,190,96,0.55)] mb-6`}
            >
              {title}
            </h3>

            {/* Poem Verses */}
            <div className="space-y-2 relative z-10">
              {verses.map((line, idx) => (
                <p
                  key={idx}
                  className={`${hindiBody.className} text-[16px] sm:text-[18px] font-medium leading-[1.9] text-[#fff9eb] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]`}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Sign-off */}
            {signOff && (
              <div className="mt-7 text-right pr-2 sm:pr-4 relative z-10">
                <p
                  className={`${hindiBody.className} text-[16px] sm:text-[18px] font-semibold text-[#e6be60] tracking-normal drop-shadow-[0_0_8px_rgba(230,190,96,0.6)]`}
                >
                  {signOff}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Border Floral Emblem */}
          <div
            aria-hidden
            className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-pill border border-[#e6be60]/80 bg-[#061229] text-[13px] text-[#e6be60] shadow-[0_0_10px_rgba(230,190,96,0.6)]"
          >
            ✿
          </div>
        </div>
      </m.div>
    </section>
  );
}
