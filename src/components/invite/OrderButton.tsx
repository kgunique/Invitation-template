'use client';

import type { CSSProperties } from 'react';
import { m } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { whatsappOrderUrl } from '@/content/site';
import { DURATION, EASE } from '@/styles/motion';
import { ChatIcon, PauseIcon } from './icons';

/**
 * "Order Now": opens WhatsApp with a ready-written enquiry naming this
 * template and linking to the page the guest is on (so it is the hosted address
 * once deployed). Give it `templateName` from TEMPLATE_NAMES in content/site.ts.
 */
export function OrderButton({ templateName, className = '' }: { templateName: string; className?: string }) {
  return (
    <Button
      variant="order"
      className={className}
      onClick={() => window.open(whatsappOrderUrl(templateName, window.location.href), '_blank', 'noopener,noreferrer')}
    >
      <ChatIcon /> Order Now
    </Button>
  );
}

/**
 * Order Now (left) and, if asked for, the music toggle (right), pinned to the
 * bottom of the screen while the invite scrolls — z-control is the design
 * system's layer for exactly these two. The outer bar ignores pointer events (it
 * spans the full width); only the buttons take them, and the inner row is held
 * to the same phone-width column as the content. `style` is for a page that pins
 * its own colour variables (the music button reads --surface-raised, --ink-strong
 * and --line-firm). Mount it when the buttons should be reachable: Silver waits
 * until its lock opens so they're not in the tab order behind it.
 */
export function FloatingOrderBar({
  templateName,
  music = false,
  delay = 0.8,
  style,
}: {
  templateName: string;
  music?: boolean;
  /** Seconds before the bar fades in. */
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <m.div
      style={{ ...style, paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, delay, ease: EASE.entrance }}
      className="pointer-events-none fixed inset-x-[0] bottom-[0] z-control"
    >
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between px-6">
        <OrderButton templateName={templateName} className="pointer-events-auto shadow-lg" />
        {music && (
          <button
            type="button"
            aria-label="Pause background music"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-pill border border-line-firm bg-surface-raised text-ink-strong shadow-lg"
          >
            <PauseIcon />
          </button>
        )}
      </div>
    </m.div>
  );
}
