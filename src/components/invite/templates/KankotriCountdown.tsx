'use client';

import { CountdownReveal } from '../CountdownReveal';

export interface KankotriCountdownProps {
  /** ISO timestamp with an offset, e.g. "2027-02-21T19:00:00+05:30". */
  weddingDate: string;
  venue?: string;
  /** IANA zone the date is shown in. */
  timeZone?: string;
}

/**
 * Silver's "The celebration begins in": the shared <CountdownReveal /> on a
 * white page, in its default cream/plum palette and marigold-to-lilac foil.
 * (The scratch-card countdown itself lives in invite/CountdownReveal.tsx so
 * other templates can use it in their own colours.)
 */
export function KankotriCountdown(props: KankotriCountdownProps) {
  return <CountdownReveal {...props} background="#ffffff" />;
}
