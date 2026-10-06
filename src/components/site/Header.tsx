import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { whatsappEnquiryUrl } from '@/content/site';
import { CategoryTabs } from './CategoryTabs';
import { WhatsAppIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';

/**
 * The header of every page of the site: logo, the category menu (`CategoryTabs`) and the actions. On a laptop
 * and up (lg) it is one row, 80px high, which Hero sizes itself against; below that the menu drops to a row of
 * its own under the logo and actions, so nothing is squeezed. `selected` is the category /templates is showing.
 */
export function Header({ selected }: { selected?: string }) {
  return (
    <header className="sticky top-[0] z-sticky bg-surface-page">
      <div className="mx-auto flex min-h-20 w-full max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 lg:flex-nowrap lg:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
          <span className="display-md flex h-10 w-10 items-center justify-center rounded-pill border-[1.5px] border-invite-metal bg-surface-raised italic text-ink-strong">
            G
          </span>
          <span className="display-md whitespace-nowrap text-ink-strong">Get Invites</span>
        </Link>

        <div className="order-last flex w-full justify-center lg:order-none lg:w-auto">
          <CategoryTabs selected={selected} />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />
          <a
            href={whatsappEnquiryUrl('your invitations')}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('order', 'sm', 'hidden no-underline sm:inline-flex')}
          >
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
