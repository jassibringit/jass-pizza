import { Check } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/brand-icons";
import { QuoteWizard } from "@/components/quote-wizard/quote-wizard";
import { seasonNote } from "@/lib/booking-schema";
import { contact } from "@/lib/contact";
import { PRICING, formatMoney } from "@/lib/pricing";

const chatClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

const included = [
  "In-house dough & sauces",
  "12″ pizzas made live in front of your guests",
  "Setup & cleanup",
  "Plates, napkins & dips",
  "No hidden fees",
];

// Everything about price lives here, next to the form that gives the exact estimate.
// Phones: intro, then the form. Desktop: intro on the left, form on the right.
export function QuoteSection() {
  const minimum = formatMoney(PRICING.minimum);

  return (
    <section id="quote" aria-labelledby="quote-heading" className="group/quote border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-28 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
        <div>
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">A good place to start</p>
          {/* The price comes from src/lib/pricing.ts, so it matches the wizard's estimate */}
          <h2
            id="quote-heading"
            className="mt-4 font-display text-5xl leading-[0.95] font-semibold md:text-7xl"
          >
            Events start at <em className="font-normal text-gold">{minimum}</em>
            <span className="text-gold">.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ivory-muted">
            One straightforward price, shaped around your guest count and event. Your estimate
            appears before you send, then we&apos;ll talk through the details together.
          </p>

          <ul className="mt-8 grid gap-x-6 gap-y-3 text-sm text-ivory-muted sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border pt-6 text-sm">
            <p className="text-gold">
              {minimum} minimum · {PRICING.deposit * 100}% deposit holds your date
            </p>
            <p className="mt-2 text-muted-foreground">
              Travel fee outside Peel Region · {seasonNote}
            </p>
          </div>

          {/* A quiet alternative to the form; hidden once the inquiry is sent */}
          <div className="mt-8 group-has-data-done/quote:hidden">
            <p className="text-sm text-muted-foreground">
              Prefer to chat? Send your date, guest count and city.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
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

        {/* Edge to edge on phones (no double padding); a framed card from sm up */}
        <div className="-mx-6 sm:mx-0">
          <QuoteWizard />
        </div>
      </div>
    </section>
  );
}
