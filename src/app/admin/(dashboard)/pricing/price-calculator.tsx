"use client";

import { useState } from "react";
import { serviceStyleLabels, serviceStyles, type ServiceStyle } from "@/lib/booking-schema";
import { PRICING, describeEstimate, estimate, formatRange } from "@/lib/pricing";

const pillClass =
  "inline-flex min-h-11 items-center rounded-full border px-5 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// Quote a DM or phone inquiry with the same maths as the website estimate.
export function PriceCalculator() {
  const [guests, setGuests] = useState("60");
  const [service, setService] = useState<ServiceStyle>("main");

  const count = Number(guests);
  const est = count >= 1 && Number.isInteger(count) ? estimate({ guests: count, service }) : null;

  const rows: { label: string; value: string }[] = est
    ? [
        { label: "Pizzas", value: `${est.pizzas} (${est.doughBalls} dough balls)` },
        { label: "Helpers", value: String(est.helpers) },
        { label: "Serving time", value: `${est.servingHours} hours` },
        { label: "Flavours", value: `Up to ${est.flavours}` },
      ]
    : [];

  return (
    <div className="border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-2xl font-semibold">
        Quick quote<span className="text-gold">.</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">For DMs and calls. Same maths as the website.</p>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="calc-guests" className="text-sm text-muted-foreground">
            Guests
          </label>
          <input
            id="calc-guests"
            type="number"
            inputMode="numeric"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="min-h-11 w-32 border-0 border-b border-border bg-transparent px-0 text-2xl text-foreground scheme-dark focus-visible:border-b-2 focus-visible:border-gold focus-visible:outline-none"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm text-muted-foreground">Other food at the event?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {serviceStyles.map((style) => (
              <button
                key={style}
                type="button"
                aria-pressed={service === style}
                onClick={() => setService(style)}
                className={`${pillClass} ${
                  service === style
                    ? "border-gold bg-gold text-primary-foreground"
                    : "border-border text-foreground hover:border-gold"
                }`}
              >
                {serviceStyleLabels[style]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {est && (
        <div className="mt-8 border-t border-border pt-6" aria-live="polite">
          <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">Quote</p>
          <p className="mt-1 font-display text-4xl font-semibold text-gold">{describeEstimate(est)}</p>
          {est.low !== null && est.high !== null && (
            <p className="mt-1 text-sm text-muted-foreground">
              {Math.round(PRICING.deposit * 100)}% deposit:{" "}
              {formatRange(Math.round(est.low * PRICING.deposit), Math.round(est.high * PRICING.deposit))}
            </p>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="mt-1">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
