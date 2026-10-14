'use client';

/**
 * CelestialBodiesBackground — An animated celestial background featuring:
 * - A glowing crescent moon with soft aura
 * - An orbital elliptical path with an orbiting golden planet/satellite
 * - Twinkling celestial stars and constellations
 * - Drifting stardust particles & subtle cosmic nebula glow
 */
export function CelestialBodiesBackground({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {/* 1. Deep Celestial Gradient Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(20, 50, 110, 0.45) 0%, transparent 60%), radial-gradient(circle at 20% 85%, rgba(15, 35, 80, 0.4) 0%, transparent 55%), linear-gradient(180deg, #071738 0%, #040e24 50%, #020713 100%)',
        }}
      />

      {/* 2. Soft Cosmic Nebula Shimmer */}
      <div
        className="absolute top-1/4 -right-16 w-56 h-56 rounded-full blur-3xl opacity-25 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #e6be60 0%, #1e40af 70%, transparent 100%)',
          animationDuration: '6s',
        }}
      />
      <div
        className="absolute bottom-10 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, #1e1b4b 70%, transparent 100%)',
          animationDuration: '8s',
        }}
      />

      {/* 3. SVG Celestial Orbit & Orbiting Planet */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
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

      {/* 4. Glowing Celestial Crescent Moon (Top Right) */}
      <div
        className="absolute top-4 right-5 w-14 h-14 opacity-80"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(230, 190, 96, 0.55))',
          animation: 'celestialFloat 6s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <path
            d="M 60,15 A 38,38 0 1 0 85,75 A 42,42 0 0 1 60,15 Z"
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

      {/* Secondary Orbiting Pearl Moon (Lower left) */}
      <div
        className="absolute bottom-[20%] left-[22%] w-3 h-3"
        style={{
          animation: 'celestialOrbitReverse 18s linear infinite',
          transformOrigin: '50px -30px',
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#e0f2fe] shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
      </div>

      {/* 6. Twinkling Stars & Constellation Clusters */}
      <div className="absolute inset-0">
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
