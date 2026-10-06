import { HangingSprite } from '../HangingSprite';
import { TempleSkyline } from '../TempleSkyline';

/**
 * The art for the Platinum template's closing "Thank you": a toran of flower
 * strings and mango leaves hanging across the top (each strand cut from
 * public/art/platinum/flat-ugadi-garland-illustration.png into
 * public/art/platinum/events/), every strand swaying on its own, and a skyline
 * of temples along the foot. Swap `scene` for a picture of musicians or a
 * temple procession when there is one.
 */
const EV = '/art/platinum/events/';

// [file, native width, native height, size on screen, side, offset from that side, swing seconds, delay]
const STRINGS = [
  ['ugadi-top-1', 126, 906, 23, 'left', 6, 5.6, -0.8],
  ['ugadi-top-2', 140, 714, 25, 'left', 34, 4.7, -2.4],
  ['ugadi-top-3', 131, 515, 23, 'left', 64, 5.1, -1.7],
  ['ugadi-top-5', 126, 517, 23, 'right', 64, 4.9, -3.3],
  ['ugadi-top-6', 131, 722, 25, 'right', 34, 5.4, -0.3],
  ['ugadi-top-7', 130, 919, 23, 'right', 6, 4.5, -2.9],
] as const;

export function platinumThankYouTop() {
  return (
    <>
      {STRINGS.map(([file, w, h, size, side, off, dur, delay]) => (
        <HangingSprite
          key={file}
          src={`${EV}${file}.webp`}
          width={w}
          height={h}
          size={size}
          {...(side === 'left' ? { left: off } : { right: off })}
          angle={2.4}
          duration={dur}
          delay={delay}
        />
      ))}
      {/* The mango leaves, hung from their own thread across the middle. */}
      <HangingSprite
        src={`${EV}ugadi-top-4.webp`}
        width={420}
        height={262}
        size={196}
        left="50%"
        top={-6}
        angle={0.8}
        duration={6.2}
        className="-ml-[98px]"
      />
    </>
  );
}

export function platinumThankYouScene() {
  return <TempleSkyline className="w-full" />;
}
