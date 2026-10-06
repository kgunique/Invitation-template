'use client';

import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export interface ScratchCardProps {
  /** What's hidden underneath the coating. Always in the DOM, so a screen reader reads it. */
  children: ReactNode;
  /** Printed on the coating; it scratches away with it. */
  label?: string;
  /** Gradient stops for the coating, evenly spaced. */
  colors?: string[];
  /** CSS-style angle in degrees (0 = up, 90 = right). */
  angle?: number;
  /** Scratch brush diameter in px. */
  brushSize?: number;
  /** Share of the coating (0–1) that, once scratched off, reveals the rest. */
  revealAt?: number;
  /** Text of the keyboard fallback button. */
  revealLabel?: string;
  /** Styles for the card shell — radius, shadow, background. The shell clips the coating to its radius. */
  className?: string;
  /** Inline styles for the shell, for a value that has to come from a prop (a background colour). */
  style?: CSSProperties;
  /** Fires once, as the card finishes revealing. */
  onReveal?: () => void;
}

const DEFAULT_COLORS = ['#f2c879', '#f0a58b', '#d97aa0', '#a68cd6'];

type Point = { x: number; y: number };

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** Greedy word wrap, for the label printed on the coating. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Paints the foil: a gradient along `angle`, a diagonal sheen, speckle, a
 * dashed ticket border and the printed label. Sizes the bitmap to the canvas's
 * CSS box (up to 2x), which also clears any earlier scratching. Runs in an
 * effect only, so Math.random here can't cause a hydration mismatch. */
function paintCoating(canvas: HTMLCanvasElement, colors: string[], angle: number, label: string) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // A CSS-style gradient line: its length is the box's projection on the angle.
  const theta = (angle * Math.PI) / 180;
  const dx = Math.sin(theta);
  const dy = -Math.cos(theta);
  const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
  const fill = ctx.createLinearGradient(
    width / 2 - dx * half,
    height / 2 - dy * half,
    width / 2 + dx * half,
    height / 2 + dy * half,
  );
  colors.forEach((c, i) => fill.addColorStop(colors.length === 1 ? 0 : i / (colors.length - 1), c));
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, width, height);

  const sheen = ctx.createLinearGradient(0, 0, width, height);
  sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.34)');
  sheen.addColorStop(0.65, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < Math.round((width * height) / 260); i++) {
    ctx.fillStyle = Math.random() < 0.7 ? 'rgba(255,255,255,0.38)' : 'rgba(80,30,60,0.1)';
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 0.3 + Math.random() * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.strokeRect(12.5, 12.5, width - 25, height - 25);
  ctx.setLineDash([]);

  const size = Math.max(15, Math.min(22, width / 16));
  ctx.font = `700 ${size}px ${getComputedStyle(canvas).fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // letterSpacing isn't in every engine; where it is, it makes the print feel set in type.
  if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = '2px';

  const lines = wrap(ctx, label.toUpperCase(), width - 64);
  const lineHeight = size * 1.5;
  const top = height / 2 - ((lines.length - 1) * lineHeight) / 2;

  ctx.shadowColor = 'rgba(90,30,60,0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  lines.forEach((l, i) => ctx.fillText(l, width / 2, top + i * lineHeight));
  sparkle(ctx, width / 2, top - size * 1.7, 10);
  sparkle(ctx, width * 0.18, height * 0.28, 5);
  sparkle(ctx, width * 0.84, height * 0.72, 6);
}

/** Share of the coating that's been scratched clear, sampled on a coarse grid. */
function clearedShare(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || !canvas.width || !canvas.height) return 0;
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const step = 12;
  let cleared = 0;
  let total = 0;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      total++;
      if (data[(y * canvas.width + x) * 4 + 3] < 40) cleared++;
    }
  }
  return cleared / total;
}

/**
 * A scratch-off card: a gradient foil over whatever you pass as children.
 * Drag a finger or the mouse across it to scratch; once `revealAt` of the foil
 * is gone the rest dissolves and `onReveal` fires. The hidden content is real
 * DOM under the foil, and a button that only appears on keyboard focus
 * reveals it too, so nothing is locked behind a pointer gesture.
 *
 * Invite layer; no Framer Motion — the coating is a canvas and the fade-out
 * is a CSS transition.
 */
export function ScratchCard({
  children,
  label = 'Scratch to reveal details',
  colors = DEFAULT_COLORS,
  angle = 135,
  brushSize = 40,
  revealAt = 0.5,
  revealLabel = 'Reveal details',
  className = '',
  style,
  onReveal,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'covered' | 'fading' | 'revealed'>('covered');

  const drawing = useRef(false);
  const scratched = useRef(false);
  const done = useRef(false);
  const last = useRef<Point>({ x: 0, y: 0 });
  const lastCheck = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  });
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A string key, not the array: callers pass a fresh array every render, and
  // repainting would wipe the player's scratches.
  const colorKey = colors.join('|');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== 'covered') return;
    const palette = colorKey.split('|');
    const draw = () => {
      if (!scratched.current) paintCoating(canvas, palette, angle, label);
    };
    draw();
    document.fonts?.ready.then(draw);
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [colorKey, angle, label, phase]);

  function reveal() {
    if (done.current) return;
    done.current = true;
    setPhase('fading');
    onRevealRef.current?.();
    timer.current = window.setTimeout(() => setPhase('revealed'), 600);
  }

  function point(e: PointerEvent<HTMLCanvasElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function erase(from: Point, to: Point) {
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y);
    ctx.stroke();
  }

  function check(force: boolean) {
    const canvas = canvasRef.current;
    if (!canvas || done.current) return;
    const now = performance.now();
    if (!force && now - lastCheck.current < 150) return;
    lastCheck.current = now;
    if (clearedShare(canvas) >= revealAt) reveal();
  }

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    scratched.current = true;
    last.current = point(e);
    erase(last.current, last.current);
  }

  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const next = point(e);
    erase(last.current, next);
    last.current = next;
    check(false);
  }

  function onPointerEnd() {
    if (!drawing.current) return;
    drawing.current = false;
    check(true);
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {children}

      {phase !== 'revealed' && (
        <>
          <canvas
            ref={canvasRef}
            aria-hidden
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            style={{ fontFamily: 'var(--font-display)' }}
            // touch-none: a finger on the card scratches instead of scrolling the page.
            className={`absolute inset-[0] h-full w-full cursor-pointer touch-none transition-opacity duration-500 motion-reduce:transition-none ${
              phase === 'fading' ? 'pointer-events-none opacity-0' : ''
            }`}
          />
          {phase === 'covered' && (
            <button
              type="button"
              onClick={reveal}
              className="label sr-only rounded-pill bg-surface-raised px-3 py-1 text-ink-strong shadow-md focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
            >
              {revealLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
