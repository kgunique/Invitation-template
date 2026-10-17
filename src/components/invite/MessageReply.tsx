'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import type { InviteRsvp } from '@/content/invites';
import { formatDay } from './dates';

export interface QuickReply {
  /** The chip's words, e.g. "Count me in! 🎉". */
  label: string;
  /** The message it writes. */
  text: string;
  /** Is it a yes (the couple's answer differs). */
  yes?: boolean;
}

export interface MessageReplyColors {
  window: string;
  line: string;
  left: string;
  right: string;
  ink: string;
  soft: string;
  /** The chips and the input. */
  chip: string;
  /** The send button. */
  send: string;
  tick: string;
}

export interface MessageReplyProps {
  rsvp: InviteRsvp;
  /** Who the chat is with, and their picture. */
  title: string;
  avatar?: string;
  /** Their messages, asking (the reply-by date is added under them). */
  ask: string[];
  replies: QuickReply[];
  /** The couple's answer once the guest has sent a yes, and otherwise. */
  thanksYes: string;
  thanksNo: string;
  /** Words: the name box, the message box, the reply-by line, the note under a sent message. */
  labels?: { name: string; message: string; replyBy: string; sent: string };
  timeZone?: string;
  colors?: Partial<MessageReplyColors>;
  className?: string;
}

const DEFAULT_COLORS: MessageReplyColors = {
  window: 'rgba(12,6,24,0.55)',
  line: 'rgba(255,255,255,0.1)',
  left: 'rgba(255,255,255,0.14)',
  right: 'linear-gradient(135deg, #e0457b, #b8336a)',
  ink: '#ffffff',
  soft: 'rgba(255,255,255,0.6)',
  chip: 'rgba(255,255,255,0.12)',
  send: '#34c759',
  tick: '#53bdeb',
};

/**
 * The RSVP as a reply in a phone's messenger: the couple's messages asking (and by when), quick-reply chips that
 * write the guest's answer, a name box and a message box (both editable), and a send arrow. Send opens WhatsApp to
 * the hosts with the reply written out (no backend); the sent message then shows in the thread with its ticks, and
 * the couple answer it.
 */
export function MessageReply({
  rsvp,
  title,
  avatar,
  ask,
  replies,
  thanksYes,
  thanksNo,
  labels = { name: 'Your name', message: 'Type a message', replyBy: 'Please reply by', sent: 'Opened in WhatsApp — tap send there' },
  timeZone = 'Asia/Kolkata',
  colors,
  className = '',
}: MessageReplyProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [yes, setYes] = useState(true);
  const [sent, setSent] = useState<{ text: string; yes: boolean } | null>(null);
  const [missing, setMissing] = useState(false);

  const send = () => {
    if (!name.trim() || !text.trim()) {
      setMissing(true);
      return;
    }
    const body = `${text.trim()}\n— ${name.trim()}`;
    window.open(`https://wa.me/${rsvp.whatsapp}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
    setSent({ text: body, yes });
  };

  const bubble = (side: 'left' | 'right') =>
    `max-w-[82%] rounded-[18px] px-3 py-2 text-[15px] leading-[1.45] ${side === 'right' ? 'self-end rounded-br-[6px]' : 'self-start rounded-bl-[6px]'}`;

  return (
    <div className={`overflow-hidden rounded-[26px] border backdrop-blur-md ${className}`} style={{ background: c.window, borderColor: c.line }}>
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
          <span className="text-[12px]" style={{ color: c.soft }}>
            online
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3 py-4" aria-live="polite">
        {ask.map((a, i) => (
          <m.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.5 }}
            className={bubble('left')}
            style={{ background: c.left, color: c.ink }}
          >
            {a}
          </m.p>
        ))}
        {rsvp.replyBy && (
          <p className={bubble('left')} style={{ background: c.left, color: c.ink }}>
            {labels.replyBy} {formatDay(rsvp.replyBy, timeZone)} 🙏
          </p>
        )}
        <AnimatePresence>
          {sent && (
            <>
              <m.div key="mine" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={bubble('right')} style={{ background: c.right, color: '#ffffff' }}>
                <p className="whitespace-pre-line">{sent.text}</p>
                <p className="mt-[2px] flex items-center justify-end gap-1 text-[11px] opacity-80">
                  {labels.sent}
                  <svg aria-hidden viewBox="0 0 18 10" className="h-[9px] w-[16px]" fill="none" stroke={c.tick} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 5.5 4 8.5 10 1.5M7 8.5 13 1.5" />
                  </svg>
                </p>
              </m.div>
              <m.p key="theirs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className={bubble('left')} style={{ background: c.left, color: c.ink }}>
                {sent.yes ? thanksYes : thanksNo}
              </m.p>
            </>
          )}
        </AnimatePresence>
      </div>

      {!sent && (
        <div className="border-t px-3 pb-4 pt-3" style={{ borderColor: c.line }}>
          <div className="flex flex-wrap gap-2">
            {replies.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => {
                  setText(r.text);
                  setYes(!!r.yes);
                  setMissing(false);
                }}
                className="rounded-pill border px-3 py-[6px] text-[14px] font-medium transition-colors"
                style={{ background: text === r.text ? '#ffffff' : c.chip, color: text === r.text ? '#2a1240' : c.ink, borderColor: c.line }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="sr-only">{labels.name}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.name}
              autoComplete="name"
              className="w-full rounded-pill border px-4 py-[10px] text-[15px] outline-none"
              style={{ background: c.chip, color: c.ink, borderColor: missing && !name.trim() ? '#ff6b6b' : c.line }}
            />
          </label>
          <div className="mt-2 flex items-end gap-2">
            <label className="flex-1">
              <span className="sr-only">{labels.message}</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={labels.message}
                rows={2}
                className="w-full resize-none rounded-[20px] border px-4 py-[10px] text-[15px] leading-[1.4] outline-none"
                style={{ background: c.chip, color: c.ink, borderColor: missing && !text.trim() ? '#ff6b6b' : c.line }}
              />
            </label>
            <button type="button" onClick={send} aria-label="Send your reply on WhatsApp" className="mb-[4px] grid h-[44px] w-[44px] shrink-0 place-items-center rounded-pill" style={{ background: c.send }}>
              <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="#ffffff">
                <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
