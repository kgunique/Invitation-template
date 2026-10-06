import { buttonClasses } from '@/components/ui/Button';
import { ADDONS } from '@/content/services';
import { whatsappEnquiryUrl } from '@/content/site';
import { SectionHeading } from './SectionHeading';
import { SparkleIcon, WhatsAppIcon } from './icons';

/** The optional extras, each with an "Ask about it" link that opens a WhatsApp enquiry. */
export function Addons() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          eyebrow={
            <>
              <SparkleIcon /> Add-ons
            </>
          }
          title="Make it more yours"
          subtitle="Optional extras on top of any invitation. Ask us and we will quote you."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ADDONS.map((a) => (
            <div key={a.title} className="flex flex-col rounded-lg bg-surface-raised p-6 shadow-sm">
              <p className="display-md text-ink-strong">{a.title}</p>
              <p className="body-sm mt-2 flex-1 text-ink-body">{a.desc}</p>
              <a
                href={whatsappEnquiryUrl(a.title)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('order', 'sm', 'mt-5 w-full no-underline')}
              >
                <WhatsAppIcon /> Ask about it
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
