import Link from "next/link";
import { Check } from "lucide-react";
import { Arrow } from "@/components/arrow";
import { seasonNote } from "@/lib/booking-schema";

type Package = {
  name: string;
  tagline: string;
  features: string[];
  greatFor: string;
  featured?: boolean;
};

const packages: Package[] = [
  {
    name: "Intimate",
    tagline: "For close friends and family, out in the backyard.",
    features: ["3 pizza flavours", "1.5 hours of live pizza", "Cannoli on request"],
    greatFor: "birthdays & backyard parties",
  },
  {
    name: "Celebration",
    tagline: "For the party where everyone ends up around the oven.",
    features: ["4 pizza flavours", "2 hours of live pizza", "Cannoli on request"],
    greatFor: "showers, engagements & office parties",
    featured: true,
  },
  {
    name: "Grand",
    tagline: "For weddings, milestones and the big days.",
    features: [
      "4 flavours, one created for your event",
      "3 hours of live pizza",
      "Fresh-filled cannoli for everyone",
    ],
    greatFor: "weddings, corporate & milestones",
  },
];

const included = [
  "In-house dough & sauces",
  "12″ pizzas made live in front of your guests",
  "Setup & cleanup",
  "Plates, napkins & dips",
  "No hidden fees",
];

// Prices come from env vars (see .env.example) so they can change without a code change.
// If one is missing, that line is simply left out.
const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function priceFromEnv(value: string | undefined) {
  const amount = Number(value);
  return value && Number.isFinite(amount) && amount > 0 ? money.format(amount) : null;
}

export function PackagesSection() {
  const startsAt = priceFromEnv(process.env.PRICE_FROM);
  const rangeLow = priceFromEnv(process.env.PRICE_RANGE_LOW);
  const rangeHigh = priceFromEnv(process.env.PRICE_RANGE_HIGH);

  return (
    <section id="packages" aria-labelledby="packages-heading" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-32">
        <div className="reveal text-center">
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">Packages</p>
          <h2
            id="packages-heading"
            className="mt-4 font-display text-4xl leading-tight font-semibold md:text-6xl"
          >
            pick your party<span className="text-gold">.</span> we&apos;ll bring the
            oven<span className="text-gold">.</span>
          </h2>
        </div>

        {startsAt && (
          <div className="reveal mt-10 border-y border-border py-8 text-center md:mt-14">
            <p className="font-display text-3xl font-semibold md:text-4xl">
              events start at <span className="text-gold">{startsAt}</span>
              <span className="text-gold">.</span>
            </p>
            {rangeLow && rangeHigh && (
              <p className="mt-2 text-ivory-muted">
                Most events range from {rangeLow} to {rangeHigh}, depending on guest count.
              </p>
            )}
          </div>
        )}

        <ul className="mt-14 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6">
          {packages.map((pkg) => (
            <li
              key={pkg.name}
              className={`reveal relative flex flex-col border bg-card p-7 md:p-8 ${
                pkg.featured ? "border-gold" : "border-border"
              }`}
            >
              {pkg.featured && (
                <p className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-primary-foreground uppercase md:left-8">
                  Most booked
                </p>
              )}

              <h3 className="font-display text-3xl font-semibold">{pkg.name}</h3>
              <p className="mt-3 leading-relaxed text-ivory-muted">{pkg.tagline}</p>

              <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold" />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-8 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Great for</span> {pkg.greatFor}
              </p>
            </li>
          ))}
        </ul>

        <div className="reveal mt-10 flex flex-col items-center gap-4 border border-border px-6 py-6 text-center md:flex-row md:flex-wrap md:justify-center md:gap-x-10">
          <p className="text-[13px] tracking-[0.2em] text-gold uppercase">
            All-inclusive, every package
          </p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-ivory-muted">
            {included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <Link
            href="#quote"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Check your date <Arrow />
          </Link>
          <p className="text-sm text-muted-foreground">
            Travel fee outside Peel Region · {seasonNote}
          </p>
        </div>
      </div>
    </section>
  );
}
