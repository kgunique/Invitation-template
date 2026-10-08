'use client';

import Link from 'next/link';
import { useState } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import type { TemplateListing } from '@/content/templateCatalog';
import { ComingSoon } from './ComingSoon';
import { SectionHeading } from './SectionHeading';
import { TemplateCard } from './TemplateCard';
import { ArrowRightIcon, SparkleIcon } from './icons';

const CATEGORIES = [
  { id: 'wedding', label: 'Wedding Invitations' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'engagement', label: 'Engagement' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

/** Birthday and Engagement are inert placeholders, requested as a one-off UI
 * exception — this product is weddings only (see README). Nothing behind
 * them is real, and this isn't a category expansion of the actual product.
 * Shows only the featured few (the catalog flags them); every template is on /templates. */
export function Templates({ templates }: { templates: TemplateListing[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('wedding');

  return (
    <div className="relative overflow-hidden">
      {/* <FloralCorners corner="both" /> */}

      <section className="relative z-content py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          eyebrow={
            <>
              <SparkleIcon /> Our collection
            </>
          }
          title="Featured invitation designs"
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex gap-1 rounded-pill border border-[color-mix(in_srgb,var(--line-soft)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_50%,transparent)] p-1 shadow-md backdrop-blur-md">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-current={activeCategory === cat.id}
                className={`action rounded-pill px-5 py-2 transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-surface-brand text-ink-on-brand shadow-sm'
                    : 'text-ink-body hover:text-ink-strong'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {activeCategory === 'wedding' ? (
          <>
            <p className="body mt-6 text-center text-ink-body">
              A sample across tiers and traditions. Every design is in the full collection.
            </p>

            <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible xl:grid-cols-4 lg:pb-[0]">
              {templates.map((t) => (
                <TemplateCard key={t.id} listing={t} className="w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-auto" />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/templates" className={buttonClasses('primary')}>
                Explore all templates <ArrowRightIcon />
              </Link>
            </div>
          </>
        ) : (
          <ComingSoon title={`${CATEGORIES.find((c) => c.id === activeCategory)!.label} templates are coming soon`} />
        )}
      </div>
      </section>
    </div>
  );
}

