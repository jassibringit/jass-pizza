import { Plus } from "lucide-react";
import { seasonNote } from "@/lib/booking-schema";
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
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-28">
        <div className="text-center">
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">Good to know</p>
          <h2
            id="faq-heading"
            className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl"
          >
            questions<span className="text-gold">.</span>
          </h2>
        </div>

        <div className="mt-10 border-t border-border md:mt-14">
          {faqs.map((faq) => (
            // name="faq": opening one question closes the others, no JavaScript needed.
            <details key={faq.question} name="faq" className="faq-item group border-b border-border">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:text-2xl [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-6 leading-relaxed text-ivory-muted">{faq.answer}</p>
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
