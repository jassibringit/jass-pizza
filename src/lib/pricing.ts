// Pure (no React, database or clock) so the wizard and the Server Action
// share the same maths and can't disagree. Covered by pricing.test.ts.

export const PRICING = {
  // Per guest. "snack" = there's other food at the event too.
  ratePerGuest: { main: 21, snack: 16 },
  minimum: 850,
  // "Most range from … to …" in the quote section: from the minimum up to
  // this event's estimate, rounded to a tidy $100.
  typicalLargeEvent: { guests: 100, service: "main" },
  guestsPerPizza: { main: 1.3, snack: 2 }, // snack portions are smaller
  extraDoughBalls: 3,
  // high = low + $200 or 20%, whichever is more (room for travel, date, add-ons).
  rangeSpread: { minDollars: 200, percent: 0.2 },
  maxPizzas: 80, // more than this is a custom quote
  showHst: false, // turn on once HST-registered
  helpers: { secondHelperOverPizzas: 40 },
  // A "small event" has a low estimate under this. It gets fewer flavours and shorter service.
  smallEventUnder: 1000,
  servingHours: {
    main: { small: 2, normal: 2.5, long: 3.5, longOverPizzas: 60 },
    snack: { small: 1.5, normal: 1.5, long: 2.5, longOverPizzas: 40 },
  },
  deposit: 0.3, // 30% holds the date
  flavours: { small: 3, standard: 4 },
} as const;

export type Service = keyof typeof PRICING.ratePerGuest;

export type Estimate = {
  low: number | null; // null for custom quotes
  high: number | null;
  // Internal only: never shown to clients.
  pizzas: number;
  doughBalls: number;
  helpers: 1 | 2;
  // Shown to clients.
  servingHours: number;
  flavours: number;
  isCustom: boolean;
};

export function pizzasFor(guests: number, service: Service) {
  return Math.ceil(guests / PRICING.guestsPerPizza[service]);
}

// Guest price before the minimum and range are applied.
export function basePrice(guests: number, service: Service) {
  return guests * PRICING.ratePerGuest[service];
}

// The "Most range from … to …" figures in the quote section.
export function typicalPriceRange() {
  const { guests, service } = PRICING.typicalLargeEvent;
  const largest = estimate({ guests, service }).high ?? PRICING.minimum;
  return { low: PRICING.minimum, high: Math.round(largest / 100) * 100 };
}

// The largest guest count that still gets a range (more is a custom quote).
export function maxGuestsBeforeCustom(service: Service) {
  return Math.floor(PRICING.maxPizzas * PRICING.guestsPerPizza[service]);
}

// How big a snack portion is compared with a main-meal one (0.65 = 65%).
export function snackPortionShare() {
  return PRICING.guestsPerPizza.main / PRICING.guestsPerPizza.snack;
}

export function estimate({ guests, service }: { guests: number; service: Service }): Estimate {
  const pizzas = pizzasFor(guests, service);
  const doughBalls = pizzas + PRICING.extraDoughBalls;

  const helpers = pizzas > PRICING.helpers.secondHelperOverPizzas ? 2 : 1;

  const isCustom = pizzas > PRICING.maxPizzas;
  const low = isCustom ? null : Math.max(basePrice(guests, service), PRICING.minimum);
  const high =
    low === null
      ? null
      : low +
        Math.max(PRICING.rangeSpread.minDollars, Math.round(low * PRICING.rangeSpread.percent));

  const isSmallEvent = low !== null && low < PRICING.smallEventUnder;
  const flavours = isSmallEvent ? PRICING.flavours.small : PRICING.flavours.standard;

  const serving = PRICING.servingHours[service];
  const servingHours =
    pizzas > serving.longOverPizzas ? serving.long : isSmallEvent ? serving.small : serving.normal;

  return {
    low,
    high,
    pizzas,
    doughBalls,
    helpers,
    servingHours,
    flavours,
    isCustom,
  };
}

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function formatMoney(amount: number) {
  return money.format(amount);
}

// "$1,260 – $1,512", or a single price if both ends match.
export function formatRange(low: number, high: number) {
  return low === high ? formatMoney(low) : `${formatMoney(low)} – ${formatMoney(high)}`;
}

// For the owner's email and dashboard.
export function describeEstimate(est: Pick<Estimate, "low" | "high" | "isCustom">) {
  return est.isCustom || est.low === null || est.high === null
    ? "Custom quote"
    : formatRange(est.low, est.high);
}
