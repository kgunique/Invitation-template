'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { whatsappContactUrl } from '@/content/site';
import { CheckIcon, WhatsAppIcon } from './icons';

const SUBJECTS = ['Enquiry about a template', 'Customisation request', 'Pricing and add-ons', 'Something else'] as const;
const NO_TEMPLATE = 'Not sure yet — help me choose';

const CONTROL =
  'body w-full rounded-sm border-[1.5px] border-line-firm bg-surface-raised px-3 py-3 text-ink-strong';

/** The label markup `Field` has, for the controls it does not cover (a select and a textarea). */
function Labeled({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label uppercase text-ink-strong">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * The /contact form. There is no backend, so "Send message" opens WhatsApp with the message already
 * written (see `whatsappContactUrl`); the visitor sends it from there. `templates` are the names
 * for the "Which template?" list.
 */
export function ContactForm({ templates }: { templates: string[] }) {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? '').trim();
    const template = get('template');
    window.open(
      whatsappContactUrl({
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        subject: get('subject'),
        template: template === NO_TEMPLATE ? undefined : template,
        message: get('message'),
      }),
      '_blank',
      'noopener,noreferrer',
    );
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-surface-raised p-6 shadow-md sm:p-8">
      <h2 className="display-md text-ink-strong">Send us a message</h2>
      <p className="caption mt-1 text-ink-muted">All fields except the message are required.</p>

      <div className="mt-6 flex flex-col gap-5">
        <Field id="contact-name" name="name" label="Full name" required autoComplete="name" placeholder="Your name" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="contact-email"
            name="email"
            type="email"
            label="Email address"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Field
            id="contact-phone"
            name="phone"
            type="tel"
            label="Phone number"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="Your phone number"
          />
        </div>

        <Labeled id="contact-subject" label="Subject">
          <select id="contact-subject" name="subject" className={CONTROL} defaultValue={SUBJECTS[0]}>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Labeled>

        <Labeled id="contact-template" label="Which template?">
          <select id="contact-template" name="template" className={CONTROL} defaultValue={NO_TEMPLATE}>
            <option>{NO_TEMPLATE}</option>
            {templates.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Labeled>

        <Labeled id="contact-message" label="Your message">
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            className={`${CONTROL} resize-y`}
            placeholder="Tell us about your wedding, the date, anything you would like changed…"
          />
        </Labeled>

        <Button type="submit" variant="order" className="w-full">
          <WhatsAppIcon /> Send message
        </Button>
        <p className="caption text-center text-ink-muted" aria-live="polite">
          {sent ? (
            <span className="inline-flex items-center gap-1 text-mehendi-700">
              <CheckIcon /> WhatsApp opened with your message — press send there and we will reply.
            </span>
          ) : (
            'This opens WhatsApp with your message ready to send. Your details go only to us.'
          )}
        </p>
      </div>
    </form>
  );
}
