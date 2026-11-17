import type { Metadata } from "next";
import { serviceStyleLabels, serviceStyles } from "@/lib/booking-schema";
import { PRICING, formatMoney, maxGuestsBeforeCustom } from "@/lib/pricing";
import { PriceCalculator } from "./price-calculator";

export const metadata: Metadata = {
  title: "Pricing",
  robots: { index: false, follow: false },
};

// Every number here comes from src/lib/pricing.ts, so this card always matches
// what the website estimates.
export default function PricingPage() {
  const rules: { label: string; value: string }[] = [
    {
      label: "Range shown to customers",
      value: `Price to price + ${formatMoney(PRICING.rangeSpread)}`,
    },
    {
      label: "Custom quote",
      value: `From ${formatMoney(PRICING.customQuoteFrom)} (${maxGuestsBeforeCustom("main") + 1}+ guests on main, ${maxGuestsBeforeCustom("snack") + 1}+ with other food). Chat first, then quote.`,
    },
    {
      label: "Flavours",
      value: `${PRICING.flavours.small} under ${formatMoney(PRICING.smallEventUnder)}, otherwise ${PRICING.flavours.standard}`,
    },
    {
      label: "Pizzas",
      value: `1 per ${PRICING.guestsPerPizza.main} guests (main), 1 per ${PRICING.guestsPerPizza.snack} (other food), + ${PRICING.extraDoughBalls} spare dough balls`,
    },
    {
      label: "Helpers",
      value: `1 up to ${PRICING.helpers.secondHelperOverPizzas} pizzas, 2 above`,
    },
    {
      label: "Serving time",
      value: `Main ${PRICING.servingHours.main.small} h under ${formatMoney(PRICING.smallEventUnder)}, ${PRICING.servingHours.main.normal} h above (${PRICING.servingHours.main.long} h over ${PRICING.servingHours.main.longOverPizzas} pizzas) · Other food ${PRICING.servingHours.snack.normal} h (${PRICING.servingHours.snack.long} h over ${PRICING.servingHours.snack.longOverPizzas} pizzas)`,
    },
    { label: "Deposit", value: `${PRICING.deposit * 100}% holds the date` },
    { label: "HST", value: PRICING.showHst ? "Shown as + HST" : "Not charged yet" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <p className="text-[13px] tracking-[0.25em] text-gold uppercase">Dashboard</p>
      <h1 className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl">
        pricing<span className="text-gold">.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-ivory-muted">
        Your rate card and a calculator for quoting DMs and calls. To change a price, edit{" "}
        <code className="text-gold">src/lib/pricing.ts</code> and run <code className="text-gold">npm test</code>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="rates-heading" className="border border-border p-6 md:p-8">
          <h2 id="rates-heading" className="font-display text-2xl font-semibold">
            rates<span className="text-gold">.</span>
          </h2>
          <table className="mt-6 w-full text-left">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="pb-3 font-normal">
                  Service
                </th>
                <th scope="col" className="pb-3 font-normal">
                  {formatMoney(PRICING.minimum)} includes
                </th>
                <th scope="col" className="pb-3 font-normal">
                  Each extra guest
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceStyles.map((style) => {
                return (
                  <tr key={style} className="border-t border-border">
                    <th scope="row" className="py-3 pr-4 font-normal">
                      {serviceStyleLabels[style]}
                    </th>
                    <td className="py-3 pr-4">{PRICING.includedGuests[style]} guests</td>
                    <td className="py-3 font-display text-xl text-gold">
                      {formatMoney(PRICING.extraGuestRate[style])}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <dl className="mt-8 flex flex-col">
            {rules.map((rule) => (
              <div
                key={rule.label}
                className="grid gap-1 border-t border-border py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
              >
                <dt className="text-sm text-muted-foreground">{rule.label}</dt>
                <dd className="text-sm">{rule.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <PriceCalculator />
      </div>
    </main>
  );
}
