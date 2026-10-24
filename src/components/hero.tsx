import Link from "next/link";

export function Hero() {
  return (
    <section
      aria-label="Intro"
      className="relative flex min-h-[560px] items-end bg-secondary md:min-h-[760px]"
    >
      {/* Hero photo goes here once we have it, e.g.
          <Image src="/hero.jpg" alt="Pizza leaving the oven at a party" fill priority className="object-cover" /> */}
      <div aria-hidden="true" className="absolute inset-0 bg-background/55" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-16 md:gap-7 md:pb-22">
        <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
          Private live pizza experience · GTA
        </p>

        <h1 className="max-w-4xl font-display text-5xl leading-[0.98] font-semibold md:text-7xl lg:text-8xl">
          pizza, fired <em className="text-gold">live</em> at your event
          <span className="text-gold">.</span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-ivory-muted md:text-xl">
          Hand-stretched dough, two ovens and a styled black-and-gold station,
          right in the middle of your celebration.
        </p>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Get a quote →
          </Link>
        </div>
      </div>
    </section>
  );
}
