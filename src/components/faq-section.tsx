import { ChevronDown } from "lucide-react";
import { Arrow } from "@/components/arrow";
import { seasonNote } from "@/lib/booking-schema";
import { contact } from "@/lib/contact";
import { PRICING, formatMoney, servingTimeRange } from "@/lib/pricing";

// Answers are plain text so the same list feeds the page and the search-engine data below.
// Prices and times come from src/lib/pricing.ts so they can't drift from the estimate.
function getFaqs() {
  const serving = servingTimeRange();
  const deposit = `${PRICING.deposit * 100}%`;

  return [
    {
      question: "What size are the pizzas?",
      answer:
        "Every pizza is 12 inches, cut into 8 slices, made to share. We plan the amount around your guest count, so everyone gets their fill.",
    },
    {
      question: "What happens on the day?",
      answer:
        "Our team arrives about an hour ahead with our outdoor ovens and everything we need. We set up, fire up and par-bake the bases before your guests sit down, so you can enjoy your own party.",
    },
    {
      question: "How fast do the pizzas come out?",
      answer:
        "We par-bake a few bases when we arrive, then finish and make the rest fresh right through the event. The first pizzas are out fast and there's no queue: every slice comes off the fire hot.",
    },
    {
      question: "How long do you serve for?",
      answer: `Live serving runs ${serving.min} to ${serving.max} hours depending on the size of your event, and your estimate shows your exact time. Setup and takedown happen outside that. Want us longer? It's ${formatMoney(PRICING.extraHalfHour)} per extra half hour.`,
    },
    {
      question: "What do you need from us?",
      answer:
        "About a 10 × 10 ft space on level ground outdoors, room to park nearby for unloading, and clearance for a little smoke. A backyard, driveway or patio all work, even if your guests are indoors.",
    },
    {
      question: "Can you handle dietary needs?",
      answer:
        "Just tell us what's needed in your inquiry or a message, and we'll let you know what we can do for your event.",
    },
    {
      question: "Where and when do you cater?",
      answer: `Brampton, Peel Region and the GTA, with a travel fee outside Peel. ${seasonNote}`,
    },
    {
      question: "How do I book?",
      answer: `Check your date with the form above, or message us your date, guest count and city. A ${deposit} deposit holds your date, and the balance is due on the day.`,
    },
  ];
}

export function FaqSection() {
  const faqs = getFaqs();

  // FAQ structured data helps search engines and AI assistants understand the page.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-border">
      {/* Phones: heading, then the questions. Desktop: heading on the left, questions on the right. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-28 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">The little details</p>
          <h2
            id="faq-heading"
            className="mt-4 font-display text-5xl leading-none font-semibold md:text-6xl"
          >
            Good to <em className="font-normal text-gold">know</em>
            <span className="text-gold">.</span>
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-ivory-muted">
            Have a question we haven&apos;t answered? We&apos;d love to hear from you.
          </p>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-gold transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Let&apos;s talk <Arrow />
            <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
          </a>
        </div>

        <div className="border-t border-border">
          {faqs.map((faq, i) => (
            // name="faq": opening one question closes the others, no JavaScript needed.
            <details key={faq.question} name="faq" className="faq-item group border-b border-border">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-5 transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="w-6 shrink-0 text-xs text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-xl md:text-2xl">{faq.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-6 pl-10 leading-relaxed text-ivory-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
