'use client';

import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { useCountdown } from './useCountdown';

export interface AlarmCountdownColors {
  card: string;
  line: string;
  ink: string;
  soft: string;
  /** The switch when on. */
  on: string;
  /** The countdown tiles. */
  tile: string;
}

export interface AlarmCountdownProps {
  weddingDate: string;
  /** The alarm's hour as a phone writes it ("7:00") and its "PM". */
  time: string;
  meridiem?: string;
  /** The alarm's label, e.g. "Wedding Day 💍". */
  label: string;
  /** The line under the label, e.g. "Saturday, 22 May 2027". */
  detail?: string;
  /** Over the tiles, e.g. "Rings in". */
  ringsIn?: string;
  /** The four tile captions. */
  units?: [string, string, string, string];
  /** What it says when someone tries to switch it off. */
  noSnooze?: string;
  colors?: Partial<AlarmCountdownColors>;
  className?: string;
}

const DEFAULT_COLORS: AlarmCountdownColors = {
  card: 'rgba(255,255,255,0.08)',
  line: 'rgba(255,255,255,0.12)',
  ink: '#ffffff',
  soft: 'rgba(255,255,255,0.6)',
  on: '#34c759',
  tile: 'rgba(255,255,255,0.1)',
};

/**
 * The countdown as a phone's alarm: the alarm's big time and its label, a switch that is on — try to turn it off and
 * it springs back on with "You can't snooze this one 😄" — and under it "Rings in" with the days, hours, minutes and
 * seconds ticking down (`useCountdown`: zeros until mounted, zero once past).
 */
export function AlarmCountdown({
  weddingDate,
  time,
  meridiem,
  label,
  detail,
  ringsIn = 'Rings in',
  units = ['days', 'hrs', 'min', 'sec'],
  noSnooze = "You can't snooze this one 😄",
  colors,
  className = '',
}: AlarmCountdownProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const left = useCountdown(weddingDate);
  const [nudge, setNudge] = useState(0);
  const [off, setOff] = useState(false);

  const flip = () => {
    setOff(true);
    setNudge((n) => n + 1);
    setTimeout(() => setOff(false), 450);
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: EASE.entrance }}
      className={`rounded-[28px] border px-5 py-5 backdrop-blur-md ${className}`}
      style={{ background: c.card, borderColor: c.line }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-light leading-none" style={{ color: c.ink }}>
            <span className="text-[60px] tracking-[-0.02em]">{time}</span>
            {meridiem && <span className="ml-1 text-[24px]">{meridiem}</span>}
          </p>
          <p className="mt-2 text-[16px] font-medium" style={{ color: c.ink }}>
            {label}
          </p>
          {detail && (
            <p className="text-[13px]" style={{ color: c.soft }}>
              {detail}
            </p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={!off}
          aria-label={`${label} alarm`}
          onClick={flip}
          className="relative h-[31px] w-[51px] shrink-0 rounded-pill transition-colors duration-200"
          style={{ background: off ? 'rgba(255,255,255,0.25)' : c.on }}
        >
          <span className="absolute top-[2px] block h-[27px] w-[27px] rounded-pill bg-[#ffffff] shadow-md transition-[left] duration-200" style={{ left: off ? 2 : 22 }} />
        </button>
      </div>

      <div className="relative h-[0]">
        <AnimatePresence>
          {nudge > 0 && off && (
            <m.p
              key={nudge}
              role="status"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 6 }}
              exit={{ opacity: 0, transition: { delay: 1.4 } }}
              className="absolute right-[0] top-[0] z-10 w-max rounded-pill bg-[#ffffff] px-3 py-[6px] text-[13px] font-medium shadow-lg"
              style={{ color: '#2a1240' }}
            >
              {noSnooze}
            </m.p>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: c.soft }}>
        {ringsIn}
      </p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {[left.days, left.hours, left.minutes, left.seconds].map((v, i) => (
          <div key={i} className="rounded-[14px] py-3 text-center" style={{ background: c.tile }}>
            <p className="text-[28px] font-semibold tabular-nums leading-none" style={{ color: c.ink }}>
              {v}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.1em]" style={{ color: c.soft }}>
              {units[i]}
            </p>
          </div>
        ))}
      </div>
    </m.div>
  );
}
