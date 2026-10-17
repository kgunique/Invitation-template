'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface LiveCaptionsProps {
  /** What is said, one line at a time. */
  lines: string[];
  /** Start typing (e.g. once the call has connected). Until then nothing shows. */
  running: boolean;
  /** Ms per character, and the pause after each line. */
  charMs?: number;
  pauseMs?: number;
  /** The box is this many lines of text tall and never grows (nothing under it is pushed about): as lines wrap, the oldest text slides off its top, as a phone's captions scroll. */
  rows?: number;
  /** The small tag above, e.g. "Live captions". */
  label?: string;
  /** The words' colour, and the tag's. */
  color?: string;
  labelColor?: string;
  className?: string;
}

/**
 * Live captions, as a phone shows them under a call: what is being said is typed out letter by letter with a
 * cursor, line after line; the line before stays above it, fainter. All lines show at once under reduced motion.
 * Captions are text, so screen readers read them (the whole set, not the typing).
 */
export function LiveCaptions({
  lines,
  running,
  charMs = 42,
  pauseMs = 1100,
  rows = 3,
  label = 'Live captions',
  color = '#ffffff',
  labelColor = 'rgba(255,255,255,0.6)',
  className = '',
}: LiveCaptionsProps) {
  const still = useReducedMotion();
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!running || still || line >= lines.length) return;
    const full = lines[line].length;
    const id =
      chars < full
        ? setTimeout(() => setChars((n) => n + 1), charMs)
        : setTimeout(() => {
            if (line < lines.length - 1) {
              setLine((n) => n + 1);
              setChars(0);
            }
          }, pauseMs);
    return () => clearTimeout(id);
  }, [running, still, line, chars, lines, charMs, pauseMs]);

  const done = still || (line === lines.length - 1 && chars >= lines[line].length);
  const shown = still ? lines : running ? [...lines.slice(Math.max(0, line - 1), line), lines[line].slice(0, chars)] : [];

  return (
    <div className={className}>
      <p className="sr-only">{lines.join(' ')}</p>
      <div aria-hidden>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: labelColor }}>
          {label}
        </p>
        <div className="mt-2 flex flex-col justify-end gap-1 overflow-hidden text-[17px]" style={{ height: `${rows * 1.45}em` }}>
          {shown.map((text, i) => {
            const current = i === shown.length - 1;
            return (
              <p key={`${line}-${i}`} className="text-[17px] leading-[1.45]" style={{ color, opacity: current || still ? 1 : 0.45 }}>
                {text}
                {current && !done && <span className="amb-breathe ml-[1px] inline-block w-[2px] bg-current align-[-2px]" style={{ height: '1.05em', ['--breathe-from' as string]: 0, ['--breathe-to' as string]: 1, ['--breathe-dur' as string]: '0.5s' }} />}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
