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
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
