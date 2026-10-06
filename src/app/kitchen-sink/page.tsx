import tokens from '@/styles/tokens.json';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/TierBadge';
import { Field } from '@/components/ui/Field';
import { WhatsAppIcon } from '@/components/site/icons';
import { TIERS, TRADITIONS } from '@/content/traditions';

export const metadata = { title: 'Kitchen sink' };

/**
 * Every token and component on one page. This is the visual-regression surface
 * for the whole build — if something drifts, it shows here first.
 */
export default function KitchenSink() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-16">
      <h1 className="display-xl">Kitchen sink</h1>
      <p className="body mt-3 text-ink-body">
        {tokens.color.tokens.length} colour tokens across {tokens.color.themes.length} themes. Toggle
        your OS between light and dark to check both.
      </p>

      <h2 className="display-lg mt-16">Colour</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tokens.color.tokens.map((t) => (
          <div key={t.name} className="rounded-md bg-surface-raised p-3 shadow-sm">
            <div
              className="h-12 w-full rounded-sm border border-line-soft"
              style={{ background: `var(--${t.name})` }}
            />
            <p className="caption mt-2 text-ink-strong">{t.name}</p>
          </div>
        ))}
      </div>

      <h2 className="display-lg mt-16">Type</h2>
      <div className="mt-5 flex flex-col gap-5">
        {tokens.type.groups.flatMap((g) =>
          g.styles.map((s) => (
            <div key={s.name} className="border-b border-line-soft pb-4">
              <p className="caption text-ink-muted">
                {s.name} · {s.fontSize}
              </p>
              <p className={`${s.name} mt-1 text-ink-strong`}>
                {'sample' in s && s.sample ? s.sample : 'Priya & Akshar'}
              </p>
            </div>
          ))
        )}
      </div>

      <h2 className="display-lg mt-16">Buttons</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="primary">Explore templates</Button>
        <Button variant="accent">Order this design</Button>
        <Button variant="ghost">Preview</Button>
        <Button variant="order">
          <WhatsAppIcon /> Order on WhatsApp
        </Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
      </div>

      <h2 className="display-lg mt-16">Tiers</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {TIERS.map((t) => (
          <TierBadge key={t.id} tier={t.id} />
        ))}
      </div>

      <h2 className="display-lg mt-16">Traditions</h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {TRADITIONS.map((t) => (
          <li key={t.id} className="rounded-pill bg-surface-sunken px-4 py-2 body-sm">
            {t.name} · <span className="text-ink-muted">{t.ceremony}</span>
          </li>
        ))}
      </ul>

      <h2 className="display-lg mt-16">Fields</h2>
      <div className="mt-5 flex max-w-[340px] flex-col gap-6">
        <Field id="ks-name" label="Guest name" required defaultValue="Meera Raghunathan" help="As it should appear on the wishes wall." />
        <Field id="ks-phone" label="Mobile number" required inputMode="numeric" defaultValue="93273" error="Enter a 10-digit mobile number." />
      </div>

      <h2 className="display-lg mt-16">Elevation</h2>
      <div className="mt-5 flex flex-wrap gap-5">
        {tokens.shadow.tokens.map((s) => (
          <div key={s.name} className="rounded-lg bg-surface-raised p-5" style={{ boxShadow: `var(--${s.name})` }}>
            <p className="caption text-ink-strong">{s.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
