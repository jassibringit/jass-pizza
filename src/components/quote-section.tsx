import { Check } from "lucide-react";
import { Arrow } from "@/components/arrow";
import { InstagramIcon, WhatsAppIcon } from "@/components/brand-icons";
// Wizard is off for launch, bring it back later.
// import { QuoteWizard } from "@/components/quote-wizard/quote-wizard";
import { seasonNote } from "@/lib/booking-schema";
import { contact } from "@/lib/contact";
import { PRICING, formatMoney } from "@/lib/pricing";

const included = [
  "In-house dough & sauces",
  "12″ pizzas made live in front of your guests",
  "Setup & cleanup",
  "Plates, napkins & dips",
  "No hidden fees",
];

const whatToSend = [
  {
    label: "Your event",
    hint: "Let us know what kind of event it is (wedding, birthday, corporate…) and whether pizza is the main meal or there's other food too.",
  },
  { label: "The date", hint: "Tell us the date of your event so we can check it's free." },
  { label: "Guests and city", hint: "Provide us with your guest count and the city where the event is." },
];

export function QuoteSection() {
  const minimum = formatMoney(PRICING.minimum);

  return (
    <section id="quote" aria-labelledby="quote-heading" className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-28 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
        <div>
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">A good place to start</p>
          <h2
            id="quote-heading"
            className="mt-4 font-display text-5xl leading-[0.95] font-semibold md:text-7xl"
          >
            Events start at <em className="font-normal text-gold">{minimum}</em>
            <span className="text-gold">.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ivory-muted">
            One straightforward price, shaped around your guest count and event. Send us a few
            details and we&apos;ll come back with your quote.
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
        </div>

        {/* <div className="-mx-6 sm:mx-0"><QuoteWizard /></div> */}
        <div className="border border-border bg-background p-6 sm:p-10">
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">Book your date</p>
          <h3 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Send us these details<span className="text-gold">.</span>
          </h3>

          <ol className="mt-8 divide-y divide-border border-y border-border">
            {whatToSend.map((item, i) => (
              <li key={item.label} className="flex gap-4 py-4">
                <span className="w-6 shrink-0 font-display text-gold italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block">{item.label}</span>
                  <span className="block text-sm text-muted-foreground">{item.hint}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp us <Arrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={contact.instagramDm}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold px-6 py-3 text-gold transition-colors hover:bg-gold hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <InstagramIcon className="size-4" />
              DM on Instagram <Arrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
