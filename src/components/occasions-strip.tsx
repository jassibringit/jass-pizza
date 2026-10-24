const occasions = [
  "weddings",
  "mehndi & pre-wedding nights",
  "receptions",
  "backyard parties",
  "birthdays",
  "anniversaries",
  "baby showers",
  "office parties",
];

// The track holds 4 copies of the list and slides left by half its width
// (2 copies), then jumps back. Copies 2–4 are hidden from screen readers.
const copies = [0, 1, 2, 3];

export function OccasionsStrip() {
  return (
    <section
      aria-label="Events we serve"
      className="overflow-hidden border-y border-border bg-card py-5"
    >
      <div className="flex w-max animate-marquee hover:paused motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
        {copies.map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0 ? true : undefined}
            className={`flex shrink-0 items-center gap-6 pr-6 font-display text-lg text-ivory-muted italic md:text-xl motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-6 ${copy > 0 ? "motion-reduce:hidden" : ""}`}
          >
            {occasions.map((occasion) => (
              <li key={occasion} className="flex items-center gap-6">
                {occasion}
                <span aria-hidden="true" className="text-sm text-gold not-italic">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
