import { TEMPLATE_NAMES } from '@/content/site';
import { GujaratiKankotriInvite, type GujaratiKankotriInviteProps } from './GujaratiKankotriInvite';

/**
 * Gujarati Kankotri, yellow-gate variation. Same hero and structure as the
 * maroon one; only the opening lock is re-skinned, entirely through props:
 *
 *   look      marigold-yellow panels, deep maroon seam/lock/text (dark ink for
 *             contrast on yellow), a light seam shadow so yellow doesn't muddy
 *   animation the key turns counter-clockwise 1.5x, and the panels part slowly
 *             on an ease-in-out-quart instead of the default glide
 *   petals    a slow, sparse drift while closed and a slower, denser shower on
 *             opening, in orange and crimson
 *
 * It has none of the content sections yet (the "Dear friends and family"
 * letter, the scratch-card countdown, the schedule, the wedding details, the
 * RSVP, "we will wait for you", the closing credit) — those were added for the
 * Ishani & Advait template only (showLetter / showCountdown / showSchedule /
 * showDetails / showRsvp / showWaiting / showClosing = false below).
 */
const YELLOW_LOCK: NonNullable<GujaratiKankotriInviteProps['lock']> = {
  colors: { accent: '#7a1020', ink: '#3b0d12', inkSoft: '#6b3a2a', petal: '#e8590c' },
  gradient: { from: '#ffd84d', to: '#f2a007', angle: 180 },
  depth: 0.22,
  rotation: -540,
  rotationDuration: 1,
  openDuration: 2.2,
  openEase: [0.76, 0, 0.24, 1],
  petals: {
    ambient: { color: ['#e8590c', '#c2255c'], count: 14, speed: 0.7 },
    burst: { color: ['#e8590c', '#c2255c', '#7a1020'], count: 28, speed: 1.8 },
  },
};

export function GujaratiKankotriYellowInvite(
  props: Omit<
    GujaratiKankotriInviteProps,
    | 'lock'
    | 'showLetter'
    | 'showCountdown'
    | 'showSchedule'
    | 'showDetails'
    | 'showRsvp'
    | 'showWaiting'
    | 'showClosing'
  >,
) {
  return (
    <GujaratiKankotriInvite
      {...props}
      lock={YELLOW_LOCK}
      templateName={TEMPLATE_NAMES['gujarati-kankotri-yellow']}
      showLetter={false}
      showCountdown={false}
      showSchedule={false}
      showDetails={false}
      showRsvp={false}
      showWaiting={false}
      showClosing={false}
    />
  );
}
