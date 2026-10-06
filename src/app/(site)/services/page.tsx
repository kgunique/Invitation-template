import type { Metadata } from 'next';
import { Addons } from '@/components/site/Addons';
import { CtaBand } from '@/components/site/CtaBand';
import { Features } from '@/components/site/Features';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { HowItWorks } from '@/components/site/HowItWorks';

export const metadata: Metadata = {
  title: 'Services & Add-ons',
  description: 'What every Get Invites invitation includes, and the extras you can add.',
};

/** What an invitation includes (the same list as the home page's), the optional add-ons, how ordering works. */
export default function ServicesPage() {
  return (
    <>
      <Header />
      <Features
        as="h1"
        eyebrow="Services & Add-ons"
        title="Everything your invitation includes"
        subtitle="Every service is part of the invitation, and a few extras you can add if you need them."
      />
      <Addons />
      <HowItWorks />
      <CtaBand />
      <Footer />
    </>
  );
}
