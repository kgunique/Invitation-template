import { notFound } from 'next/navigation';
import { getInvite } from '@/content/invites';
import { TEMPLATES } from '@/components/invite/templates/registry';

/**
 * The one route every invite lives at. A real order never adds a page file
 * here — it adds a row to src/content/invites.ts (stand-in for the future
 * database) and this route renders whichever template that row points at.
 */
export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invite = getInvite(slug);
  if (!invite) notFound();

  const Template = TEMPLATES[invite.templateId as keyof typeof TEMPLATES];
  if (!Template) notFound();

  return (
    <Template
      bride={invite.bride}
      groom={invite.groom}
      greeting={invite.greeting}
      coupleImage={invite.coupleImage}
      waitingImage={invite.waitingImage}
      venue={invite.venue}
      weddingDate={invite.weddingDate}
      events={invite.events}
      details={invite.details}
      rsvp={invite.rsvp}
      location={invite.location}
      registry={invite.registry}
      couple={invite.couple}
      story={invite.story}
      gallery={invite.gallery}
      thankYou={invite.thankYou}
    />
  );
}
