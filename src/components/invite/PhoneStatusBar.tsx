export interface PhoneStatusBarProps {
  /** The clock (any text: the wedding's own hour, say). Never the real time: server and browser must draw the same. */
  time: string;
  /** Battery charge, 0..100. */
  battery?: number;
  /** The carrier's name beside the bars, e.g. "Shaadi 5G". */
  carrier?: string;
  /** During a call a phone wraps the clock in a green pill: its colour (omit for none). */
  callPill?: string;
  /** The colour of everything in it. */
  color?: string;
  className?: string;
}

/**
 * A phone's status bar: the clock on the left; the carrier, signal bars, Wi-Fi and the battery on the right. Pure
 * SVG and text, in one colour. For a page that pretends to be a phone screen.
 */
export function PhoneStatusBar({ time, battery = 100, carrier, callPill, color = '#ffffff', className = '' }: PhoneStatusBarProps) {
  const fill = Math.max(0, Math.min(100, battery));
  return (
    <div aria-hidden className={`flex items-center justify-between px-6 pt-3 text-[14px] font-semibold ${className}`} style={{ color }}>
      <span className={`tabular-nums tracking-[0.02em] ${callPill ? 'rounded-pill px-[10px] py-[2px]' : ''}`} style={callPill ? { background: callPill, color: '#ffffff' } : undefined}>
        {time}
      </span>
      <span className="flex items-center gap-[6px]">
        {carrier && <span className="text-[12px] font-medium opacity-90">{carrier}</span>}
        {/* signal */}
        <svg viewBox="0 0 18 12" className="h-[11px] w-[17px]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wi-fi */}
        <svg viewBox="0 0 16 12" className="h-[11px] w-[15px]" fill="currentColor">
          <path d="M8 12 5.6 9.4a3.4 3.4 0 0 1 4.8 0z" />
          <path d="M3.4 7.2a6.5 6.5 0 0 1 9.2 0l-1.4 1.5a4.5 4.5 0 0 0-6.4 0z" />
          <path d="M1.1 4.9a9.8 9.8 0 0 1 13.8 0L13.5 6.4a7.8 7.8 0 0 0-11 0z" />
        </svg>
        {/* battery */}
        <svg viewBox="0 0 27 13" className="h-[12px] w-[25px]">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.45" />
          <rect x="2" y="2" width={(19 * fill) / 100} height="9" rx="2" fill="currentColor" />
          <path d="M24 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}
