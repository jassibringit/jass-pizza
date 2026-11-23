import Link from "next/link";
import { Arrow } from "@/components/arrow";

export function Hero() {
  return (
    <section
      aria-label="Intro"
      className="relative flex min-h-[calc(100svh-5.5rem)] items-end overflow-hidden bg-background lg:items-center"
    >
      {/* blurred glow behind the text */}
      <div aria-hidden="true" className="absolute inset-0 hidden overflow-hidden lg:block">
        <div className="absolute inset-0 scale-125 bg-[url(/hero-poster.jpg)] bg-cover bg-center opacity-15 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent to-40%" />
      </div>
      <HeroVideo />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:gap-7 lg:py-16">
        <p className="animate-rise text-[13px] tracking-[0.25em] text-gold uppercase motion-reduce:animate-none">
          Private live pizza experience · GTA
        </p>

        <h1 className="animate-rise [animation-delay:120ms] motion-reduce:animate-none max-w-4xl font-display text-shadow-lg text-shadow-background/60 text-5xl leading-[0.98] font-semibold md:text-7xl lg:max-w-2xl lg:text-8xl">
          Pizza, fired <em className="text-gold">live</em> at your event
          <span className="text-gold">.</span>
        </h1>

        <p className="animate-rise [animation-delay:240ms] motion-reduce:animate-none max-w-xl text-shadow-md text-shadow-background/70 text-lg leading-relaxed text-ivory-muted md:text-xl">
          Hand-stretched dough, baked fresh right in the middle of your celebration.
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

// 9:16 cut for phones, 3:4 cut for desktop.
// muted + playsInline are needed for autoplay on iOS.
function HeroVideo() {
  return (
    <div aria-hidden="true" className="absolute inset-0 lg:left-auto lg:aspect-3/4 lg:min-w-[42%] lg:hero-mask">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-poster.jpg"
        className="size-full object-cover object-[center_38%] motion-reduce:hidden"
      >
        <source src="/hero-desktop.mp4" type="video/mp4" media="(min-width: 64rem)" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/50 via-45% to-background/20 lg:hidden" />
      <div className="hero-fade absolute inset-0 hidden lg:block" />
    </div>
  );
}
