'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react';

export type ChatItem =
  | { kind: 'chip'; text: string }
  | { kind: 'msg'; side: 'left' | 'right'; text: string; time?: string; name?: string };

export interface ChatThreadColors {
  /** The thread's window: any CSS background. */
  window: string;
  line: string;
  /** Bubbles from the other side, and from "me". */
  left: string;
  right: string;
  leftInk: string;
  rightInk: string;
  /** Date chips. */
  chip: string;
  chipInk: string;
  /** The read ticks. */
  tick: string;
  ink: string;
  soft: string;
}

export interface ChatThreadProps {
  items: ChatItem[];
  /** The chat's header: who it is with, their round picture and a status ("online"). */
  title?: string;
  avatar?: string;
  status?: string;
  /** Ms between one message and the next (a "typing…" bubble shows for most of it). */
  stepMs?: number;
  colors?: Partial<ChatThreadColors>;
  className?: string;
}

const DEFAULT_COLORS: ChatThreadColors = {
  window: 'rgba(12,6,24,0.55)',
  line: 'rgba(255,255,255,0.1)',
  left: 'rgba(255,255,255,0.14)',
  right: 'linear-gradient(135deg, #e0457b, #b8336a)',
  leftInk: '#ffffff',
  rightInk: '#ffffff',
  chip: 'rgba(255,255,255,0.12)',
  chipInk: 'rgba(255,255,255,0.75)',
  tick: '#53bdeb',
  ink: '#ffffff',
  soft: 'rgba(255,255,255,0.6)',
};

/**
 * A love story told as a chat, as a phone's messenger draws one: a header (picture, name, "online" — "typing…" while
 * a message is coming), date chips, and bubbles from either side with their time and, on "my" side, blue read ticks.
 * When the thread comes into view the messages arrive one by one, each after a "typing…" bubble on its side; under
 * reduced motion they are all there at once. Any words, any number of messages.
 */
export function ChatThread({ items, title, avatar, status = 'online', stepMs = 1500, colors, className = '' }: ChatThreadProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const still = useReducedMotion();
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!inView || still || count >= items.length) return;
    const next = items[count];
    if (next.kind === 'chip') {
      const id = setTimeout(() => setCount((n) => n + 1), 500);
      return () => clearTimeout(id);
    }
    setTyping(next.side);
    const id = setTimeout(() => {
      setTyping(null);
      setCount((n) => n + 1);
    }, stepMs);
    return () => clearTimeout(id);
  }, [inView, still, count, items, stepMs]);

  const shown = still ? items : items.slice(0, count);

  return (
    <div ref={ref} className={`overflow-hidden rounded-[26px] border backdrop-blur-md ${className}`} style={{ background: c.window, borderColor: c.line }}>
      {title && (
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: c.line }}>
          {avatar && (
            <span className="relative h-[38px] w-[38px] overflow-hidden rounded-pill">
              <Image src={avatar} alt="" fill sizes="38px" className="object-cover" />
            </span>
          )}
          <span className="flex flex-col">
            <span className="text-[16px] font-semibold" style={{ color: c.ink }}>
              {title}
            </span>
            <span className="text-[12px]" style={{ color: typing ? c.tick : c.soft }}>
              {typing ? 'typing…' : status}
            </span>
          </span>
        </div>
      )}

      <div className="flex min-h-[200px] flex-col gap-2 px-3 py-4" aria-live="polite">
        {shown.map((it, i) =>
          it.kind === 'chip' ? (
            <m.p
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto my-1 rounded-[8px] px-3 py-1 text-[12px] font-medium"
              style={{ background: c.chip, color: c.chipInk }}
            >
              {it.text}
            </m.p>
          ) : (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`max-w-[82%] rounded-[18px] px-3 pb-[6px] pt-2 ${it.side === 'right' ? 'self-end rounded-br-[6px]' : 'self-start rounded-bl-[6px]'}`}
              style={{ background: it.side === 'right' ? c.right : c.left, color: it.side === 'right' ? c.rightInk : c.leftInk, transformOrigin: it.side === 'right' ? '100% 100%' : '0 100%' }}
            >
              {it.name && <p className="text-[12px] font-semibold opacity-80">{it.name}</p>}
              <p className="text-[15px] leading-[1.45]">{it.text}</p>
              <p className="mt-[2px] flex items-center justify-end gap-1 text-[11px] opacity-75">
                {it.time}
                {it.side === 'right' && (
                  <svg aria-label="read" viewBox="0 0 18 10" className="h-[9px] w-[16px]" fill="none" stroke={c.tick} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 5.5 4 8.5 10 1.5M7 8.5 13 1.5" />
                  </svg>
                )}
              </p>
            </m.div>
          ),
        )}
        <AnimatePresence>
          {typing && (
            <m.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-1 rounded-[18px] px-4 py-3 ${typing === 'right' ? 'self-end' : 'self-start'}`}
              style={{ background: typing === 'right' ? c.right : c.left }}
              aria-hidden
            >
              {[0, 0.2, 0.4].map((d) => (
                <span key={d} className="amb-breathe block h-[7px] w-[7px] rounded-pill" style={{ background: c.leftInk, animationDelay: `${d}s`, ['--breathe-from' as string]: 0.25, ['--breathe-to' as string]: 1, ['--breathe-dur' as string]: '0.6s' }} />
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
