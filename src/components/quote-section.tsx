import { InstagramIcon, WhatsAppIcon } from "@/components/brand-icons";
import { QuoteWizard } from "@/components/quote-wizard/quote-wizard";
import { contact } from "@/lib/contact";

const chatClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:px-5 sm:text-[15px]";

// Centred like the packages section: heading, then the step-by-step form.
export function QuoteSection() {
  return (
    <section id="quote" aria-labelledby="quote-heading" className="group/quote border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-28">
        <div className="text-center">
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">Check your date</p>
          <h2
            id="quote-heading"
            className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl"
          >
            Tell us about your event<span className="text-gold">.</span>
          </h2>
        </div>

        {/* Edge to edge on phones (no double padding); a framed card from sm up */}
        <div className="-mx-6 mt-10 sm:mx-auto sm:max-w-3xl md:mt-14">
          <QuoteWizard />
        </div>

        {/* A quiet alternative under the form; hidden once the inquiry is sent */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-center group-has-data-done/quote:hidden">
          <p className="text-sm text-muted-foreground">
            Prefer to chat for a quicker reply? Send your date, guest count and city.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className={chatClass}>
              <WhatsAppIcon className="size-4" />
              WhatsApp us
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={contact.instagramDm} target="_blank" rel="noopener noreferrer" className={chatClass}>
              <InstagramIcon className="size-4" />
              DM on Instagram
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
