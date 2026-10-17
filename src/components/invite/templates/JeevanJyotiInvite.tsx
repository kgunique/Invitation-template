'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteCouple, InviteEvent, InviteGalleryItem, InviteRsvp, InviteStory } from '@/content/invites';
import { TEMPLATE_NAMES } from '@/content/site';
import { AlarmCountdown } from '../AlarmCountdown';
import { BackLink } from '../BackLink';
import { BrandCredit } from '../BrandCredit';
import { CalendarAgenda } from '../CalendarAgenda';
import { CallEnded } from '../CallEnded';
import { ChatThread, type ChatItem } from '../ChatThread';
import { ContactCard } from '../ContactCard';
import { calendarHref } from '../calendar';
import { CallControls, type CallControl } from '../CallControls';
import { CallTimer } from '../CallTimer';
import { formatDayMonthYear, formatTime, formatWeekdayDate } from '../dates';
import { IncomingCall } from '../IncomingCall';
import { LiveCaptions } from '../LiveCaptions';
import { MessageReply } from '../MessageReply';
import { PhoneAppHeader } from '../PhoneAppHeader';
import { PhotoStories } from '../PhotoStories';
import { FloatingOrderBar } from '../OrderButton';
import { PhoneStatusBar } from '../PhoneStatusBar';
import { RevealLine, fadeUp, lineGroup } from '../RevealLines';
import { ScrollHint } from '../ScrollHint';
import { SlideLock, type SlideLockProps } from '../SlideLock';
import { useBackgroundMusic } from '../useBackgroundMusic';
import { vcardHref } from '../vcard';
import { VoiceWave } from '../VoiceWave';
import { jeevanSans, jeevanScript } from './jeevanFonts';

/**
 * Jeevan–Jyoti — "the call of a lifetime": the whole invitation is a phone. Built one scene at a time, each approved
 * before the next:
 *
 *  1. The gate (in progress): an incoming call. A soft wallpaper, the status bar (its clock is the wedding's hour),
 *     the couple's picture ringing (ripples, a phone shaking on vibrate), "Jeevan & Jyoti calling…", Remind me /
 *     Message, and "slide to answer" (`SlideLock`, its handle a green phone). Answering starts the music.
 *  …then (proposed) the call connected, the couple as contacts, the story as a chat, the countdown, the events as a
 *  calendar, the gallery as a photos app, the RSVP as a reply, and the call ending as the thank-you.
 *
 * This file only composes shared parts. A variation (other colours, another picture) is a thin wrapper passing
 * `theme` and `lock` — not a copy of this file (see ai-doc/rule.md).
 */

export interface JeevanJyotiTheme {
  /** The wallpaper behind the call: any CSS background. */
  wallpaper: string;
  /** The page under the gate, once it has opened. */
  page: string;
  /** The words on the call screen. */
  ink: string;
  /** The answer green: the handle, the badge. */
  answer: string;
  /** The ripples round the picture. */
  ring: string;
}

const DEFAULT_THEME: JeevanJyotiTheme = {
  wallpaper:
    'radial-gradient(60% 40% at 18% 22%, rgba(255,120,150,0.55), transparent 70%), radial-gradient(55% 38% at 85% 70%, rgba(255,190,110,0.45), transparent 70%), radial-gradient(70% 50% at 50% 105%, rgba(150,90,255,0.45), transparent 70%), linear-gradient(170deg, #2a1240 0%, #3d1a4f 40%, #1c1035 100%)',
  page: 'linear-gradient(170deg, #2a1240 0%, #3d1a4f 40%, #1c1035 100%)',
  ink: '#ffffff',
  answer: '#34c759',
  ring: '#ffd6e0',
};

const scene = lineGroup(0.4);

/** The contacts scene's id: the call's Contacts button and the hang-up scroll to it. */
const CONTACTS_ID = 'jj-contacts';

export interface JeevanJyotiInviteProps {
  bride: string;
  groom: string;
  /** ISO timestamp with offset: the status bar's clock shows its hour, the call its day. */
  weddingDate?: string;
  /** The caller's round picture: the two faces, square. */
  avatar?: string;
  /** The couple, blurred huge behind the call screens. */
  coupleImage?: string;
  /** Where (for the calendar reminder). */
  venue?: string;
  /** The couple as contacts: their pictures, `blessing` (the About line), `family`. */
  couple?: InviteCouple;
  /** The story, told as a chat: each milestone a date chip and a message (`from` picks its side). */
  story?: InviteStory;
  /** The programme, as calendar entries. */
  events?: InviteEvent[];
  /** The photos, each opening as a story. */
  gallery?: InviteGalleryItem[];
  /** The note in the closing (the call ended). */
  thankYou?: string;
  /** Its `whatsapp` is where the gate's "Message" sends the guest's wishes. */
  rsvp?: InviteRsvp;
  theme?: Partial<JeevanJyotiTheme>;
  /** Overrides for the gate: the handle's size, where the track sits, the timings. */
  lock?: Partial<Omit<SlideLockProps, 'background' | 'handle' | 'onOpen' | 'onOpened'>>;
  templateName?: string;
}

/** A phone handset (the answer and hang-up buttons), in a 24 box. */
const PHONE =
  'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z';

/** A line icon for the call buttons, drawn from one path in a 24 box. */
function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/**
 * The call's two buttons over the slider, as a phone shows them — and they do what they say. "Remind Me" saves the
 * wedding to the guest's calendar (an .ics file: the phone offers to add it); "Message" opens WhatsApp to the family
 * with a congratulation already written (only when the record has a number to send it to).
 */
function QuickActions({ color, remind, message }: { color: string; remind?: { href: string; file: string }; message?: string }) {
  const circle = 'grid h-[54px] w-[54px] place-items-center rounded-pill bg-[rgba(255,255,255,0.16)] backdrop-blur-md transition-colors hover:bg-[rgba(255,255,255,0.26)]';
  const item = 'flex flex-col items-center gap-2 text-[13px] font-medium';
  return (
    <div className="flex justify-around px-6" style={{ color }}>
      {remind && (
        <a href={remind.href} download={remind.file} className={item} aria-label="Remind me: add the wedding to your calendar">
          <span className={circle}>
            <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <circle cx="12" cy="13" r="7.5" />
              <path d="M12 9.5V13l2.4 1.6M5 4.5 3 6.5M19 4.5l2 2" />
            </svg>
          </span>
          Remind Me
        </a>
      )}
      {message && (
        <a href={message} target="_blank" rel="noopener noreferrer" className={item} aria-label="Message: send your wishes on WhatsApp">
          <span className={circle}>
            <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
              <path d="M4 5h16v11H9l-5 4z" />
            </svg>
          </span>
          Message
        </a>
      )}
    </div>
  );
}

export function JeevanJyotiInvite({
  bride,
  groom,
  weddingDate,
  coupleImage = '/art/platinum/couple-vector.webp',
  avatar = '/art/jeevan/couple-avatar.webp',
  venue,
  couple,
  story,
  events,
  gallery,
  thankYou,
  rsvp,
  theme,
  lock,
  templateName = TEMPLATE_NAMES['jeevan-jyoti'],
}: JeevanJyotiInviteProps) {
  const [revealed, setRevealed] = useState(false);
  // Started by the slide that answers the call (a browser only lets a gesture start sound).
  const music = useBackgroundMusic();
  const t = { ...DEFAULT_THEME, ...theme };
  const clock = weddingDate ? formatTime(weddingDate, 'Asia/Kolkata') : '19:00';
  const day = weddingDate ? formatDayMonthYear(weddingDate, 'Asia/Kolkata') : '';

  const remind = weddingDate
    ? {
        href: calendarHref({
          title: `${groom} & ${bride}'s Wedding`,
          startsAt: weddingDate,
          place: venue ?? '',
          description: `${groom} & ${bride} are getting married. See you there!`,
        }),
        file: `${groom}-${bride}-wedding.ics`.toLowerCase(),
      }
    : undefined;
  const message = rsvp?.whatsapp
    ? `https://wa.me/${rsvp.whatsapp}?text=${encodeURIComponent(
        `Congratulations ${groom} & ${bride}! 🎉💍\nGot your wedding call${day ? ` — see you on ${day}` : ''}! Wishing you both a lifetime of love. ❤️`,
      )}`
    : undefined;

  // What the couple "say" on the call, as live captions.
  const captions = [
    `Hello! 👋 It's ${groom} & ${bride}.`,
    'We have some big news to share…',
    "We're getting married! 💍",
    ...(weddingDate
      ? [`${formatWeekdayDate(weddingDate, 'Asia/Kolkata')} · ${formatTime(weddingDate, 'Asia/Kolkata', true)}${venue ? `, in ${venue.split(',')[0]}` : ''}.`]
      : []),
    "And the day won't be complete without you. ❤️",
  ];

  const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  // on to the contacts (the couple), the scene after the call
  const scrollOn = () => document.getElementById(CONTACTS_ID)?.scrollIntoView({ behavior: smooth(), block: 'start' });
  const scrollTop = () => window.scrollTo({ top: 0, behavior: smooth() });

  // A congratulation to the family on WhatsApp, written for whoever it is addressed to.
  const wishTo = (who: string) =>
    rsvp?.whatsapp
      ? `https://wa.me/${rsvp.whatsapp}?text=${encodeURIComponent(`Hi ${who}! Congratulations on your wedding 🎉💍${day ? ` See you on ${day}!` : ''} ❤️`)}`
      : undefined;
  const saveCouple = {
    href: vcardHref({
      name: `${groom} & ${bride}`,
      phone: rsvp?.whatsapp,
      note: `Wedding: ${day}${venue ? `, ${venue}` : ''}`,
    }),
    file: `${groom}-${bride}.vcf`.toLowerCase(),
  };

  // The story as a chat: a date chip, then the milestone as a message from its sender.
  const chat: ChatItem[] = (story?.milestones ?? []).flatMap((ms, i) => [
    { kind: 'chip' as const, text: `${ms.year} · ${ms.title}` },
    {
      kind: 'msg' as const,
      side: (ms.from ?? (i % 2 ? 'bride' : 'groom')) === 'bride' ? ('right' as const) : ('left' as const),
      name: (ms.from ?? (i % 2 ? 'bride' : 'groom')) === 'bride' ? bride : groom,
      text: ms.text,
      time: ms.time,
    },
  ]);
  const [alarmTime, alarmMeridiem] = weddingDate ? formatTime(weddingDate, 'Asia/Kolkata', true).replace(/^0/, '').split(' ') : ['', ''];
  const share = async () => {
    const text = `${groom} & ${bride} are getting married! 💍 Here's their wedding invitation:`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${groom} & ${bride}'s Wedding`, text, url });
      } catch {
        /* dismissed */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener');
    }
  };

  // A call screen's buttons, turned to the invitation's own.
  const controls: CallControl[] = [
    { label: 'Speaker', icon: <Icon d="M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />, onClick: music.toggle, active: music.playing, ariaLabel: music.playing ? 'Speaker on: pause the music' : 'Speaker off: play the music' },
    ...(venue
      ? [{ label: 'Venue', icon: <Icon d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z" />, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`, external: true, ariaLabel: `Venue: open ${venue} in maps` }]
      : []),
    ...(remind ? [{ label: 'Remind Me', icon: <Icon d="M12 20.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM12 9.5V13l2.4 1.6M5 4.5 3 6.5M19 4.5l2 2" />, href: remind.href, download: remind.file, ariaLabel: 'Remind me: add the wedding to your calendar' }] : []),
    ...(message ? [{ label: 'Wishes', icon: <Icon d="M4 5h16v11H9l-5 4zM12 13.2s-3-1.9-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.9-3 3.8-3 3.8z" />, href: message, external: true, ariaLabel: 'Wishes: send your wishes on WhatsApp' }] : []),
    { label: 'Share', icon: <Icon d="M12 15V3.5M7.5 8 12 3.5 16.5 8M5 12v7.5h14V12" />, onClick: share, ariaLabel: 'Share this invitation' },
    { label: 'Contacts', icon: <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5" />, onClick: scrollOn, ariaLabel: 'Contacts: meet the couple below' },
  ];

  // The names the shared chrome reads (Back pill, music button), pinned to this palette.
  const vars = {
    '--invite-ground': '#2a1240',
    '--invite-metal': t.ring,
    '--invite-ink': t.ink,
    '--ink-strong': t.ink,
    '--surface-raised': '#3d1a4f',
    '--line-firm': t.ring,
  } as CSSProperties;

  return (
    <div style={{ ...vars, background: t.page, overflowX: 'clip' }} className={`${jeevanSans.className} relative min-h-screen`}>
      {/* Back, under the status bar. Above the cover (z-control) so it stays tappable. */}
      <div className="absolute inset-x-[0] top-[0] z-control">
        <div className="mx-auto max-w-[480px] px-5 pt-[46px]">
          <BackLink tone="gate" />
        </div>
      </div>

      {/* Scene 2, the call connected: the timer running, the couple's voice as a wave and as live captions telling the
          news, and a call screen's buttons that do the invitation's work. Mounted from the start, under the gate. */}
      <section className="relative mx-auto min-h-[100svh] w-full max-w-[480px] overflow-hidden pb-28" style={{ background: t.wallpaper }}>
        <div aria-hidden className="absolute inset-[0] opacity-20 blur-[40px]">
          <Image src={coupleImage} alt="" fill sizes="480px" className="scale-125 object-cover" />
        </div>
        <PhoneStatusBar time={clock} carrier="Shaadi 5G" callPill={t.answer} color={t.ink} className="relative" />

        <m.div
          variants={scene}
          initial="hidden"
          animate={revealed ? 'shown' : 'hidden'}
          className="relative flex flex-col items-center px-6 pt-[62px] text-center text-invite-ink"
        >
          <m.div variants={fadeUp} className="relative h-[76px] w-[76px] overflow-hidden rounded-pill border-2" style={{ borderColor: t.ring, background: 'linear-gradient(160deg, #ffe3c2, #f7b4c4)' }}>
            <Image src={avatar} alt={`${groom} and ${bride}`} fill sizes="76px" className="object-cover" />
          </m.div>
          <RevealLine className="mt-3 text-[28px] font-semibold leading-[1.2]">
            {groom} <span className={`${jeevanScript.className} text-[32px] font-normal`} style={{ color: t.ring }}>&amp;</span> {bride}
          </RevealLine>
          <m.p variants={fadeUp} className="mt-1 flex items-center gap-2 text-[16px] opacity-85">
            <span className="inline-block h-[8px] w-[8px] rounded-pill" style={{ background: t.answer }} />
            <CallTimer running={revealed} />
          </m.p>
          <m.div variants={fadeUp} className="mt-4">
            <VoiceWave className="h-[30px]" color={t.ring} />
          </m.div>

          <m.div variants={fadeUp} className="mt-5 w-full rounded-[20px] bg-[rgba(255,255,255,0.09)] px-5 py-4 text-left backdrop-blur-md">
            <LiveCaptions running={revealed} lines={captions} labelColor="rgba(255,255,255,0.55)" />
          </m.div>

          <m.div variants={fadeUp} className="mt-7 w-full">
            <CallControls items={controls} colors={{ activeInk: '#2a1240' }} />
          </m.div>

          {/* There is more of the call below. */}
          <m.div variants={fadeUp} className="mt-8">
            <ScrollHint label="Scroll down" className="text-invite-ink" />
          </m.div>
        </m.div>
      </section>

      {/* The rest of the call: the phone's apps, one after another, on the same night wallpaper. */}
      <div className="relative mx-auto w-full max-w-[480px] overflow-x-clip" style={{ background: t.page }}>
        <div aria-hidden className="pointer-events-none absolute inset-[0]" style={{ background: t.wallpaper, opacity: 0.6 }} />

        {/* Scene 3, the couple as Contacts. */}
        {couple && (
          <section id={CONTACTS_ID} className="relative scroll-mt-[20px] px-5 pb-10 pt-16">
            <PhoneAppHeader app="Contacts" appIcon={<span className="text-[12px]">👤</span>} tile="#8e8e93" title="Meet the couple" subtitle="Two favourites, one family" />
            <div className="mt-6 flex flex-col gap-5">
              {(['groom', 'bride'] as const).map((side) => {
                const p = couple[side];
                const short = side === 'groom' ? groom : bride;
                const wish = wishTo(short);
                return (
                  <ContactCard
                    key={side}
                    from={side === 'groom' ? 'left' : 'right'}
                    image={p.image}
                    name={p.name ?? short}
                    role={side === 'groom' ? 'The Groom' : 'The Bride'}
                    badge="❤️ Favourite"
                    colors={{ accent: t.ring }}
                    actions={[
                      ...(wish ? [{ label: 'Message', icon: <Icon d="M4 5h16v11H9l-5 4z" />, href: wish, external: true, ariaLabel: `Message: send ${short} your wishes on WhatsApp` }] : []),
                      { label: 'Save', icon: <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5M19 8v6M16 11h6" />, href: saveCouple.href, download: saveCouple.file, ariaLabel: 'Save the couple as a contact' },
                    ]}
                    rows={[
                      ...(p.blessing ? [{ label: 'About', value: p.blessing }] : []),
                      ...(p.family ? [{ label: 'Family', value: p.family }] : []),
                    ]}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Scene 4, the story as a chat. */}
        {chat.length > 0 && (
          <section className="relative px-5 py-10">
            <PhoneAppHeader app="Messages" appIcon={<span className="text-[12px]">💬</span>} tile={t.answer} title="Our love story" subtitle="It all started with a message…" />
            <ChatThread className="mt-6" items={chat} title={`${groom} ❤️ ${bride}`} avatar={avatar} />
          </section>
        )}

        {/* Scene 5, the countdown as an alarm. */}
        {weddingDate && (
          <section className="relative px-5 py-10">
            <PhoneAppHeader app="Clock" appIcon={<span className="text-[12px]">⏰</span>} tile="#ff9f0a" title="The big day" subtitle="An alarm we've waited for all our lives" />
            <AlarmCountdown
              className="mt-6"
              weddingDate={weddingDate}
              time={alarmTime}
              meridiem={alarmMeridiem}
              label="Wedding Day 💍"
              detail={`${formatWeekdayDate(weddingDate, 'Asia/Kolkata')}${venue ? ` · ${venue.split(',')[0]}` : ''}`}
              colors={{ on: t.answer }}
            />
          </section>
        )}

        {/* Scene 6, the events as a calendar. */}
        {events && events.length > 0 && (
          <section className="relative px-5 py-10">
            <PhoneAppHeader app="Calendar" appIcon={<span className="text-[12px]">📅</span>} tile="#ff375f" title="Save the dates" subtitle="Tap Add — your phone will remind you" />
            <CalendarAgenda className="mt-6" events={events} highlight={weddingDate} />
          </section>
        )}

        {/* Scene 7, the gallery as the photos app, each picture a story. */}
        {gallery && gallery.length > 0 && (
          <section className="relative px-5 py-10">
            <PhoneAppHeader app="Photos" appIcon={<span className="text-[12px]">🖼️</span>} tile="#5e5ce6" title="Our moments" subtitle="Tap a photo to watch our story" />
            <PhotoStories className="mt-6" items={gallery} owner={`${groom} & ${bride}`.toLowerCase().replace(/\s+/g, '')} ownerAvatar={avatar} />
          </section>
        )}

        {/* Scene 8, the RSVP as a reply. */}
        {rsvp && (
          <section className="relative px-5 py-10">
            <PhoneAppHeader app="Messages" appIcon={<span className="text-[12px]">✉️</span>} tile={t.answer} title="Will you come?" subtitle="Reply to us — it goes straight to WhatsApp" />
            <MessageReply
              className="mt-6"
              rsvp={rsvp}
              title={`${groom} & ${bride}`}
              avatar={avatar}
              ask={[`We'd love you to be there on ${day || 'our big day'}! 💌`, 'Will you join us?']}
              replies={[
                { label: 'Count me in! 🎉', text: `Count me in! 🎉 Can't wait to celebrate with you, ${groom} & ${bride}!`, yes: true },
                { label: "We'll be there 👨‍👩‍👧", text: 'We will all be there! 👨‍👩‍👧 Congratulations!', yes: true },
                { label: "Can't make it 🙏", text: `So sorry, I can't make it 🙏 Sending all my love and blessings to you both!` },
              ]}
              thanksYes="Yay! 🥳 We can't wait to see you there!"
              thanksNo="We'll miss you! Thank you for your blessings ❤️"
            />
          </section>
        )}

        {/* Scene 9, the call ends: thank you. */}
        <section className="relative px-5 pb-32 pt-12">
          <CallEnded
            avatar={avatar}
            name={
              <>
                {groom} <span className={`${jeevanScript.className} font-normal`} style={{ color: t.ring }}>&amp;</span> {bride}
              </>
            }
            duration={
              <>
                Call duration <CallTimer running={revealed} />
              </>
            }
            message={thankYou ?? 'Thank you for picking up. Your love and blessings mean the world to us. See you at the wedding! ❤️'}
            colors={{ ring: t.ring }}
            actions={[
              { label: 'Call Again', icon: <Icon d={PHONE} />, onClick: scrollTop, ariaLabel: 'Call again: back to the top' },
              ...(message ? [{ label: 'Wishes', icon: <Icon d="M4 5h16v11H9l-5 4z" />, href: message, external: true, ariaLabel: 'Send your wishes on WhatsApp' }] : []),
              { label: 'Save Contact', icon: <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5M19 8v6M16 11h6" />, href: saveCouple.href, download: saveCouple.file, ariaLabel: 'Save the couple as a contact' },
            ]}
          >
            <div className="mt-10 [--ink-muted:rgba(255,255,255,0.6)] [--invite-metal:#ffd6e0]">
              <BrandCredit />
            </div>
          </CallEnded>
        </section>
      </div>

      <SlideLock
        lockLabel="Slide to answer the call and open the invitation"
        label="slide to answer"
        labelClassName={`${jeevanSans.className} !text-[18px] !font-normal !normal-case !tracking-[0.03em]`}
        labelGlow="#ffffff"
        colors={{ ground: '#1c1035', accent: t.answer, text: t.ink, track: 'rgba(255,255,255,0.16)' }}
        bottom="12%"
        handleSize={64}
        handle={
          <span className="grid h-full w-full place-items-center" style={{ background: t.answer }}>
            <span className="amb-ring-shake block" style={{ ['--ring-angle' as string]: '12deg', ['--ring-dur' as string]: '2.2s' } as CSSProperties}>
              <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" fill="#ffffff">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
              </svg>
            </span>
          </span>
        }
        background={
          <div className="absolute inset-[0]" style={{ background: t.wallpaper }}>
            {/* the caller's picture, huge and blurred, as a phone's call screen does */}
            <div className="absolute inset-[0] opacity-30 blur-[38px]">
              <Image src={coupleImage} alt="" fill sizes="100vw" className="scale-125 object-cover" />
            </div>
            <div className="absolute inset-x-[0] top-[0] mx-auto max-w-[480px]">
              <PhoneStatusBar time={clock} carrier="Shaadi 5G" color={t.ink} />
            </div>
          </div>
        }
        above={<QuickActions color={t.ink} remind={remind} message={message} />}
        onTap={music.play}
        onOpen={() => setRevealed(true)}
        {...lock}
      >
        <IncomingCall
          className="pt-[8vh]"
          image={avatar}
          imageAlt={`${groom} and ${bride}`}
          focus="50% 50%"
          zoom={1}
          label="Wedding invitation"
          name={
            <>
              <span className="block text-[38px] font-semibold tracking-[-0.01em]">{groom}</span>
              <span className={`${jeevanScript.className} my-1 block text-[38px] leading-[0.9]`} style={{ color: t.ring }}>
                &amp;
              </span>
              <span className="block text-[38px] font-semibold tracking-[-0.01em]">{bride}</span>
            </>
          }
          status="calling you"
          detail={weddingDate ? `Mobile · ${formatDayMonthYear(weddingDate, 'Asia/Kolkata')}` : undefined}
          nameClassName={jeevanSans.className}
          bodyClassName={jeevanSans.className}
          colors={{ ring: t.ring, ink: t.ink, badge: t.answer }}
        />
      </SlideLock>

      {revealed && <FloatingOrderBar templateName={templateName} music={music} delay={1.2} />}
    </div>
  );
}
