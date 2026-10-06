import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { AppLoader } from '@/components/layout/AppLoader';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Get Invites',
    template: '%s | Get Invites',
  },
  description: 'Interactive digital wedding invitations for Indian weddings.',
};

export const viewport: Viewport = {
  themeColor: '#f2a007',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AppLoader>{children}</AppLoader>
      </body>
    </html>
  );
}
