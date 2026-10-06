import { Button } from '@/components/ui/Button';
import { ChatIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';

/** Nav labels are plain text, not links — those pages don't exist yet. Fixed
 * height (not padding) so Hero can size itself against a known header height. */
export function Header() {
  return (
    <header className="sticky top-[0] z-sticky flex h-20 items-center bg-surface-page">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-3">
          <span className="display-md flex h-10 w-10 items-center justify-center rounded-pill border-[1.5px] border-invite-metal bg-surface-raised italic text-ink-strong">
            M
          </span>
          <span className="display-md text-ink-strong">Marry Me</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <span className="body text-ink-body">Templates</span>
          <span className="body text-ink-body">Pricing</span>
          <span className="body text-ink-body">Gallery</span>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="order" className="hidden sm:inline-flex">
            <ChatIcon /> Chat on WhatsApp
          </Button>
        </div>
      </div>
    </header>
  );
}
