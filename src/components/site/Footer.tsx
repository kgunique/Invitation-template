import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { CONTACT, whatsappEnquiryUrl } from '@/content/site';
import { FloralCorners } from './FloralAtmosphere';
import { HeartIcon, InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './icons';

/** A label with no `href` is plain text until its page exists. */
const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Templates', href: '/templates' },
  { label: 'Services & Add-ons', href: '/services' },
  { label: 'Contact us', href: '/contact' },
  { label: 'Pricing' },
  { label: 'Gallery' },
] as { label: string; href?: string }[];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface-inverse text-ink-on-inverse">
      <FloralCorners corner="both" size="sm" />

      <div className="relative z-content mx-auto max-w-[1200px] px-4 pb-16 pt-[88px] sm:pt-[112px]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="display-md flex h-[36px] w-[36px] items-center justify-center rounded-pill border-[1.5px] border-marigold-500 italic">
                G
              </span>
              <span className="display-md">Get Invites</span>
            </div>
            <p className="body-sm mt-4 max-w-[32ch] text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
              Interactive digital invitations for Indian weddings — cinematic, animated, one
              category done properly.
            </p>
          </div>

          <div>
            <p className="label text-marigold-300">Quick links</p>
            <ul className="mt-4 flex flex-col gap-2">
              {LINKS.map((l) => (
                <li key={l.label} className="body-sm text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
                  {l.href ? (
                    <Link href={l.href} className="no-underline hover:text-ink-on-inverse">
                      {l.label}
                    </Link>
                  ) : (
                    l.label
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-marigold-300">Stay connected</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="body-sm flex items-center gap-2 text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
                <MailIcon /> {CONTACT.email}
              </li>
              <li className="body-sm flex items-center gap-2 text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
                <PhoneIcon /> {CONTACT.phone}
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <span className="body-sm flex h-[36px] items-center gap-2 rounded-pill border border-[color-mix(in_srgb,var(--ink-on-inverse)_30%,transparent)] px-3">
                <InstagramIcon /> Instagram
              </span>
              <a
                href={whatsappEnquiryUrl('your invitations')}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('order', 'sm', 'no-underline')}
              >
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--ink-on-inverse)_15%,transparent)] pt-6 sm:flex-row">
          <p className="caption text-[color-mix(in_srgb,var(--ink-on-inverse)_70%,transparent)]">
            &copy; {new Date().getFullYear()} Get Invites. All rights reserved.
          </p>
          <p className="caption flex items-center gap-1 text-[color-mix(in_srgb,var(--ink-on-inverse)_70%,transparent)]">
            Made with <HeartIcon className="text-rani-500" /> in India
          </p>
        </div>

      </div>
    </footer>
  );
}
