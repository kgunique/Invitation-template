'use client';

import type { FormEvent, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import type { InviteRsvp } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { formatDay } from './dates';
import { HangingKites, type HangingKitesColors } from './HangingKites';
import { ChatIcon, PhoneIcon, SendIcon, UserIcon, UsersIcon } from './icons';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const mix = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;
const group = lineGroup(0.15);

const ANSWERS = [
  { id: 'yes', label: 'Accepts with Pleasure' },
  { id: 'maybe', label: 'Maybe, will confirm' },
  { id: 'no', label: 'Regretfully Declines' },
] as const;
type Answer = (typeof ANSWERS)[number]['id'];

/** What a guest sent: the whole reply. */
export interface GuestReply {
  name: string;
  phone: string;
  answer: Answer;
  /** How many are coming in all, the guest included. 0 when the answer is no. */
  guests: number;
  blessing: string;
}

const DEFAULT_CONFETTI = ['#f5a623', '#e8791a', '#f8c850', '#c0392b'];

const fieldBox =
  'w-full rounded-[14px] border bg-[#fffaf0] px-4 text-[15px] text-ink-body outline-none transition-[box-shadow,border-color] placeholder:text-[color-mix(in_srgb,var(--ink-muted)_75%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--invite-metal)_30%,transparent)]';

function Label({ htmlFor, icon, children }: { htmlFor: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-invite-metal">
      {icon}
      {children}
    </label>
  );
}

export interface GuestRsvpProps {
  rsvp: InviteRsvp;
  bride: string;
  groom: string;
  /** IANA zone the reply-by date is shown in. */
  timeZone?: string;
  eyebrow?: string;
  title?: string;
  /** Called with the reply when a guest sends it. The hook for a backend: nothing else stores or delivers the reply. */
  onSubmit?: (reply: GuestReply) => void;
  /** The kites hanging in the top corners: colours, or `false` to leave them out. */
  kites?: false | Partial<HangingKitesColors>;
  /** The petals that shower on a yes. */
  confetti?: string[];
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own paper. */
  background?: string;
  /** Palette. */
  colors?: Partial<SectionColors>;
}

/**
 * "Guest RSVP": paper kites hanging at the top, a heading and a "kindly respond
 * by" pill, then a form in a card with a gold arched top — name, contact
 * number, attendance and the number of guests side by side, and a box for
 * blessings. One button, "Send blessings & RSVP": it checks the form first (and
 * says what is missing under the field), hands the reply to `onSubmit`, and the
 * card turns into a thank-you with the reply summarised (a shower of petals on
 * a yes) and a way to change it. There is no backend yet: until `onSubmit` is
 * wired to one, a reply goes nowhere. Palette, kites, background and wording are props.
 */
export function GuestRsvp({
  rsvp,
  bride,
  groom,
  timeZone = 'Asia/Kolkata',
  eyebrow = 'Your Presence is a Blessing',
  title = 'Guest RSVP',
  onSubmit,
  kites = {},
  confetti = DEFAULT_CONFETTI,
  background = 'transparent',
  colors,
}: GuestRsvpProps) {
  const uid = useId().replace(/:/g, '');
  const max = (rsvp.maxPlusMembers ?? 5) + 1;
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [answer, setAnswer] = useState<Answer>('yes');
  const [guests, setGuests] = useState(1);
  const [blessing, setBlessing] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<GuestReply | null>(null);
  const [burst, setBurst] = useState(false);

  const declining = answer === 'no';

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please tell us your name.';
    if (phone.replace(/\D/g, '').length < 8) next.phone = 'Please add a number we can reach you on.';
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        first?.scrollIntoView({ block: 'center' });
        first?.focus({ preventScroll: true });
      });
      return null;
    }
    return {
      name: name.trim(),
      phone: phone.trim(),
      answer,
      guests: declining ? 0 : Math.min(Math.max(guests, 1), max),
      blessing: blessing.trim(),
    };
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const reply = validate();
    if (!reply) return;
    onSubmit?.(reply);
    setSent(reply);
    if (reply.answer === 'yes') setBurst(true);
  }

  const err = (key: string) =>
    errors[key] ? (
      <p id={`${uid}-${key}-err`} role="alert" className="caption mt-1 text-signal-danger">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-16 pt-20">
      {kites && (
        <>
          <HangingKites colors={kites} className="absolute left-[2%] top-[0] w-[84px]" />
          <HangingKites mirror colors={kites} className="absolute right-[2%] top-[0] w-[84px]" />
        </>
      )}

      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto w-full max-w-[400px]"
      >
        <div className="flex flex-col items-center text-center">
          <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
            {eyebrow}
          </m.p>
          <div className="mt-3">
            <RevealLine className="invite-title italic text-invite-ink">{title}</RevealLine>
          </div>
          {rsvp.replyBy && (
            <m.p
              variants={fadeUp}
              className="caption mt-4 rounded-pill px-4 py-2 text-ink-body"
              style={{ background: mix(12) }}
            >
              Kindly respond by {formatDay(rsvp.replyBy, timeZone)}
            </m.p>
          )}
        </div>

        {/* The card: a gold rim, arched at the top. */}
        <m.div
          variants={fadeUp}
          className="mt-8 rounded-t-[56px] rounded-b-[26px] p-[1.5px] shadow-[0_18px_40px_rgba(90,60,20,0.18)]"
          style={{ background: 'linear-gradient(to bottom, #d9ae52, #e9d3a0 18%, rgba(233,211,160,0.6))' }}
        >
          <div className="rounded-t-[55px] rounded-b-[25px] px-6 pb-7 pt-10" style={{ background: 'var(--surface-raised)' }}>
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <m.div
                  key="sent"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.slow, ease: EASE.entrance }}
                  className="py-4 text-center"
                >
                  <p aria-hidden className="text-[44px] leading-none">
                    {sent.answer === 'no' ? '💌' : '🪔'}
                  </p>
                  <h3 className="display-lg mt-4 italic text-invite-ink">
                    {sent.answer === 'no' ? 'We will miss you' : 'Thank you'}, {sent.name.split(' ')[0]}!
                  </h3>
                  <p className="body-sm mx-auto mt-3 max-w-[28ch] text-ink-body">
                    {sent.answer === 'no'
                      ? 'Your blessings mean the world to us.'
                      : `Your reply is noted${sent.guests > 1 ? ` for ${sent.guests} guests` : ''}. We cannot wait to celebrate with you.`}
                  </p>
                  <dl className="mx-auto mt-5 max-w-[260px] space-y-2 text-left">
                    {[
                      ['Name', sent.name],
                      ['Contact', sent.phone],
                      ['Reply', ANSWERS.find((a) => a.id === sent.answer)!.label],
                      ...(sent.answer === 'no' ? [] : [['Guests', String(sent.guests)]]),
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <dt className="caption w-[64px] shrink-0 font-bold uppercase tracking-[0.08em] text-invite-metal">{k}</dt>
                        <dd className="body-sm min-w-0 break-words text-ink-body">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    onClick={() => setSent(null)}
                    className="caption mt-6 block w-full font-bold uppercase tracking-[0.14em] text-invite-metal underline underline-offset-4"
                  >
                    Change my reply
                  </button>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  ref={formRef}
                  onSubmit={submit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.base }}
                >
                  <div>
                    <Label htmlFor={`${uid}-name`} icon={<UserIcon className="h-[13px] w-[13px]" />}>
                      Guest Name
                    </Label>
                    <input
                      id={`${uid}-name`}
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(({ name: _, ...rest }) => rest);
                      }}
                      placeholder="Full Name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                      className={`${fieldBox} h-[48px]`}
                      style={{ borderColor: errors.name ? 'var(--signal-danger)' : mix(28) }}
                    />
                    {err('name')}
                  </div>

                  <div className="mt-5">
                    <Label htmlFor={`${uid}-phone`} icon={<PhoneIcon className="h-[13px] w-[13px]" />}>
                      Contact Number
                    </Label>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(({ phone: _, ...rest }) => rest);
                      }}
                      placeholder="Mobile No."
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                      className={`${fieldBox} h-[48px]`}
                      style={{ borderColor: errors.phone ? 'var(--signal-danger)' : mix(28) }}
                    />
                    {err('phone')}
                  </div>

                  <div className="mt-5 grid grid-cols-[1.2fr_1fr] items-end gap-3">
                    <div>
                      <Label htmlFor={`${uid}-answer`} icon={<span aria-hidden className="block h-[13px] w-[13px] text-[12px] leading-[13px]">✓</span>}>
                        Attendance
                      </Label>
                      <div className="relative">
                        <select
                          id={`${uid}-answer`}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value as Answer)}
                          className={`${fieldBox} h-[48px] appearance-none truncate pr-9`}
                          style={{ borderColor: mix(28) }}
                        >
                          {ANSWERS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="pointer-events-none absolute right-3 top-[50%] h-[16px] w-[16px] -translate-y-1/2 text-invite-metal"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`${uid}-guests`} icon={<UsersIcon className="h-[13px] w-[13px]" />}>
                        Guests Count
                      </Label>
                      <input
                        id={`${uid}-guests`}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={max}
                        disabled={declining}
                        value={declining ? '' : guests}
                        onChange={(e) => setGuests(Number(e.target.value) || 1)}
                        placeholder={declining ? '–' : '1'}
                        className={`${fieldBox} h-[48px] disabled:cursor-not-allowed disabled:opacity-50`}
                        style={{ borderColor: mix(28) }}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <Label htmlFor={`${uid}-blessing`} icon={<ChatIcon className="h-[13px] w-[13px]" />}>
                      Special Blessings
                    </Label>
                    <textarea
                      id={`${uid}-blessing`}
                      rows={4}
                      value={blessing}
                      onChange={(e) => setBlessing(e.target.value)}
                      placeholder={`Write your wishes for ${bride} & ${groom}...`}
                      className={`${fieldBox} resize-none py-3 leading-[22px]`}
                      style={{ borderColor: mix(28) }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="action mt-7 flex h-[52px] w-full items-center justify-center gap-2 rounded-pill uppercase tracking-[0.12em] shadow-[0_8px_18px_rgba(160,110,30,0.35)] transition-transform active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #d7a644, #bd8328)', color: '#ffffff' }}
                  >
                    <SendIcon className="h-[16px] w-[16px]" />
                    Send Blessings &amp; RSVP
                  </button>
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </m.div>

      {burst && <Petals color={confetti} count={22} speed={2} loop={false} onDone={() => setBurst(false)} />}
    </section>
  );
}
