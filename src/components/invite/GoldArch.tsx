import type { ReactNode } from 'react';

// A metallic gold for the frame, tinted by `gold` at its edges.
const goldLeaf = (g: string) => `linear-gradient(135deg, ${g} 0%, #f1d87a 28%, ${g} 52%, #a9791a 78%, ${g} 100%)`;

export interface GoldArchProps {
  /** The gold at the frame's edges. */
  gold?: string;
  /** The frame's shape: any CSS aspect-ratio ("5 / 7" for a portrait). */
  aspect?: string;
  /** Put the width here ("w-[68%] max-w-[240px]"); the frame keeps its shape. */
  className?: string;
  /** What is inside: it fills the picture area, which clips to the arch (so give it `absolute inset-[0]` or `h-full w-full`) and is `relative`. */
  children: ReactNode;
}

/**
 * An arch of gold — a semicircle on two straight sides — with a thin cream mat inside the metal and a soft
 * shadow under it, round whatever is put in it (a portrait, a painting). The shared frame of every picture in a
 * template, so they all look alike.
 */
export function GoldArch({ gold = '#d4a62a', aspect = '5 / 7', className = '', children }: GoldArchProps) {
  return (
    <div
      className={`relative mx-auto rounded-t-pill p-[5px] shadow-[0_14px_30px_rgba(20,50,80,0.22)] ${className}`}
      style={{ aspectRatio: aspect, background: goldLeaf(gold) }}
    >
      <div className="h-full rounded-t-pill bg-[#fffaf0] p-[4px]">
        <div className="relative h-full overflow-hidden rounded-t-pill bg-[#eaf3fa]">{children}</div>
      </div>
    </div>
  );
}
