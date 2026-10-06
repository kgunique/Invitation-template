'use client';

export interface ScrollHintProps {
  /** The accessible name of the button. */
  label?: string;
  /** How far one tap scrolls, as a share of the screen's height. */
  by?: number;
  className?: string;
}

/**
 * The "scroll down" mouse: an outlined mouse whose wheel notch runs down and
 * fades (.amb-wheel in motion.css), with a chevron bobbing under it
 * (.amb-bounce). It is a button too — a tap scrolls a screen down, smoothly
 * unless the visitor asked for reduced motion. Its colour is `currentColor`, so
 * set a text colour on `className`; a faint shadow keeps it readable on a photo.
 */
export function ScrollHint({ label = 'Scroll down', by = 0.9, className = '' }: ScrollHintProps) {
  function scroll() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollBy({ top: window.innerHeight * by, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={scroll}
      aria-label={label}
      className={`flex flex-col items-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] ${className}`}
    >
      <span className="relative block h-[40px] w-[26px] rounded-pill border-2 border-current">
        <span className="amb-wheel absolute left-1/2 top-[7px] -ml-[1.5px] block h-[8px] w-[3px] rounded-pill bg-current" />
      </span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="amb-bounce mt-1 h-[16px] w-[16px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
