'use client';

import { useCountdown } from './useCountdown';

export interface CountdownTilesProps {
  /** ISO timestamp with its UTC offset. */
  weddingDate: string;
  /** The four captions, in order: days, hours, minutes, seconds. */
  labels?: [string, string, string, string];
  /** A line under the tiles (the date and the time, written out). */
  caption?: string;
  /** The faces for the numbers and the captions (see `hindiFonts.ts` for Hindi). */
  displayClassName?: string;
  bodyClassName?: string;
  /** The number's colour, the caption's colour, the tile fill and its outline: any CSS colours. */
  numberColor?: string;
  labelColor?: string;
  tile?: string;
  line?: string;
}

/**
 * Four tiles — days, hours, minutes, seconds — ticking down to `weddingDate` (see `useCountdown`: zeros until
 * mounted, then every second; zero once the date has passed), with an optional line under them. Made for a dark
 * panel (light numbers, a translucent tile) and recoloured with props.
 */
export function CountdownTiles({
  weddingDate,
  labels = ['Days', 'Hours', 'Minutes', 'Seconds'],
  caption,
  displayClassName = '',
  bodyClassName = '',
  numberColor = '#f6d98a',
  labelColor = '#a9d4f5',
  tile = 'rgba(255, 255, 255, 0.07)',
  line = 'rgba(233, 178, 60, 0.45)',
}: CountdownTilesProps) {
  const left = useCountdown(weddingDate);
  const values = [left.days, left.hours, left.minutes, left.seconds];

  return (
    <div className="text-center">
      <div className="grid grid-cols-4 gap-2" role="timer" aria-label={values.map((v, i) => `${v} ${labels[i]}`).join(', ')}>
        {values.map((v, i) => (
          <div key={i} className="rounded-[14px] border px-1 py-3" style={{ background: tile, borderColor: line }}>
            <p className={`${displayClassName} tabular text-[30px] font-semibold leading-none`} style={{ color: numberColor }}>
              {v}
            </p>
            <p className={`${bodyClassName} mt-2 text-[12px] font-medium`} style={{ color: labelColor }}>
              {labels[i]}
            </p>
          </div>
        ))}
      </div>
      {caption && (
        <p className={`${bodyClassName} mt-5 text-[14px] leading-[1.7]`} style={{ color: labelColor }}>
          {caption}
        </p>
      )}
    </div>
  );
}
