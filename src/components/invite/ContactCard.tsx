'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';

export interface ContactAction {
  label: string;
  icon: ReactNode;
  href: string;
  /** A file to save (a .vcf). */
  download?: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface ContactCardColors {
  /** The card: any CSS background. */
  card: string;
  line: string;
  ink: string;
  soft: string;
  /** The action buttons' icon colour, and their fill. */
  accent: string;
  button: string;
  /** What the round picture sits on. */
  disc: string;
}

export interface ContactCardProps {
  /** The picture: a portrait (cropped to a circle) — omit and the initials are drawn. */
  image?: string;
  name: string;
  /** The small line under the name, e.g. "The Groom". */
  role?: string;
  /** A tag beside the role, e.g. "❤️ Favourite". */
  badge?: string;
  /** Buttons under the name, as a phone's contact shows message / call / save — each a real link. */
  actions?: ContactAction[];
  /** The rows of the card, as a phone's contact lists phone, email…: here parents, home town. */
  rows?: { label: string; value: string }[];
  /** The side it slides in from as it is scrolled to. */
  from?: 'left' | 'right';
  colors?: Partial<ContactCardColors>;
  className?: string;
}

const DEFAULT_COLORS: ContactCardColors = {
  card: 'rgba(255,255,255,0.08)',
  line: 'rgba(255,255,255,0.12)',
  ink: '#ffffff',
  soft: 'rgba(255,255,255,0.62)',
  accent: '#ffd6e0',
  button: 'rgba(255,255,255,0.12)',
  disc: 'linear-gradient(160deg, #ffe3c2, #f7b4c4)',
};

/**
 * One person as a phone's contact page: a round picture, the name, a small role line and a badge, a row of round
 * action buttons (each a real link: a message, a saved contact), and the card's rows (label over value, divided
 * by hairlines). It slides in from its side as it is scrolled to. Any person, any words.
 */
export function ContactCard({ image, name, role, badge, actions = [], rows = [], from = 'left', colors, className = '' }: ContactCardProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <m.article
      initial={{ opacity: 0, x: from === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE.entrance }}
      className={`rounded-[28px] border px-5 pb-3 pt-7 backdrop-blur-md ${className}`}
      style={{ background: c.card, borderColor: c.line }}
    >
      <div className="flex flex-col items-center text-center">
        <span className="relative grid h-[112px] w-[112px] place-items-center overflow-hidden rounded-pill text-[36px] font-semibold" style={{ background: c.disc, color: '#2a1240' }}>
          {image ? <Image src={image} alt={name} fill sizes="112px" className="object-cover" style={{ objectPosition: '50% 22%' }} /> : initials}
        </span>
        <h3 className="mt-4 text-[26px] font-semibold leading-[1.15]" style={{ color: c.ink }}>
          {name}
        </h3>
        {(role || badge) && (
          <p className="mt-1 flex items-center gap-2 text-[14px]" style={{ color: c.soft }}>
            {role}
            {badge && (
              <span className="rounded-pill px-2 py-[1px] text-[12px] font-medium" style={{ background: c.button, color: c.accent }}>
                {badge}
              </span>
            )}
          </p>
        )}
      </div>

      {actions.length > 0 && (
        <div className="mt-5 flex justify-center gap-3">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              download={a.download}
              {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={a.ariaLabel}
              className="flex min-w-[76px] flex-col items-center gap-1 rounded-[14px] px-3 py-[10px] text-[12px] font-medium transition-transform active:scale-95"
              style={{ background: c.button, color: c.accent }}
            >
              {a.icon}
              {a.label}
            </a>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <dl className="mt-5">
          {rows.map((r, i) => (
            <div key={r.label} className={`py-3 ${i ? 'border-t' : ''}`} style={{ borderColor: c.line }}>
              <dt className="text-[12px] font-medium" style={{ color: c.soft }}>
                {r.label}
              </dt>
              <dd className="mt-[2px] whitespace-pre-line text-[16px] leading-[1.45]" style={{ color: c.ink }}>
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </m.article>
  );
}
