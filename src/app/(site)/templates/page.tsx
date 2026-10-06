import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/ComingSoon';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { TemplateCard } from '@/components/site/TemplateCard';
import { DEFAULT_CATEGORY, categoryLabel, resolveCategory } from '@/components/site/categories';
import { allTemplates } from '@/content/templateCatalog';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Every Get Invites invitation design, by occasion.',
};

/**
 * Every template that is built — new ones appear here as they are added to the registry (see
 * content/templateCatalog.ts). The category comes from `?c=` and is chosen in the header's menu: Wedding (the
 * default) lists the templates, every other category says "coming soon".
 */
export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const category = resolveCategory((await searchParams).c);

  return (
    <>
      <Header selected={category} />
      <section className="mx-auto max-w-[1200px] px-4 pb-20 pt-4 sm:pt-6">
        {category === DEFAULT_CATEGORY ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTemplates().map((t) => (
              <TemplateCard key={t.id} listing={t} />
            ))}
          </div>
        ) : (
          <ComingSoon title={`${categoryLabel(category)} is coming soon`} />
        )}
      </section>
      <Footer />
    </>
  );
}
