import { MotionProvider } from '@/components/motion/MotionProvider';

/**
 * Invitation layer. The MotionProvider is mounted HERE and not in the root
 * layout on purpose: the marketing site gets no Framer Motion in its bundle.
 */
export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
