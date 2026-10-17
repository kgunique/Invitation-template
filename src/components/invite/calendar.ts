import type { InviteEvent } from '@/content/invites';

type CalendarEvent = Pick<InviteEvent, 'title' | 'startsAt' | 'place' | 'address' | 'description'>;

/** Where an event is, as one line: the venue, then its address. */
export const where = (event: Pick<InviteEvent, 'place' | 'address'>) => [event.place, event.address].filter(Boolean).join(', ');

/**
 * An .ics file as a `data:` link, so "add to calendar" / "remind me" needs no server: the event, three hours from its
 * start. Give the link a `download` name ending in `.ics`; a phone offers to add it to its calendar.
 */
export function calendarHref(event: CalendarEvent) {
  const start = new Date(event.startsAt);
  const end = new Date(start.getTime() + 3 * 3_600_000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const text = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Get Invites//Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${event.title.replace(/\W+/g, '-').toLowerCase()}@getinvites`,
    `DTSTAMP:${stamp(start)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${text(event.title)}`,
    `LOCATION:${text(where(event))}`,
    `DESCRIPTION:${text(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
}
