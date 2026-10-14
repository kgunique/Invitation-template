'use client';

import { CelestialStarPetalsShower } from './CelestialStarPetalsShower';

/**
 * CelestialThemeBackground — Full-screen celestial ambient background
 * applied across the entire Aarav & Kavya wedding invitation theme.
 *
 * Features:
 * - Deep royal midnight navy to sapphire celestial gradient
 * - Breathing cosmic nebulae with warm gold and starlight aura
 * - Celestial orbital rings with an orbiting golden planet & satellite
 * - Crescent moon with soft aura
 * - Twinkling stars and constellations across the sky
 */
export function CelestialThemeBackground({
  withPetals = false,
  className = '',
}: {
  withPetals?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-[0] pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      {/* 1. Deep Cosmic Sky Gradient Base */}
      <div
        className="absolute inset-[0]"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(20, 55, 125, 0.65) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 85% 65%, rgba(24, 48, 105, 0.5) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 15% 85%, rgba(16, 38, 90, 0.45) 0%, transparent 60%), linear-gradient(180deg, #020614 0%, #05102a 30%, #081a42 55%, #040d26 80%, #020612 100%)',
        }}
      />

      {/* 2. Soft Radiant Cosmic Nebula Shimmers */}
      <div
        className="absolute -top-12 right-[8%] w-[420px] h-[420px] rounded-full blur-[90px] opacity-35 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #ffd875 0%, #1e40af 60%, transparent 100%)',
          animationDuration: '6s',
        }}
      />
      <div
        className="absolute top-[40%] -left-16 w-[360px] h-[360px] rounded-full blur-[85px] opacity-25 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, #1e1b4b 65%, transparent 100%)',
          animationDuration: '8s',
          animationDelay: '1.2s',
        }}
      />
      <div
        className="absolute bottom-12 right-[6%] w-[380px] h-[380px] rounded-full blur-[90px] opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, #0c214d 70%, transparent 100%)',
          animationDuration: '7s',
          animationDelay: '2.5s',
        }}
      />

      {/* 3. Celestial Orbit Rings in Background */}
      <svg
        className="absolute inset-[0] w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="78%"
          cy="22%"
          rx="260"
          ry="100"
          fill="none"
          stroke="rgba(255, 216, 117, 0.35)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          transform="rotate(-18 400 200)"
        />
        <ellipse
          cx="22%"
          cy="68%"
          rx="230"
          ry="90"
          fill="none"
          stroke="rgba(147, 197, 253, 0.3)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          transform="rotate(18 150 600)"
        />
      </svg>

      {/* 4. A small crescent keeps the sky celestial without dominating the page. */}
      <div
        className="absolute top-5 right-4 h-12 w-12 opacity-55 sm:right-12 sm:h-14 sm:w-14"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(255, 216, 117, 0.45))',
          animation: 'celestialThemeMoonFloat 10s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <path
            d="M 60,15 A 38,38 0 1 0 85,75 A 42,42 0 0 1 60,15 Z"
            fill="url(#themeMoonGrad)"
          />
          <defs>
            <linearGradient id="themeMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ffd875" />
              <stop offset="100%" stopColor="#d99824" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Jupiter, kept soft so the event copy remains the focal point. */}
      <div
        className="absolute top-[62%] right-[8%] h-10 w-10 overflow-hidden rounded-full opacity-40 sm:h-12 sm:w-12"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,244,212,0.85), transparent 34%), repeating-linear-gradient(0deg, #9b5b37 0 3px, #e6c28e 3px 6px, #bd8056 6px 8px)',
          boxShadow: '0 0 16px rgba(230,190,96,0.3), inset -6px -3px 10px rgba(0,0,0,0.55)',
          borderRadius: '50%',
          clipPath: 'circle(50%)',
        }}
      />

      {/* 5. Orbiting Celestial Bodies (Golden Planet & Pearl Satellite) */}
      <div
        className="absolute top-[20%] right-[20%] w-7 h-7"
        style={{
          animation: 'celestialThemeOrbit 18s linear infinite',
          transformOrigin: '-120px 85px',
        }}
      >
        <div className="relative w-full h-full">
          {/* Planet Sphere */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#b47a16] via-[#ffd875] to-[#ffffff] shadow-[0_0_14px_rgba(255,216,117,0.95)]" />
          {/* Planet Ring */}
          <div className="absolute -inset-1.5 rounded-full border-2 border-[#ffd875]/80 -rotate-45 scale-y-50 pointer-events-none" />
        </div>
      </div>

      <div
        className="absolute bottom-[30%] left-[24%] w-4 h-4"
        style={{
          animation: 'celestialThemeOrbitReverse 22s linear infinite',
          transformOrigin: '95px -65px',
        }}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#ffffff] shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
      </div>

      {/* 6. Dense Bright Twinkling Stars Across Whole Sky */}
      <div className="absolute inset-[0]">
        <span
          className="absolute top-[6%] left-[10%] text-[#ffd875] text-[15px] animate-pulse"
          style={{ animationDuration: '2.2s' }}
        >
          ✦
        </span>
        <span
          className="absolute top-[20%] left-[5%] text-[#7dd3fc] text-[13px] animate-pulse"
          style={{ animationDuration: '3.1s', animationDelay: '0.6s' }}
        >
          ✦
        </span>
        <span
          className="absolute top-[14%] left-[62%] text-[#ffd875] text-[16px] animate-pulse"
          style={{ animationDuration: '2.6s', animationDelay: '1.2s' }}
        >
          ✦
        </span>
        <span
          className="absolute top-[35%] right-[8%] text-[#ffd875] text-[15px] animate-pulse"
          style={{ animationDuration: '3.4s', animationDelay: '0.4s' }}
        >
          ✦
        </span>
        <span
          className="absolute top-[50%] left-[12%] text-[#bae6fd] text-[13px] animate-pulse"
          style={{ animationDuration: '2.3s', animationDelay: '1.1s' }}
        >
          ✦
        </span>
        <span
          className="absolute top-[68%] right-[15%] text-[#ffd875] text-[14px] animate-pulse"
          style={{ animationDuration: '2.9s', animationDelay: '0.7s' }}
        >
          ✦
        </span>
        <span
          className="absolute bottom-[14%] left-[38%] text-[#ffd875] text-[15px] animate-pulse"
          style={{ animationDuration: '2.5s', animationDelay: '1.4s' }}
        >
          ✦
        </span>
        <span
          className="absolute bottom-[28%] right-[6%] text-[#7dd3fc] text-[12px] animate-pulse"
          style={{ animationDuration: '3.2s', animationDelay: '0.9s' }}
        >
          ✦
        </span>

        {/* Scattered Radiant Starlight Points */}
        <span className="absolute top-[16%] left-[26%] w-2 h-2 rounded-full bg-[#ffd875] shadow-[0_0_8px_#ffd875]" />
        <span className="absolute top-[30%] right-[32%] w-1.5 h-1.5 rounded-full bg-[#ffffff] shadow-[0_0_6px_#ffffff]" />
        <span className="absolute top-[48%] left-[40%] w-2 h-2 rounded-full bg-[#93c5fd] shadow-[0_0_8px_#93c5fd]" />
        <span className="absolute top-[64%] right-[6%] w-1.5 h-1.5 rounded-full bg-[#ffd875] shadow-[0_0_6px_#ffd875]" />
        <span className="absolute bottom-[20%] left-[80%] w-2 h-2 rounded-full bg-[#ffffff] shadow-[0_0_7px_#ffffff]" />
        <span className="absolute bottom-[8%] right-[30%] w-2 h-2 rounded-full bg-[#ffd875] shadow-[0_0_8px_#ffd875]" />
      </div>

      {withPetals && <CelestialStarPetalsShower count={42} />}

      <style jsx>{`
        @keyframes celestialThemeOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes celestialThemeOrbitReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes celestialThemeMoonFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-8px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
}
