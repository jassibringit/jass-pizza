"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { serviceStyleLabels, serviceStyles, type ServiceStyle } from "@/lib/booking-schema";
import { describeEstimate, estimate } from "@/lib/pricing";

const MIN_GUESTS = 10;
const MAX_GUESTS = 200;

// For a first conversation. Same maths as the website; the full calculator is on the rate card.
export function QuickEstimate() {
  const [guests, setGuests] = useState(60);
  const [service, setService] = useState<ServiceStyle>("main");
  const est = estimate({ guests, service });

  return (
    <section aria-labelledby="quick-estimate-heading" className="border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="quick-estimate-heading" className="font-display text-2xl font-semibold">
            Quick estimate<span className="text-gold">.</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">For a first conversation.</p>
        </div>
        <Calculator aria-hidden="true" className="size-5 text-gold" />
      </div>

      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <label htmlFor="quick-guests" className="text-sm">
            Guest count
          </label>
          <output htmlFor="quick-guests" className="font-display text-2xl text-gold">
            {guests}
            {guests === MAX_GUESTS && "+"}
          </output>
        </div>
        <input
          id="quick-guests"
          type="range"
          min={MIN_GUESTS}
          max={MAX_GUESTS}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-2 min-h-11 w-full cursor-pointer accent-gold"
        />
        <div aria-hidden="true" className="flex justify-between text-xs text-muted-foreground">
          <span>{MIN_GUESTS}</span>
          <span>{MAX_GUESTS}+</span>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="sr-only">Service style</legend>
        <div className="grid grid-cols-2 gap-2">
          {serviceStyles.map((style) => (
            <button
              key={style}
              type="button"
              aria-pressed={service === style}
              onClick={() => setService(style)}
              className="min-h-11 border border-border px-3 text-sm text-ivory-muted transition-colors hover:border-gold/60 aria-pressed:border-gold aria-pressed:bg-gold/10 aria-pressed:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {serviceStyleLabels[style]}
            </button>
          ))}
        </div>
      </fieldset>

      <div
        aria-live="polite"
        className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-5"
      >
        <p className="text-sm text-muted-foreground">Planning estimate</p>
        <p className="font-display text-2xl text-gold">{describeEstimate(est)}</p>
      </div>
    </section>
  );
}
