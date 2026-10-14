'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { hindiBody, hindiDisplay } from './hindiFonts';
import { Starfield } from './Starfield';
import { useOpenSequence } from './useOpenSequence';

export interface DivineGateColors {
  /** Gold accent: borders, diamonds, glow highlights. */
  accent: string;
  /** Primary mantra and shloka text color. */
  ink: string;
  /** Radiant golden aura behind the divine figure. */
  glow: string;
  /** Button dark background color. */
  buttonBg: string;
  /** Button gold frame color. */
  buttonBorder: string;
  /** Golden wash that illuminates the screen upon unlock. */
  flash: string;
}

export interface DivineGateProps {
  /** Divine figure cut-out image path. Defaults to Lord Ganesha cut-out. */
  image?: string;
  /** Alternative text for screen readers. */
  imageAlt?: string;
  /** Background night sky image. Defaults to starry sky. */
  skyImage?: string;
  /** Sacred title / mantra text. Defaults to '|| श्री गणेशाय नमः ||'. */
  mantra?: string;
  /** Sacred shloka lines in Hindi/Devanagari. */
  shloka?: string[];
  /** Enter button text. */
  buttonLabel?: string;
  /** Language tag for proper typography shaping. Defaults to 'hi' (Hindi). */
  lang?: string;
  /** Visual theme colors. */
  colors?: Partial<DivineGateColors>;
  /** Optional ornament or diamond symbol inside button. */
  ornament?: string;
  /** Optional top/header chrome element (e.g. BackLink). */
  topChrome?: ReactNode;

  /** Ms from button tap until page underneath starts entrance (onOpen). */
  openMs?: number;
  /** Ms cover then takes to fade away completely. */
  fadeMs?: number;

  /** Triggered immediately upon user gesture (e.g. to start audio context). */
  onTap?: () => void;
  /** Triggered when the invitation page underneath should begin revealing. */
  onOpen?: () => void;
  /** Triggered once the gate has completely faded out. */
  onOpened?: () => void;
}

const DEFAULT_COLORS: DivineGateColors = {
  accent: '#e6be60',
  ink: '#fff8ea',
  glow: 'rgba(235, 185, 75, 0.72)',
  buttonBg: 'rgba(8, 16, 32, 0.94)',
  buttonBorder: '#d4af37',
  flash: '#fff4d0',
};

const DEFAULT_SHLOKA = [
  'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।',
  'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
];

/** Dedicated twinkling star points positioned around Ganesha's celestial aura. */
const AURA_STARS = [
  { x: -38, y: -32, size: 3.5, dur: 2.2, delay: -0.4, color: '#ffe699' },
  { x: 40, y: -30, size: 3, dur: 3.1, delay: -1.2, color: '#ffffff' },
  { x: -48, y: 10, size: 2.5, dur: 2.8, delay: -0.8, color: '#ffd666' },
  { x: 46, y: 14, size: 3.2, dur: 3.5, delay: -1.9, color: '#fff1b8' },
  { x: -30, y: -50, size: 2, dur: 2.5, delay: -0.3, color: '#ffe58f' },
  { x: 28, y: -52, size: 4, dur: 3.8, delay: -2.1, color: '#ffd591', isSparkle: true },
  { x: -44, y: 38, size: 2.5, dur: 2.9, delay: -1.5, color: '#fffbe6' },
  { x: 40, y: 40, size: 3, dur: 3.2, delay: -0.7, color: '#ffd666' },
  { x: -20, y: -62, size: 3, dur: 2.4, delay: -1.8, color: '#ffffff', isSparkle: true },
  { x: 18, y: -64, size: 2.5, dur: 3.3, delay: -0.9, color: '#ffe58f' },
  { x: -54, y: -12, size: 3.2, dur: 2.7, delay: -1.4, color: '#ffec3d' },
  { x: 55, y: -7, size: 2.8, dur: 3.6, delay: -2.3, color: '#fffb8f' },
  { x: -28, y: 54, size: 2, dur: 2.6, delay: -0.5, color: '#ffd666' },
  { x: 26, y: 56, size: 3.5, dur: 3.0, delay: -1.1, color: '#fff2a8' },
  { x: 0, y: -70, size: 5, dur: 3.2, delay: -1.6, color: '#ffffff', isSparkle: true },
  { x: -56, y: 26, size: 2.2, dur: 2.9, delay: -0.8, color: '#ffd591' },
  { x: 54, y: 30, size: 2.5, dur: 3.4, delay: -1.3, color: '#fffbe6' },
  { x: -14, y: 64, size: 2.8, dur: 2.5, delay: -1.7, color: '#ffe699' },
  { x: 12, y: 66, size: 3, dur: 3.1, delay: -0.6, color: '#ffd666' },
  { x: -2, y: 68, size: 4, dur: 3.5, delay: -2.0, color: '#ffe082', isSparkle: true },
  { x: -58, y: -28, size: 3, dur: 2.6, delay: -1.1, color: '#fff3b0' },
  { x: 58, y: -25, size: 3.2, dur: 3.3, delay: -0.5, color: '#ffd666' },
];

/**
 * DivineGate — A spiritual opening screen featuring an ambient zooming starry sky,
 * multiple twinkling stars around Lord Ganesha, an enlarged deity with breathing golden aura,
 * enlarged sacred Hindi shloka typography, and a prominent double-bordered "ENTER INVITATION" button.
 */
export function DivineGate({
  image = '/art/platinum/ganesha-cutout.webp',
  imageAlt = 'Lord Ganesha with divine blessings',
  skyImage = '/art/ganga/stars.webp',
  mantra = '|| श्री गणेशाय नमः ||',
  shloka = DEFAULT_SHLOKA,
  buttonLabel = 'ENTER INVITATION',
  lang = 'hi',
  colors,
  ornament = '◈',
  topChrome,
  openMs = 1400,
  fadeMs = 800,
  onTap,
  onOpen,
  onOpened,
}: DivineGateProps) {
  const c: DivineGateColors = { ...DEFAULT_COLORS, ...colors };
  const { stage, opening, fading, open } = useOpenSequence({
    openMs,
    fadeMs,
    onTap,
    onOpen,
    onOpened,
  });

  if (stage === 'revealed') return null;

  return (
    <m.div
      lang={lang}
      aria-label="Welcome screen"
      className="fixed inset-[0] z-gate overflow-hidden select-none"
      style={
        {
          backgroundColor: '#020612',
          pointerEvents: stage === 'closed' ? 'auto' : 'none',
          '--glow': c.glow,
          '--accent': c.accent,
        } as CSSProperties
      }
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fadeMs / 1000, ease: 'easeInOut' }}
    >
      {/* 1. Ambient continuous zooming night starry sky across the entire screen */}
      <div className="absolute inset-[-10%] pointer-events-none overflow-hidden" style={{ top: '-10%', left: '-10%', right: '-10%', bottom: '-10%' }}>
        <div className="relative w-full h-full amb-zoom-in">
          <Image
            src={skyImage}
            alt="Starry cosmic sky"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Twinkling starfield spreading across the entire sky */}
      <div className="absolute inset-[0] pointer-events-none opacity-75">
        <Starfield count={65} color="#fedb88" constellations={false} />
      </div>

      {/* Deep celestial radial vignette: keeps center luminous while outer edges blend seamlessly into cosmos */}
      <div
        className="absolute inset-[0] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(2, 6, 18, 0.1) 0%, rgba(2, 6, 18, 0.6) 60%, #020614 100%)',
        }}
      />

      {/* Flash wash on unlock */}
      <m.div
        className="absolute inset-[0] pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0.75 : 0 }}
        transition={{ duration: 0.8, ease: EASE.standard }}
        style={{
          background: `radial-gradient(circle at 50% 45%, ${c.flash} 0%, rgba(235, 185, 75, 0.4) 45%, transparent 75%)`,
        }}
      />

      {/* 2. Centered phone-width container */}
      <div className="absolute inset-[0] flex justify-center pointer-events-none">
        <div className="relative h-full w-full max-w-[480px] flex flex-col justify-between px-5 sm:px-6 py-6 sm:py-8 pointer-events-auto">
          {/* Top chrome slot (Back button) */}
          <div className="w-full flex justify-start pt-safe">
            {topChrome}
          </div>

          {/* Central Divine Figure & Sacred Shloka */}
          <m.div
            className="flex flex-col items-center justify-center text-center my-auto px-1"
            animate={{
              scale: opening ? 1.08 : 1,
              opacity: opening ? 0.2 : 1,
              y: opening ? -16 : 0,
            }}
            transition={{ duration: 1.1, ease: EASE.standard }}
          >
            {/* Enlarged Divine Figure with responsive vh scaling so the Enter button is always visible */}
            <div className="relative flex items-center justify-center w-[min(290px,36vh)] sm:w-[min(330px,38vh)] aspect-square mb-3 sm:mb-5">
              {/* Twinkling star clusters around Ganesha's aura */}
              <div aria-hidden className="absolute inset-[0] pointer-events-none">
                {AURA_STARS.map((s, idx) => (
                  <span
                    key={idx}
                    className="amb-twinkle absolute flex items-center justify-center"
                    style={
                      {
                        left: `calc(50% + ${s.x}%)`,
                        top: `calc(50% + ${s.y}%)`,
                        color: s.color,
                        width: s.size * 2,
                        height: s.size * 2,
                        '--tw-base': 0.85,
                        '--tw-dur': `${s.dur}s`,
                        '--tw-delay': `${s.delay}s`,
                      } as CSSProperties
                    }
                  >
                    {s.isSparkle ? (
                      <span className="text-[10px] sm:text-[12px] leading-none drop-shadow-[0_0_6px_rgba(255,230,120,0.8)]">✦</span>
                    ) : (
                      <span
                        className="rounded-pill block shadow-[0_0_8px_rgba(255,220,100,0.9)]"
                        style={{
                          width: `${s.size}px`,
                          height: `${s.size}px`,
                          backgroundColor: s.color,
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>

              {/* Radiant breathing golden aura behind the deity */}
              <div
                className="absolute w-[92%] h-[92%] rounded-pill pointer-events-none amb-divine-aura"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${c.glow} 0%, rgba(212, 148, 38, 0.48) 42%, rgba(180, 105, 20, 0.14) 68%, transparent 88%)`,
                }}
              />

              {/* Secondary subtle halo pulse */}
              <div
                className="absolute w-[82%] h-[82%] rounded-pill border border-[#f0c868]/35 pointer-events-none amb-halo"
              />

              {/* Deity image with smooth divine bob/float */}
              <div className="relative w-full h-full amb-divine-float">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 480px) 290px, 340px"
                  className="object-contain drop-shadow-[0_0_28px_rgba(235,185,75,0.5)]"
                />
              </div>
            </div>

            {/* Enlarged Sacred Mantra Title in Hindi Display font */}
            <div className="space-y-2 sm:space-y-3 max-w-md">
              <h1
                className={`${hindiDisplay.className} text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal leading-tight`}
                style={{
                  color: c.accent,
                  textShadow: '0 0 20px rgba(240, 200, 100, 0.7), 0 2px 6px rgba(0,0,0,0.9)',
                }}
              >
                {mantra}
              </h1>

              {/* Enlarged Sacred Shloka Verses in Hindi Body font */}
              <div
                className={`${hindiBody.className} text-sm sm:text-base md:text-lg font-medium leading-relaxed space-y-0.5 sm:space-y-1 opacity-95`}
                style={{
                  color: c.ink,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.95), 0 0 12px rgba(235, 200, 130, 0.35)',
                }}
              >
                {shloka.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          </m.div>

          {/* Bottom Enter Invitation Button with Increased Height and Regal Styling */}
          <div className="flex flex-col items-center w-full pb-safe pt-4">
            <m.button
              type="button"
              onClick={open}
              animate={{
                scale: opening ? 0.96 : 1,
                opacity: opening ? 0 : 1,
              }}
              transition={{ duration: 0.4 }}
              disabled={opening}
              aria-label={buttonLabel}
              className="group relative w-full max-w-[360px] min-h-[58px] sm:min-h-[64px] cursor-pointer py-4 sm:py-5 px-8 rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6be60]"
              style={{
                backgroundColor: c.buttonBg,
                boxShadow: '0 10px 35px rgba(0, 0, 0, 0.75), 0 0 24px rgba(212, 175, 55, 0.28)',
              }}
            >
              {/* Outer gold border */}
              <span
                className="absolute inset-[0] rounded-sm pointer-events-none transition-colors duration-300"
                style={{ border: `1.5px solid ${c.buttonBorder}` }}
              />

              {/* Inner fine hairline border with 4px inset */}
              <span
                className="absolute inset-[4px] rounded-xs pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ border: `1px solid ${c.buttonBorder}` }}
              />

              {/* Ambient golden sheen on hover */}
              <span className="absolute inset-[0] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent pointer-events-none" />

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base font-semibold tracking-[0.24em] uppercase">
                <span style={{ color: c.accent }} className="text-sm sm:text-base transition-transform duration-300 group-hover:scale-125">
                  {ornament}
                </span>
                <span
                  style={{
                    color: c.accent,
                    textShadow: '0 0 12px rgba(230, 190, 80, 0.55)',
                  }}
                >
                  {buttonLabel}
                </span>
                <span style={{ color: c.accent }} className="text-sm sm:text-base transition-transform duration-300 group-hover:scale-125">
                  {ornament}
                </span>
              </span>
            </m.button>
          </div>
        </div>
      </div>
    </m.div>
  );
}
