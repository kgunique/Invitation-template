'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';

export interface PhoneAppHeaderProps {
  /** The app's small name above, e.g. "Contacts" (with an icon), as a phone's app switcher shows it. */
  app: string;
  appIcon?: ReactNode;
  /** The large title, as a phone app's page opens with one. */
  title: string;
  /** A line under it. */
  subtitle?: string;
  /** The app icon's tile colour. */
  tile?: string;
  ink?: string;
  soft?: string;
  className?: string;
}

/**
 * The top of a phone app's page: a small app icon and the app's name, then a large bold title and a line under it.
 * It rises into view as it is scrolled to. For a page made of "apps" (the couple as Contacts, the story as Messages…).
 */
export function PhoneAppHeader({ app, appIcon, title, subtitle, tile = '#34c759', ink = '#ffffff', soft = 'rgba(255,255,255,0.65)', className = '' }: PhoneAppHeaderProps) {
  return (
    <m.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE.entrance }}
      className={`px-1 ${className}`}
    >
      <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: soft }}>
        <span className="grid h-[22px] w-[22px] place-items-center rounded-[6px]" style={{ background: tile, color: '#ffffff' }}>
          {appIcon}
        </span>
        {app}
      </p>
      <h2 className="mt-2 text-[34px] font-bold leading-[1.1] tracking-[-0.01em]" style={{ color: ink }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-[15px]" style={{ color: soft }}>
          {subtitle}
        </p>
      )}
    </m.header>
  );
}
