'use client';

/**
 * CelestialBodiesBackground — An animated celestial background featuring:
 * - A small crescent moon with a soft aura
 * - An orbital elliptical path with an orbiting golden planet/satellite
 * - A subtle Jupiter and ringed planet
 * - Twinkling celestial stars and constellations
 * - Drifting stardust particles & subtle cosmic nebula glow
 */
export function CelestialBodiesBackground({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-[0] overflow-hidden select-none ${className}`}
    >
      {/* 1. Deep Celestial Gradient Base */}
      <div
        className="absolute inset-[0]"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(20, 50, 110, 0.28) 0%, transparent 60%), radial-gradient(circle at 20% 85%, rgba(15, 35, 80, 0.3) 0%, transparent 55%), linear-gradient(180deg, #071738 0%, #040e24 50%, #020713 100%)',
        }}
      />

      {/* 2. Soft Cosmic Nebula Shimmer */}
      <div
        className="absolute top-[22%] right-[6%] h-28 w-28 rounded-full blur-2xl opacity-10 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #e6be60 0%, #1e40af 58%, transparent 100%)',
          animationDuration: '9s',
        }}
      />
      <div
        className="absolute bottom-[12%] left-[4%] h-24 w-24 rounded-full blur-2xl opacity-10 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, #1e1b4b 70%, transparent 100%)',
          animationDuration: '11s',
        }}
      />

      {/* 3. SVG Celestial Orbit & Orbiting Planet */}
      <svg
        className="absolute inset-[0] w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient for glowing celestial planet */}
          <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3d1" />
            <stop offset="40%" stopColor="#ffd875" />
            <stop offset="100%" stopColor="#c89628" />
          </radialGradient>
          <filter id="celestialBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Celestial Orbit Ring */}
        <ellipse
          cx="82%"
          cy="28%"
          rx="110"
          ry="48"
          fill="none"
          stroke="rgba(230, 190, 96, 0.22)"
          strokeWidth="1"
          strokeDasharray="4 6"
          transform="rotate(-20 300 120)"
        />

        {/* Secondary Inner Orbit Ring */}
        <ellipse
          cx="20%"
          cy="75%"
          rx="85"
          ry="36"
          fill="none"
          stroke="rgba(147, 197, 253, 0.18)"
          strokeWidth="1"
          strokeDasharray="3 5"
          transform="rotate(15 80 320)"
        />
      </svg>

      {/* 4. Small crescent moon, kept away from the event text */}
      <div
        className="absolute top-[8%] right-[10%] h-10 w-10 opacity-60"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(230, 190, 96, 0.35))',
          animation: 'celestialFloat 10s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <path
            d="M 66,12 A 40,40 0 1 0 88,76 A 32,32 0 0 1 66,12 Z"
            fill="url(#moonGrad)"
          />
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#ffd875" />
              <stop offset="100%" stopColor="#d49b28" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Orbiting Celestial Body (Planet with Ring) */}
      <div
        className="absolute top-[22%] right-[18%] w-5 h-5"
        style={{
          animation: 'celestialOrbit 14s linear infinite',
          transformOrigin: '-60px 40px',
        }}
      >
        <div className="relative w-full h-full">
          {/* Planet Sphere */}
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#c4881a] via-[#ffd875] to-[#fff6de] shadow-[0_0_8px_rgba(255,216,117,0.8)]" />
          {/* Planet Orbit Ring */}
          <div className="absolute -inset-1 rounded-full border border-[#ffd875]/60 -rotate-45 scale-y-50 pointer-events-none" />
        </div>
      </div>

      {/* Jupiter: muted, banded artwork in the lower corner */}
      <div
        className="absolute bottom-[15%] left-[12%] h-10 w-10 overflow-hidden rounded-full opacity-55"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,244,212,0.8), transparent 34%), repeating-linear-gradient(0deg, #9b5b37 0 3px, #e6c28e 3px 6px, #bd8056 6px 8px)',
          boxShadow: '0 0 12px rgba(230,190,96,0.25), inset -5px -2px 9px rgba(0,0,0,0.55)',
          borderRadius: '50%',
          clipPath: 'circle(50%)',
        }}
      />

      {/* A small ringed planet balances Jupiter without competing with the text. */}
      <div
        className="absolute bottom-[24%] right-[12%] h-6 w-6 rounded-full opacity-55"
        style={{
          background: 'radial-gradient(circle at 30% 25%, #fff1c2, #d49b42 48%, #70451f 100%)',
          boxShadow: '0 0 9px rgba(255,216,117,0.3)',
        }}
      >
        <span
          className="absolute left-[-7px] top-[9px] h-[8px] w-[40px] rounded-full border border-[#ffd875]/55"
          style={{ transform: 'rotate(-24deg)' }}
        />
      </div>

      {/* 6. Twinkling Stars & Constellation Clusters */}
      <div className="absolute inset-[0]">
        {/* Star 1 - Bright Gold */}
        <span
          className="absolute top-[12%] left-[18%] text-[#ffd875] text-[10px] animate-pulse"
          style={{ animationDuration: '2.4s' }}
        >
          ✦
        </span>
        {/* Star 2 - Sparkling Cyan */}
        <span
          className="absolute top-[38%] left-[8%] text-[#7dd3fc] text-[9px] animate-pulse"
          style={{ animationDuration: '3.1s', animationDelay: '0.8s' }}
        >
          ✦
        </span>
        {/* Star 3 - Gold Star */}
        <span
          className="absolute top-[18%] left-[52%] text-[#fef08a] text-[12px] animate-pulse"
          style={{ animationDuration: '2.8s', animationDelay: '1.4s' }}
        >
          ✦
        </span>
        {/* Star 4 - Lower Star */}
        <span
          className="absolute bottom-[28%] right-[14%] text-[#ffd875] text-[11px] animate-pulse"
          style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}
        >
          ✦
        </span>
        {/* Star 5 - Near bottom center */}
        <span
          className="absolute bottom-[12%] left-[45%] text-[#bae6fd] text-[8px] animate-pulse"
          style={{ animationDuration: '2.2s', animationDelay: '1.1s' }}
        >
          ✦
        </span>

        {/* Fine Star Dust Dots */}
        <span className="absolute top-[25%] left-[32%] w-1 h-1 rounded-full bg-[#ffd875]/70 shadow-[0_0_3px_#ffd875]" />
        <span className="absolute top-[50%] right-[28%] w-1.5 h-1.5 rounded-full bg-[#ffffff]/80 shadow-[0_0_4px_#ffffff]" />
        <span className="absolute top-[70%] left-[20%] w-1 h-1 rounded-full bg-[#93c5fd]/70" />
        <span className="absolute bottom-[35%] left-[80%] w-1 h-1 rounded-full bg-[#fde047]/60" />
        <span className="absolute bottom-[8%] right-[22%] w-1 h-1 rounded-full bg-[#ffffff]/60" />
      </div>

      {/* CSS Keyframe Styles */}
      <style jsx>{`
        @keyframes celestialOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes celestialOrbitReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes celestialFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-6px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
}
