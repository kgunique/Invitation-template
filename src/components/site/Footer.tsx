import { FloralCorners } from './FloralAtmosphere';
import { ChatIcon, HeartIcon, InstagramIcon, MailIcon, PhoneIcon } from './icons';

const LINKS = ['Home', 'Templates', 'Pricing', 'Gallery'] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface-inverse text-ink-on-inverse">
      <FloralCorners corner="both" />

      <div className="relative z-content mx-auto max-w-[1200px] px-4 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="display-md flex h-[36px] w-[36px] items-center justify-center rounded-pill border-[1.5px] border-marigold-500 italic">
                M
              </span>
              <span className="display-md">Marry Me</span>
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
                <li key={l} className="body-sm text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
                  {l}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-marigold-300">Stay connected</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="body-sm flex items-center gap-2 text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
                <MailIcon /> hello@marryme.example
              </li>
              <li className="body-sm flex items-center gap-2 text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
                <PhoneIcon /> +91 80834 99618
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <span className="body-sm flex h-[36px] items-center gap-2 rounded-pill border border-[color-mix(in_srgb,var(--ink-on-inverse)_30%,transparent)] px-3">
                <InstagramIcon /> Instagram
              </span>
              <span className="body-sm flex h-[36px] items-center gap-2 rounded-pill border border-[color-mix(in_srgb,var(--ink-on-inverse)_30%,transparent)] px-3">
                <ChatIcon /> WhatsApp
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--ink-on-inverse)_15%,transparent)] pt-6 sm:flex-row">
          <p className="caption text-[color-mix(in_srgb,var(--ink-on-inverse)_70%,transparent)]">
            &copy; {new Date().getFullYear()} Marry Me. All rights reserved.
          </p>
          <p className="caption flex items-center gap-1 text-[color-mix(in_srgb,var(--ink-on-inverse)_70%,transparent)]">
            Made with <HeartIcon className="text-rani-500" /> in India
          </p>
        </div>

      </div>
    </footer>
  );
}
