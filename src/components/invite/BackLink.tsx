import Link from 'next/link';
import { BackIcon } from './icons';

const TONES = {
  // On a dark overlay or night page: a gold outline on a darkened pill. It reads
  // --invite-metal and --invite-ground, so the screen around it decides the colours.
  gate: 'border border-[color-mix(in_srgb,var(--invite-metal)_50%,transparent)] bg-[color-mix(in_srgb,var(--invite-ground)_80%,transparent)] text-invite-metal',
  // Over a photograph: a solid pill in --invite-ground (a deep maroon, say) with
  // light text and a gold hairline, so it reads on sky or on shadow alike.
  solid:
    'border border-[color-mix(in_srgb,var(--invite-metal)_70%,transparent)] bg-[var(--invite-ground)] text-[#fff8ea] shadow-md',
  // On a light page: dark ink on a pale pill with a hairline. Reads --surface-page,
  // --ink-strong and --line-firm.
  page: 'bg-[color-mix(in_srgb,var(--surface-page)_80%,transparent)] text-ink-strong shadow-[inset_0_0_0_1.5px_var(--line-firm)]',
} as const;

/** The "Back" pill every invite carries top left, taking guests back to the site.
 * Pick the `tone` that matches the page it sits on. */
export function BackLink({ tone = 'gate' }: { tone?: keyof typeof TONES }) {
  return (
    <Link href="/" className={`action inline-flex items-center gap-1 rounded-pill px-4 py-2 ${TONES[tone]}`}>
      <BackIcon /> Back
    </Link>
  );
}
