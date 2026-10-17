import type { ReactNode } from 'react';

export interface CallControl {
  label: string;
  icon: ReactNode;
  /** A link (a map, a calendar file, WhatsApp)… */
  href?: string;
  /** …with a `download` name, for a file. */
  download?: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** …or a tap. */
  onClick?: () => void;
  /** Lit, as a phone lights an "on" button (speaker on). */
  active?: boolean;
  /** Screen-reader words, if the label alone doesn't say what it does. */
  ariaLabel?: string;
}

export interface CallControlsProps {
  items: CallControl[];
  /** The ring's fill, its fill when lit, and the icon and label colour (when lit, the icon takes `activeInk`). */
  colors?: { button?: string; active?: string; ink?: string; activeInk?: string };
  className?: string;
}

/**
 * The grid of round buttons on a call screen (three to a row), each a real link or action: a phone's speaker, keypad
 * and so on, turned to the invitation's own (the venue's map, a calendar reminder, wishes on WhatsApp…).
 */
export function CallControls({ items, colors, className = '' }: CallControlsProps) {
  const c = { button: 'rgba(255,255,255,0.16)', active: '#ffffff', ink: '#ffffff', activeInk: '#2a1240', ...colors };
  return (
    <div className={`grid grid-cols-3 gap-x-6 gap-y-5 ${className}`}>
      {items.map((it) => {
        const ring = (
          <span
            className="grid h-[64px] w-[64px] place-items-center rounded-pill backdrop-blur-md transition-colors duration-200"
            style={{ background: it.active ? c.active : c.button, color: it.active ? c.activeInk : c.ink }}
          >
            {it.icon}
          </span>
        );
        const body = (
          <>
            {ring}
            <span className="text-[13px] font-medium" style={{ color: c.ink }}>
              {it.label}
            </span>
          </>
        );
        const cls = 'flex flex-col items-center gap-2 transition-transform active:scale-95';
        return it.href ? (
          <a
            key={it.label}
            href={it.href}
            download={it.download}
            {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={it.ariaLabel}
            className={cls}
          >
            {body}
          </a>
        ) : (
          <button key={it.label} type="button" onClick={it.onClick} aria-label={it.ariaLabel} aria-pressed={it.active} className={cls}>
            {body}
          </button>
        );
      })}
    </div>
  );
}
