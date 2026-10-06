'use client';

import { RsvpSection, type RsvpSectionProps } from '../RsvpSection';

export type KankotriRsvpProps = Pick<RsvpSectionProps, 'rsvp' | 'bride' | 'groom' | 'events' | 'timeZone'>;

/**
 * Silver's RSVP: the shared <RsvpSection /> in its default cream/plum palette,
 * on the white-to-cream sheet that follows the schedule, with the form open from
 * the start. (The form itself lives in invite/RsvpSection.tsx so other templates
 * can use it in their own colours.)
 */
export function KankotriRsvp(props: KankotriRsvpProps) {
  return <RsvpSection {...props} background="linear-gradient(to bottom, #ffffff, #fbf7ef 72px)" />;
}
