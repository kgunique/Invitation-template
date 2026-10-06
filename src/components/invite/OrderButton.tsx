'use client';

import type { CSSProperties } from 'react';
import { m } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { whatsappOrderUrl } from '@/content/site';
import { DURATION, EASE } from '@/styles/motion';
import { ChatIcon, MusicIcon } from './icons';
import { useBackgroundMusic, type BackgroundMusic } from './useBackgroundMusic';

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
 * The round music button: a note with a slash through it while the music is off;
 * while it plays, three equaliser bars dance in it and a gold ring breathes
 * round it. Reads --surface-raised, --ink-strong, --line-firm and --invite-metal,
 * so the page pins those to its own palette.
 */
export function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      aria-pressed={playing}
      className={`pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-pill border border-line-firm bg-surface-raised text-ink-strong shadow-lg ${
        playing ? 'amb-glow-ring' : ''
      }`}
      style={{ ['--glow' as string]: 'var(--invite-metal, #c08a2e)' } as CSSProperties}
    >
      {playing ? (
        <span aria-hidden className="flex h-[16px] items-end gap-[3px]">
          {[0.9, 0.7, 1.1].map((dur, i) => (
            <span
              key={i}
              className="amb-eq block h-full w-[3px] rounded-pill bg-[var(--invite-metal,#c08a2e)]"
              style={{ ['--eq-dur' as string]: `${dur}s`, ['--eq-delay' as string]: `${-i * 0.3}s` } as CSSProperties}
            />
          ))}
        </span>
      ) : (
        <MusicIcon off />
      )}
    </button>
  );
}

/**
 * Order Now (left) and, if asked for, the music button (right), pinned to the
 * bottom of the screen while the invite scrolls — z-control is the design
 * system's layer for exactly these two. The outer bar ignores pointer events (it
 * spans the full width); only the buttons take them, and the inner row is held
 * to the same phone-width column as the content. `style` is for a page that pins
 * its own colour variables (the music button reads --surface-raised, --ink-strong
 * and --line-firm). Mount it when the buttons should be reachable: Silver waits
 * until its lock opens so they're not in the tab order behind it.
 *
 * `music`: `true` gives a button that plays the sample loop when tapped; or pass
 * the object from `useBackgroundMusic` to control it from the page (a page that
 * starts the music at the tap that opens its gate does this).
 */
export function FloatingOrderBar({
  templateName,
  music = false,
  delay = 0.8,
  style,
}: {
  templateName: string;
  music?: boolean | BackgroundMusic;
  /** Seconds before the bar fades in. */
  delay?: number;
  style?: CSSProperties;
}) {
  const own = useBackgroundMusic();
  const control = typeof music === 'object' ? music : music ? own : null;

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
        {control && <MusicButton playing={control.playing} onToggle={control.toggle} />}
      </div>
    </m.div>
  );
}
