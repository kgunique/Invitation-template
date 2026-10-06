import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ContactForm } from '@/components/site/ContactForm';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ChatIcon, ClockIcon, MailIcon, MobileIcon, PhoneIcon, WhatsAppIcon } from '@/components/site/icons';
import { CONTACT, ORDER_WHATSAPP, whatsappEnquiryUrl } from '@/content/site';
import { allTemplates } from '@/content/templateCatalog';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Questions, or ready to order? Message the Get Invites team.',
};

const NEXT_STEPS = [
  'We read your message and reply on WhatsApp.',
  'We share designs, pricing and any add-ons you asked about.',
  'You send your details and we start designing.',
  'Your live invitation is delivered within 24 hours.',
] as const;

const PROMISES = [
  { icon: <ClockIcon />, text: 'Delivered within 24 hours' },
  { icon: <MobileIcon />, text: 'Perfect on every phone' },
  { icon: <ChatIcon />, text: 'Shared as one WhatsApp link' },
] as const;

function InfoCard({ icon, label, href, children }: { icon: ReactNode; label: string; href?: string; children: ReactNode }) {
  const body = (
    <>
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-surface-sunken text-rani-700">
        {icon}
      </span>
      <span>
        <span className="label block uppercase text-ink-muted">{label}</span>
        <span className="body block break-words text-ink-strong">{children}</span>
      </span>
    </>
  );
  const cls = 'flex items-center gap-4 rounded-lg bg-surface-raised p-4 shadow-sm no-underline';
  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`${cls} transition-shadow hover:shadow-md`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:py-10">
        <SectionHeading
          as="h1"
          eyebrow={
            <>
              <ChatIcon /> Get in touch
            </>
          }
          title="Let's plan your invitation"
          subtitle="Have a question, or ready to order? Tell us about your wedding and we will get back to you."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="flex flex-col gap-4">
            <InfoCard icon={<MailIcon />} label="Email us" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </InfoCard>
            <InfoCard icon={<PhoneIcon />} label="Call us" href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </InfoCard>
            <InfoCard icon={<WhatsAppIcon />} label="WhatsApp" href={whatsappEnquiryUrl('your invitations')}>
              +{ORDER_WHATSAPP.slice(0, 2)} {ORDER_WHATSAPP.slice(2, 7)} {ORDER_WHATSAPP.slice(7)}
            </InfoCard>

            <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
              <p className="display-md text-ink-strong">What happens next?</p>
              <ol className="mt-4 flex flex-col gap-3">
                {NEXT_STEPS.map((s, i) => (
                  <li key={s} className="body-sm flex gap-3 text-ink-body">
                    <span className="tabular label text-marigold-700">{String(i + 1).padStart(2, '0')}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ContactForm templates={allTemplates().map((t) => t.name)} />
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PROMISES.map((p) => (
            <li key={p.text} className="body flex items-center gap-3 text-ink-body">
              <span className="text-marigold-700">{p.icon}</span>
              {p.text}
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </>
  );
}
