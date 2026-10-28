import Link from "next/link";

const steps = [
  {
    title: "we set up",
    body: "We arrive 1 to 2 hours before your event to style the station, heat the ovens and prep every topping. By the time your guests walk in, everything is ready and you never see the work behind it.",
  },
  {
    title: "we fire live",
    body: "Fresh dough is stretched by hand and baked right in front of your guests, with new pizzas coming out all through your serving window. It quickly becomes the spot everyone gathers around, watching, chatting and taking photos of the setup.",
  },
  {
    title: "we pack up",
    body: "Once everyone has eaten their fill, we clean our station, pack the ovens and leave the space just as we found it. No mess and nothing for you to handle. You just enjoy the rest of your night.",
  },
];

export function HowItWorks() {
  return (
    <section id="how">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
          How it works
        </p>
        <h2 className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl">
          you host. we handle the rest<span className="text-gold">.</span>
        </h2>

        <ol className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="font-display text-xl text-gold italic">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="h-px bg-gold/50" />
              <h3 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                {step.title}
                <span className="text-gold">.</span>
              </h3>
              <p className="leading-relaxed text-ivory-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <Link
          href="/packages"
          className="mt-12 inline-flex min-h-11 items-center rounded-full border border-gold px-6 py-3 text-foreground transition-colors hover:border-gold-bright hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:mt-14"
        >
          See packages →
        </Link>
      </div>
    </section>
  );
}
