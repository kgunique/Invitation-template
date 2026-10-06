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

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CalendarPlusIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
    </svg>
  );
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={p.className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ExpandIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
    </svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={p.className}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c.8-4 3.7-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={p.className}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M2.8 19.5c.6-3.4 3-5.2 6.2-5.2s5.6 1.8 6.2 5.2M16 5.6a3.2 3.2 0 010 6M18 14.6c1.8.6 3 2.2 3.4 4.6" />
    </svg>
  );
}

export function SendIcon(p: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />
    </svg>
  );
}

export function WhatsAppIcon(p: IconProps) {
  return (
    <svg {...base} fill="currentColor" className={p.className}>
      <path d="M12 2.2a9.8 9.8 0 00-8.4 14.8L2.3 21.8l4.9-1.3A9.8 9.8 0 1012 2.2zm0 1.8a8 8 0 11-4.2 14.8l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 0112 4zm-3 3.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.6 0 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.4l-.5-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.2 0-.4.1-.5l.4-.5.3-.4c.1-.2.1-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4z" />
    </svg>
  );
}

/** A musical note; with `off`, a slash through it. */
export function MusicIcon({ className, off = false }: IconProps & { off?: boolean }) {
  return (
    <svg {...base} width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="16.5" cy="16" r="2.6" />
      {off && <path d="M3 3l18 18" strokeWidth="2.2" />}
    </svg>
  );
}
