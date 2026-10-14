'use client';

import { useMemo } from 'react';

export interface StarPetalItem {
  id: number;
  type: 'star' | 'petal' | 'sparkle';
  left: number; // percentage (0 - 100)
  size: number; // px size
  duration: number; // seconds to fall
  delay: number; // animation delay in seconds
  drift: number; // horizontal sway in px (-40 to 40)
  restTop: number;
  color: string;
}

const STAR_COLORS = ['#ffd875', '#fff4d4', '#fde047', '#fed7aa', '#ffffff'];
const PETAL_COLORS = ['#e6be60', '#ffd875', '#fb7185', '#fda4af', '#fbbf24', '#f59e0b'];

/**
 * CelestialStarPetalsShower — Falling twinkling stars and golden petals
 * drifting continuously from top to bottom across the whole theme.
 */
export function CelestialStarPetalsShower({
  count = 42,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  // Deterministic seed generation so server and client match without hydration mismatches
  const items: StarPetalItem[] = useMemo(() => {
    const list: StarPetalItem[] = [];
    for (let i = 0; i < count; i++) {
      // Golden ratio distribution for natural organic spread
      const norm = (i * 0.61803398875) % 1;
      const norm2 = ((i + 1) * 0.381966) % 1;
      const norm3 = ((i + 2) * 0.754877) % 1;

      const type = i % 3 === 0 ? 'petal' : i % 3 === 1 ? 'star' : 'sparkle';
      const size = type === 'petal' ? 16 + norm2 * 12 : 12 + norm2 * 10;
      const duration =
        type === 'petal' ? 18 + norm3 * 10 : 9 + norm3 * 10; // Petals drift more slowly than the stars
      const delay = -(norm * duration); // Spread evenly across the cycle so screen is never empty
      const drift = Math.round((norm2 - 0.5) * 80); // -40px to +40px horizontal sway

      const color =
        type === 'petal'
          ? PETAL_COLORS[i % PETAL_COLORS.length]
          : STAR_COLORS[i % STAR_COLORS.length];

      list.push({
        id: i,
        type,
        left: Math.round(norm * 94 + 3), // 3% to 97% width
        size: Math.round(size),
        duration: Math.round(duration * 10) / 10,
        delay: Math.round(delay * 10) / 10,
        drift,
        restTop: Math.round(norm3 * 95),
        color,
      });
    }
    return list;
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-[0] pointer-events-none overflow-hidden select-none z-effects ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="celestial-fall-particle absolute top-[0]"
          style={
            {
              left: `${item.left}%`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              '--drift': `${item.drift}px`,
              '--rest-top': `${item.restTop}%`,
            } as React.CSSProperties
          }
        >
          {item.type === 'star' && (
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full star-twinkle-element"
              style={{
                filter: `drop-shadow(0 0 6px ${item.color})`,
                color: item.color,
              }}
            >
              {/* 4-pointed radiant celestial star */}
              <path
                fill="currentColor"
                d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
              />
            </svg>
          )}

          {item.type === 'sparkle' && (
            <div
              className="w-full h-full flex items-center justify-center star-twinkle-element"
              style={{
                color: item.color,
                textShadow: `0 0 8px ${item.color}`,
              }}
            >
              <span className="text-[13px] font-bold leading-none select-none">✦</span>
            </div>
          )}

          {item.type === 'petal' && (
            <div
              className="w-full h-full petal-tumble-element"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              }}
            >
              <svg viewBox="0 0 30 30" className="w-full h-full">
                {/* Organic curved wedding rose/marigold petal */}
                <path
                  d="M16 2 C22 6 26 12 23 20 C21 26 18 29 16 30 C14 29 11 26 9 20 C6 12 10 6 16 2 Z"
                  fill={item.color}
                  fillOpacity="0.82"
                />
                {/* Inner petal vein highlight */}
                <path
                  d="M16 5 C13 12 19 19 16 27"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        .celestial-fall-particle {
          will-change: transform, opacity;
          animation-name: celestialParticleFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .star-twinkle-element {
          animation: starTwinkleGlow 3.2s ease-in-out infinite alternate;
        }

        .petal-tumble-element {
          animation: petalTumble 7.5s ease-in-out infinite alternate;
        }

        @keyframes celestialParticleFall {
          0% {
            transform: translateY(-5vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift, 30px)) rotate(180deg);
            opacity: 0.95;
          }
          92% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) translateX(calc(var(--drift, 30px) * -0.6)) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes starTwinkleGlow {
          0%,
          100% {
            transform: scale(0.75);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }

        @keyframes petalTumble {
          0% {
            transform: rotate(-25deg) scaleX(0.85);
          }
          100% {
            transform: rotate(35deg) scaleX(1.15);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .celestial-fall-particle {
            animation: none !important;
            top: var(--rest-top);
            opacity: 0.8;
          }

          .star-twinkle-element,
          .petal-tumble-element {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
