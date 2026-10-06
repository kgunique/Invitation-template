import { TRADITIONS } from '@/content/traditions';
import { SectionHeading } from './SectionHeading';
import { SparkleIcon } from './icons';

export function Traditions() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          eyebrow={
            <>
              <SparkleIcon /> Traditions
            </>
          }
          title="Every tradition, one platform"
          subtitle="Templates vary by tradition, never by occasion. This list drives the gallery filter."
        />
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {TRADITIONS.map((t) => (
            <li key={t.id} className="rounded-pill bg-surface-sunken px-4 py-2 body-sm text-ink-body">
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
