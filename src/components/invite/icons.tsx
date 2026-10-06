/**
 * Invite-layer icons, kept separate from src/components/site/icons.tsx on
 * purpose — see CLAUDE.md on not sharing across the (site)/(invite) split.
 * A couple of these are visually identical to a site icon; duplicating a
 * few lines of SVG is cheaper than a cross-layer import.
 */
type IconProps = { className?: string };

const base = { width: 16, height: 16, viewBox: '0 0 24 24', 'aria-hidden': true } as const;

export function BackIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" className={p.className}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function EnvelopeIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  );
}

export function ChatIcon(p: IconProps) {
  return (
    <svg {...base} fill="currentColor" className={p.className}>
      <path d="M4 4h16v12H8l-4 4V4z" />
    </svg>
  );
}

export function KeyIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className}>
      <circle cx="8" cy="8" r="4.5" />
      <path d="M11.2 11.2L21 21M16.5 15.5l2.5 2.5M19.5 12.5l2.5 2.5" />
    </svg>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" className={p.className}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function ArrowUpRightIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" className={p.className}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function HeartIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6" className={p.className}>
      <path d="M12 20.5s-8-5-8-10.7A4.6 4.6 0 0112 7a4.6 4.6 0 018 2.8c0 5.7-8 10.7-8 10.7z" />
    </svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className={p.className}>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
    </svg>
  );
}

export function GiftIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className={p.className}>
      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function NavigationIcon(p: IconProps) {
  return (
    <svg {...base} fill="currentColor" className={p.className}>
      <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z" />
    </svg>
  );
}

export function PauseIcon(p: IconProps) {
  return (
    <svg {...base} fill="currentColor" className={p.className}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
