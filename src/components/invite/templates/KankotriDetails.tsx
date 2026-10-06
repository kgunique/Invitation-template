'use client';

import { DetailsSection, type DetailsSectionProps } from '../DetailsSection';

export type KankotriDetailsProps = Pick<DetailsSectionProps, 'details'>;

/**
 * Silver's "Wedding details": the shared <DetailsSection /> in its default
 * cream/plum palette and cream cards, easing in from the cream of the schedule
 * above. (The section itself lives in invite/DetailsSection.tsx so other
 * templates can use it in their own colours.)
 */
export function KankotriDetails(props: KankotriDetailsProps) {
  return <DetailsSection {...props} background="linear-gradient(to bottom, #fbf7ef, #ffffff 72px)" />;
}
