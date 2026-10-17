import type { CSSProperties } from 'react';

/**
 * A voice on a call as a row of bars rising and falling from their middle, each at its own pace (`amb-eq`, CSS only;
 * still under reduced motion). Fixed tables, so server and browser agree. Its height and width come from `className`.
 */
export function VoiceWave({ bars = 28, color = '#ffffff', className = '' }: { bars?: number; color?: string; className?: string }) {
  return (
    <span aria-hidden className={`flex items-center justify-center gap-[3px] ${className}`}>
      {Array.from({ length: bars }, (_, i) => {
        // taller in the middle, uneven along the row
        const reach = 0.35 + 0.65 * Math.sin(((i + 0.5) / bars) * Math.PI) * (0.6 + ((i * 37) % 10) / 25);
        return (
          <span key={i} className="flex h-full items-center">
            <span
              className="amb-eq block w-[3px] rounded-pill"
              style={
                {
                  height: `${Math.round(Math.min(1, reach) * 100)}%`,
                  background: color,
                  transformOrigin: '50% 50%',
                  '--eq-dur': `${0.55 + ((i * 7) % 5) * 0.12}s`,
                  '--eq-delay': `${-((i * 13) % 9) * 0.11}s`,
                } as CSSProperties
              }
            />
          </span>
        );
      })}
    </span>
  );
}
