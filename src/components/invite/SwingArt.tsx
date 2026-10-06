import type { ReactNode } from 'react';

/**
 * Rocks its children forward and back, like a swing hanging from the top edge
 * of the picture (the loop is .amb-swing-depth in motion.css). It fills the
 * positioned box it sits in, so put an `Image fill` inside it.
 *
 * The perspective on the outer layer is what turns the tilt into depth, and the
 * loop has a layer of its own so it never fights a Framer reveal's
 * transform/opacity on the element around it.
 */
export function SwingArt({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-[0] [perspective:700px]">
      <div className="amb-swing-depth absolute inset-[0]">{children}</div>
    </div>
  );
}
