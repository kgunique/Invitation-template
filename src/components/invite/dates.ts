/**
 * Date text for invites. Everything takes an explicit IANA zone and a fixed
 * locale: that renders identically on the server and in any browser, and it
 * shows the wedding's own day and clock to a guest in another timezone.
 */

const SUFFIXES = ['th', 'st', 'nd', 'rd'];

/** "February 21st, 2027" (or "Feb 21st, 2027" with month: 'short'). */
export function formatDay(iso: string, timeZone: string, month: 'long' | 'short' = 'long') {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, month, day: 'numeric', year: 'numeric' }).formatToParts(
    new Date(iso),
  );
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = Number(get('day'));
  const v = day % 100;
  return `${get('month')} ${day}${SUFFIXES[(v - 20) % 10] || SUFFIXES[v] || SUFFIXES[0]}, ${get('year')}`;
}

/** "19:00" — 24-hour clock. h23 so midnight is 00:00, never 24:00. Pass
 * `hour12` for "07:00 PM". (Newer ICU puts a narrow no-break space before the
 * PM and older ICU a plain one, so the space is normalised: server and browser
 * must print the same string.) */
export function formatTime(iso: string, timeZone: string, hour12 = false) {
  const text = hour12
    ? new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', hour12: true }).format(
        new Date(iso),
      )
    : new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(
        new Date(iso),
      );
  return text.replace(/\s/g, ' ');
}
