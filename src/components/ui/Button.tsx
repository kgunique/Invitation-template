import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'ghost' | 'order';
type Size = 'md' | 'sm';

const VARIANTS: Record<Variant, string> = {
  // Marigold is a light hue: it always takes the plum ink, never white.
  primary: 'bg-surface-brand text-ink-on-brand shadow-sm hover:shadow-glow',
  accent: 'bg-surface-accent text-ink-on-accent',
  ghost: 'bg-transparent text-ink-strong shadow-[inset_0_0_0_1.5px_var(--line-firm)]',
  // Not WhatsApp's brand green — mehendi reads as the same affordance and is ours.
  order: 'bg-mehendi-500 text-[#fffaf4]',
};

// md keeps the 44px accessible tap-target minimum; sm is for tighter spots
// like a card footer, where a full-size CTA reads as oversized.
const SIZES: Record<Size, string> = {
  md: 'min-h-[44px] px-5 py-3',
  sm: 'min-h-[38px] px-4 py-2',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`action inline-flex items-center justify-center gap-2 rounded-pill transition-shadow disabled:cursor-not-allowed disabled:opacity-45 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
