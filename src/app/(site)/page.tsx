import { Features } from '@/components/site/Features';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { HowItWorks } from '@/components/site/HowItWorks';
import { Reviews } from '@/components/site/Reviews';
import { Templates } from '@/components/site/Templates';
import { Testimonials } from '@/components/site/Testimonials';
import { Traditions } from '@/components/site/Traditions';
import { featuredTemplates } from '@/content/templateCatalog';

/**
 * Structure only borrows from the reference: eyebrow/heading pattern, dual
 * hero CTA, phone showcase, template/testimonial/review/feature/step rows,
 * dark footer. Copy, palette, font and mock content are ours throughout.
 * Nothing here is wired up yet — no nav destinations, no real carousel, no
 * real invite/review data.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      {/* <Traditions /> */}
      <Templates templates={featuredTemplates()} />
      <Testimonials />
      <Reviews />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
