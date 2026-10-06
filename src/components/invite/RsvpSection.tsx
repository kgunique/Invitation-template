'use client';

import type { FormEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import type { InviteEvent, InviteRsvp } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { formatDay } from './dates';
import { GoldDivider } from './GoldDivider';
import { ChatIcon } from './icons';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const DEFAULT_CONFETTI = ['#f2c879', '#e8590c', '#d97aa0', '#a68cd6'];

const ANSWERS = [
  { id: 'yes', icon: '🎉', title: "Yes, we'll be there", hint: 'Joyfully accepting' },
  { id: 'maybe', icon: '🤔', title: 'Maybe, not sure yet', hint: "We'll confirm before the date" },
  { id: 'no', icon: '💌', title: "Sorry, can't make it", hint: 'Sending love and blessings' },
] as const;

const MEALS = [
  { id: 'veg', label: 'Vegetarian' },
  { id: 'jain', label: 'Jain' },
  { id: 'vegan', label: 'Vegan' },
] as const;

type Answer = (typeof ANSWERS)[number]['id'];
type Meal = (typeof MEALS)[number]['id'];
interface Sent {
  url: string;
  answer: Answer;
  name: string;
  /** Plus members: guests beyond the person replying. */
  guests: number;
  events: string[];
  meal: string;
  note: string;
}

const guestsLabel = (n: number) => `${n} ${n === 1 ? 'guest' : 'guests'}`;

const CORNERS = [
  'left-3 top-3 border-l-2 border-t-2 rounded-tl-lg',
  'right-3 top-3 border-r-2 border-t-2 rounded-tr-lg',
  'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
  'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg',
] as const;

const mix = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;
const GOLD = 'var(--invite-metal)';

const group = lineGroup(0.2);

const eventKey = (e: InviteEvent) => `${e.startsAt}|${e.title}`;

/** The reply, written out as the WhatsApp message the guest will send. */
function buildMessage(s: Omit<Sent, 'url'>, couple: string) {
  const reply = { yes: 'Joyfully attending', maybe: 'Maybe, will confirm', no: 'Unable to attend' }[s.answer];
  const lines = [`RSVP for ${couple}'s wedding 💌`, '', `Name: ${s.name}`, `Reply: ${reply}`];
  if (s.answer !== 'no') {
    lines.push(`Attending: ${s.guests + 1} (${s.name}${s.guests ? ` + ${guestsLabel(s.guests)}` : ''})`);
    if (s.events.length) lines.push(`Celebrations: ${s.events.join(', ')}`);
    lines.push(`Meal: ${s.meal}`);
  }
  if (s.note) lines.push(`Note: ${s.note}`);
  return lines.join('\n');
}

/** A radio or checkbox drawn as a card or pill. The real input stays in the
 * page (visually hidden), so keyboard, screen readers and arrow keys work. */
function Choice({
  type,
  name,
  checked,
  onChange,
  tone = 'gold',
  className = '',
  children,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  checked: boolean;
  onChange: () => void;
  tone?: 'gold' | 'danger';
  className?: string;
  children: ReactNode;
}) {
  const color = tone === 'danger' ? 'var(--signal-danger)' : GOLD;
  return (
    <label className="relative block cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`block border-[1.5px] transition-colors peer-focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--invite-metal)_45%,transparent)] ${className}`}
        style={{
          borderColor: checked ? mix(color, 85) : 'var(--line-firm)',
          background: checked ? mix(color, 12) : 'var(--surface-raised)',
        }}
      >
        {children}
      </span>
    </label>
  );
}

/** Height-and-fade collapse, for the parts of the form a "no" doesn't need. */
function Collapse({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE.standard }}
          className="-mx-1 overflow-hidden px-1"
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="display-md flex h-[40px] w-[40px] items-center justify-center rounded-pill border-[1.5px] border-[var(--invite-metal)] pb-1 text-invite-metal transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="caption w-[72px] shrink-0 pt-[2px] font-bold uppercase tracking-[0.06em] text-invite-metal">
        {label}
      </dt>
      <dd className="body-sm min-w-0 text-ink-body">{children}</dd>
    </div>
  );
}

export interface RsvpSectionProps {
  rsvp: InviteRsvp;
  bride: string;
  groom: string;
  /** Offered as "which celebrations will you join?". Omit and that question is skipped. */
  events?: InviteEvent[];
  /** IANA zone the reply-by date is shown in. */
  timeZone?: string;
  /** The heading, one entry per line. */
  heading?: string[];
  /** The sentence under the heading. */
  intro?: string;
  /** Start with just a button under the heading (this label); the form opens when it is tapped. Omit to show the form straight away. */
  ctaLabel?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own sky. */
  background?: string;
  /** Palette for the heading, the card, the inputs and the errors. Defaults to the Silver cream/plum. */
  colors?: Partial<SectionColors>;
  /** The petals that shower on a "yes". */
  confetti?: string[];
}

/**
 * RSVP: will you come, how many plus members are you bringing, which
 * celebrations, meal preference, a note. "No" folds away everything but the
 * note. Submitting opens WhatsApp with the reply written out
 * for the guest to send, then the card turns into a thank-you with a summary
 * (and a petal shower for a yes). There's no backend yet — a reply reaches the
 * hosts only when the guest sends that message, and the card says so.
 *
 * Heading, intro, palette, background and confetti are props, and `ctaLabel`
 * turns the form into a button-first section, so it fits a cream page (Silver)
 * or a night sky (Gold) without a copy.
 */
export function RsvpSection({
  rsvp,
  bride,
  groom,
  events = [],
  timeZone = 'Asia/Kolkata',
  heading = ['Will You', 'Join Us?'],
  intro = 'Tell us who is coming, so we can set a place for everyone.',
  ctaLabel,
  background = 'transparent',
  colors,
  confetti = DEFAULT_CONFETTI,
}: RsvpSectionProps) {
  const max = rsvp.maxPlusMembers ?? 5;
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(!ctaLabel);

  const [name, setName] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [guests, setGuests] = useState(0);
  const [picked, setPicked] = useState<string[]>(() => events.map(eventKey));
  const [meal, setMeal] = useState<Meal>('veg');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Sent | null>(null);

  const attending = answer !== null && answer !== 'no';
  const clearError = (key: string) => setErrors(({ [key]: _, ...rest }) => rest);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please tell us your name.';
    if (!answer) next.answer = 'Please choose one, so we know what to plan.';
    if (answer === 'yes' && events.length && !picked.length) next.events = 'Pick at least one celebration.';
    setErrors(next);

    if (Object.keys(next).length || !answer) {
      // Wait a frame so the error text is in the DOM, then bring the first one into view.
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-error]');
        first?.scrollIntoView({ block: 'center' });
        if (first instanceof HTMLInputElement) first.focus({ preventScroll: true });
      });
      return;
    }

    const reply: Omit<Sent, 'url'> = {
      answer,
      name: name.trim(),
      guests: attending ? guests : 0,
      events: attending ? events.filter((ev) => picked.includes(eventKey(ev))).map((ev) => ev.title) : [],
      meal: MEALS.find((o) => o.id === meal)!.label,
      note: note.trim(),
    };
    const text = buildMessage(reply, `${bride} & ${groom}`);
    const url = `https://wa.me/${rsvp.whatsapp}?text=${encodeURIComponent(text)}`;
    setSent({ ...reply, url });
    // Straight from the tap, so it isn't treated as a pop-up. If it is blocked
    // anyway, the thank-you card has the same link.
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const first = sent?.name.split(' ')[0];

  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-16 pt-16">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto w-full max-w-[420px]"
      >
        <div className="text-center">
          {rsvp.replyBy && (
            <m.p variants={fadeUp} className="label uppercase text-invite-metal">
              Kindly reply by {formatDay(rsvp.replyBy, timeZone)}
            </m.p>
          )}
          <div className="mt-3">
            {heading.map((line) => (
              <RevealLine key={line} className="display-xl text-invite-ink">
                {line}
              </RevealLine>
            ))}
          </div>
          <m.p variants={fadeUp} className="body-sm mx-auto mt-3 max-w-[30ch] text-ink-body">
            {intro}
          </m.p>
          <GoldDivider className="mt-6" />
        </div>

        {ctaLabel && !open && (
          <m.div variants={fadeUp} className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="action rounded-pill border border-[color-mix(in_srgb,var(--invite-metal)_40%,transparent)] bg-[color-mix(in_srgb,var(--invite-ink)_6%,transparent)] px-8 py-4 uppercase tracking-[0.18em] text-invite-metal"
            >
              {ctaLabel}
            </button>
          </m.div>
        )}

        {open && (
        <m.div
          variants={fadeUp}
          // Opened from the button: it mounts after the section's own reveal has
          // played, so it brings its own entrance rather than waiting for one.
          {...(ctaLabel
            ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: DURATION.slow, ease: EASE.entrance } }
            : {})}
          className="relative mt-10 rounded-[24px] border-[1.5px] bg-surface-raised p-6 shadow-md"
          style={{ borderColor: mix(GOLD, 45) }}
        >
          {CORNERS.map((corner) => (
            <span
              key={corner}
              aria-hidden
              className={`pointer-events-none absolute h-[22px] w-[22px] border-[color-mix(in_srgb,var(--invite-metal)_55%,transparent)] ${corner}`}
            />
          ))}

          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <m.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.slow, ease: EASE.entrance }}
                className="relative py-2 text-center"
              >
                {sent.answer === 'yes' && <Petals color={confetti} count={18} speed={2} loop={false} />}

                <m.svg
                  viewBox="0 0 64 64"
                  aria-hidden
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto h-[64px] w-[64px]"
                >
                  <m.circle
                    cx="32"
                    cy="32"
                    r="29"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: EASE.entrance }}
                  />
                  <m.path
                    d="M20 33l8 8 16-17"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: EASE.entrance }}
                  />
                </m.svg>

                <p className="display-lg mt-5 text-invite-ink">
                  {sent.answer === 'no' ? `We'll miss you, ${first}` : `Thank you, ${first}!`}
                </p>
                <p className="body-sm mx-auto mt-2 max-w-[32ch] text-ink-body">
                  Your reply reaches {bride} &amp; {groom}&apos;s family once you press send in WhatsApp.
                </p>

                <dl className="mt-6 space-y-3 border-t pt-5 text-left" style={{ borderColor: mix(GOLD, 30) }}>
                  <SummaryRow label="Reply">
                    {ANSWERS.find((a) => a.id === sent.answer)!.title}
                  </SummaryRow>
                  {sent.answer !== 'no' && (
                    <SummaryRow label="Party">
                      {sent.guests + 1} attending ({sent.name}
                      {sent.guests > 0 && ` + ${guestsLabel(sent.guests)}`})
                    </SummaryRow>
                  )}
                  {sent.events.length > 0 && <SummaryRow label="Events">{sent.events.join(', ')}</SummaryRow>}
                  {sent.answer !== 'no' && <SummaryRow label="Meal">{sent.meal}</SummaryRow>}
                  {sent.note && <SummaryRow label="Note">{sent.note}</SummaryRow>}
                </dl>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={sent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill bg-mehendi-500 px-5 py-3 text-[#fffaf4]"
                  >
                    <ChatIcon /> Open WhatsApp again
                  </a>
                  <Button type="button" variant="ghost" onClick={() => setSent(null)}>
                    Edit my reply
                  </Button>
                </div>
              </m.div>
            ) : (
              <m.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.base }}
                className="relative"
              >
                <Field
                  id="rsvp-name"
                  label="Your name"
                  required
                  autoComplete="name"
                  maxLength={60}
                  placeholder="e.g. Rohan Mehta"
                  value={name}
                  error={errors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                />

                <fieldset className="mt-8 min-w-0">
                  <legend className="label mb-3 uppercase text-ink-strong">Will you celebrate with us?</legend>
                  <div className="space-y-3">
                    {ANSWERS.map((a) => (
                      <Choice
                        key={a.id}
                        type="radio"
                        name="rsvp-answer"
                        checked={answer === a.id}
                        tone={a.id === 'no' ? 'danger' : 'gold'}
                        onChange={() => {
                          setAnswer(a.id);
                          clearError('answer');
                        }}
                        className="flex items-center gap-3 rounded-[16px] px-4 py-3"
                      >
                        <span
                          aria-hidden
                          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-pill text-[20px] leading-none"
                          style={{ background: mix(a.id === 'no' ? 'var(--signal-danger)' : GOLD, 14) }}
                        >
                          {a.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="body block font-bold text-invite-ink">{a.title}</span>
                          <span className="caption block text-ink-muted">{a.hint}</span>
                        </span>
                        <span
                          aria-hidden
                          className="display-md w-[20px] text-center leading-none text-invite-metal"
                          style={{ opacity: answer === a.id ? 1 : 0 }}
                        >
                          ✓
                        </span>
                      </Choice>
                    ))}
                  </div>
                  {errors.answer && (
                    <p role="alert" data-error className="caption mt-2 text-signal-danger">
                      {errors.answer}
                    </p>
                  )}
                </fieldset>

                <Collapse show={attending}>
                  <div className="space-y-8 pt-8">
                    <div>
                      <p className="label uppercase text-ink-strong">Plus members</p>
                      <p className="body-sm mt-1 text-ink-body">
                        Bringing family or friends? Add them here, up to {max} more.
                      </p>

                      <div
                        className="mt-4 flex items-center justify-between gap-3 rounded-[16px] border-[1.5px] px-4 py-3"
                        style={{ borderColor: 'var(--line-firm)' }}
                      >
                        <div aria-live="polite">
                          <p className="body font-bold text-invite-ink">
                            {guests ? `Me + ${guestsLabel(guests)}` : 'Just me'}
                          </p>
                          <p className="caption text-ink-muted">{guests + 1} attending in total</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StepButton label="Remove a plus member" disabled={!guests} onClick={() => setGuests((n) => n - 1)}>
                            −
                          </StepButton>
                          <span className="display-md tabular w-[24px] text-center text-invite-ink">{guests}</span>
                          <StepButton label="Add a plus member" disabled={guests >= max} onClick={() => setGuests((n) => n + 1)}>
                            +
                          </StepButton>
                        </div>
                      </div>
                    </div>

                    {events.length > 0 && (
                      <fieldset className="min-w-0">
                        <legend className="label mb-1 uppercase text-ink-strong">Which celebrations?</legend>
                        <p className="body-sm mb-3 text-ink-body">Tick every one your party will join.</p>
                        <div className="flex flex-wrap gap-2">
                          {events.map((ev) => (
                            <Choice
                              key={eventKey(ev)}
                              type="checkbox"
                              name="rsvp-events"
                              checked={picked.includes(eventKey(ev))}
                              onChange={() => {
                                setPicked((all) =>
                                  all.includes(eventKey(ev)) ? all.filter((k) => k !== eventKey(ev)) : [...all, eventKey(ev)],
                                );
                                clearError('events');
                              }}
                              className="body-sm rounded-pill px-4 py-2 text-ink-body"
                            >
                              {ev.title}
                              <span className="caption ml-1 text-ink-muted">
                                · {formatDay(ev.startsAt, timeZone, 'short').replace(/,\s*\d{4}$/, '')}
                              </span>
                            </Choice>
                          ))}
                        </div>
                        {errors.events && (
                          <p role="alert" data-error className="caption mt-2 text-signal-danger">
                            {errors.events}
                          </p>
                        )}
                      </fieldset>
                    )}

                    <fieldset className="min-w-0">
                      <legend className="label mb-3 uppercase text-ink-strong">Meal preference</legend>
                      <div className="flex flex-wrap gap-2">
                        {MEALS.map((o) => (
                          <Choice
                            key={o.id}
                            type="radio"
                            name="rsvp-meal"
                            checked={meal === o.id}
                            onChange={() => setMeal(o.id)}
                            className="body-sm rounded-pill px-4 py-2 text-ink-body"
                          >
                            {o.label}
                          </Choice>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </Collapse>

                <div className="mt-8 flex flex-col gap-2">
                  <label htmlFor="rsvp-note" className="label uppercase text-ink-strong">
                    A note for the couple
                    <span className="caption ml-2 font-normal normal-case text-ink-muted">Optional</span>
                  </label>
                  <textarea
                    id="rsvp-note"
                    rows={3}
                    maxLength={280}
                    placeholder="Blessings, dietary needs, anything we should know"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="body w-full resize-none rounded-sm border-[1.5px] border-line-firm bg-surface-raised px-3 py-3 text-ink-strong"
                  />
                </div>

                <Button type="submit" variant="order" className="mt-8 w-full">
                  Submit RSVP
                </Button>
                <p className="caption mt-3 text-center text-ink-muted">
                  This opens WhatsApp with your reply written out, ready for you to send.
                </p>
              </m.form>
            )}
          </AnimatePresence>
        </m.div>
        )}
      </m.div>
    </section>
  );
}
