'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { fadeUp, lineGroup } from './RevealLines';
import { CallControls, type CallControl } from './CallControls';

export interface CallEndedProps {
  /** The round picture (greyed a little, as an ended call's is). */
  avatar?: string;
  name: ReactNode;
  /** "Call Ended". */
  title?: string;
  /** The call's length (a running `CallTimer`, say). */
  duration?: ReactNode;
  /** The note, under it. */
  message?: string;
  /** Buttons, as a phone offers after a call (call back, message…): each real. */
  actions?: CallControl[];
  /** Anything after (the brand credit); motion children join the reveal. */
  children?: ReactNode;
  colors?: { ink?: string; soft?: string; ring?: string };
  className?: string;
}

const group = lineGroup(0.15);

/**
 * The end of a call, as a phone shows it — and the end of the invitation: the round picture, "Call Ended" with the
 * call's length under it, the names, a note of thanks, and the buttons a phone offers then (call back, message,
 * save the contact), each a real action. It all rises line by line as it is scrolled to.
 */
export function CallEnded({ avatar, name, title = 'Call Ended', duration, message, actions = [], children, colors, className = '' }: CallEndedProps) {
  const c = { ink: '#ffffff', soft: 'rgba(255,255,255,0.65)', ring: '#ffd6e0', ...colors };
  return (
    <m.div variants={group} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }} className={`flex flex-col items-center text-center ${className}`}>
      {avatar && (
        <m.span variants={fadeUp} className="relative block h-[96px] w-[96px] overflow-hidden rounded-pill border-2 grayscale-[35%]" style={{ borderColor: c.ring }}>
          <Image src={avatar} alt="" fill sizes="96px" className="object-cover" />
        </m.span>
      )}
      <m.p variants={fadeUp} className="mt-4 text-[13px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#ff6b6b' }}>
        {title}
      </m.p>
      {duration && (
        <m.p variants={fadeUp} className="mt-1 text-[16px]" style={{ color: c.soft }}>
          {duration}
        </m.p>
      )}
      <m.h2 variants={fadeUp} className="mt-3 text-[32px] font-semibold leading-[1.2]" style={{ color: c.ink }}>
        {name}
      </m.h2>
      {message && (
        <m.p variants={fadeUp} className="mt-3 max-w-[320px] text-[16px] leading-[1.55]" style={{ color: c.soft }}>
          {message}
        </m.p>
      )}
      {actions.length > 0 && (
        <m.div variants={fadeUp} className="mt-8 w-full">
          <CallControls items={actions} />
        </m.div>
      )}
      {children}
    </m.div>
  );
}
