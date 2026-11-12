import Link from "next/link";
import { Arrow } from "@/components/arrow";

export function Hero() {
  return (
    <section
      aria-label="Intro"
      className="relative flex min-h-svh items-end overflow-hidden bg-secondary"
    >
      <HeroVideo />
      <div aria-hidden="true" className="absolute inset-0 bg-background/55" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-16 md:gap-7 md:pb-22">
        <p className="animate-rise text-[13px] tracking-[0.25em] text-gold uppercase motion-reduce:animate-none">
          Private live pizza experience · GTA
        </p>

        <h1 className="animate-rise [animation-delay:120ms] motion-reduce:animate-none max-w-4xl font-display text-5xl leading-[0.98] font-semibold md:text-7xl lg:text-8xl">
          pizza, fired <em className="text-gold">live</em> at your event
          <span className="text-gold">.</span>
        </h1>

        <p className="animate-rise [animation-delay:240ms] motion-reduce:animate-none max-w-xl text-lg leading-relaxed text-ivory-muted md:text-xl">
          Hand-stretched dough, two ovens and a styled black-and-gold station,
          right in the middle of your celebration.
        </p>

        <div className="animate-rise [animation-delay:360ms] motion-reduce:animate-none flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href="#quote"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Get a quote <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Decorative background. Portrait clip, so the crop is anchored on the ovens for wide screens.
// muted + playsInline are required for autoplay (playsInline stops iOS going full screen).
function HeroVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/hero-poster.jpg"
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover object-[center_38%] motion-reduce:hidden"
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
