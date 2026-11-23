// Pure (no React, database or clock) so the wizard and the Server Action
// share the same maths and can't disagree. Covered by pricing.test.ts.

export const PRICING = {
  // The base price covers the first guests; each guest after that adds the extra rate.
  // "snack" = there's other food at the event too (smaller portions).
  minimum: 850,
  includedGuests: { main: 30, snack: 45 },
  extraGuestRate: { main: 18, snack: 15 },
  // The estimate shows price to price + this (room for travel, date, add-ons).
  rangeSpread: 400,
  // From this price up, events get a custom quote after a chat instead of a number.
  customQuoteFrom: 2000,
  guestsPerPizza: { main: 1.3, snack: 2 }, // snack portions are smaller
  extraDoughBalls: 3,
  showHst: false, // turn on once HST-registered
  helpers: { secondHelperOverPizzas: 40 },
  // A "small event" is priced under this. It gets fewer flavours and shorter service.
  smallEventUnder: 1000,
  servingHours: {
    main: { small: 2, normal: 2.5, long: 3, longOverPizzas: 60 },
    snack: { small: 1.5, normal: 1.5, long: 2.5, longOverPizzas: 40 },
  },
  extraHalfHour: 60, // each extra half hour of live serving
  deposit: 0.3, // 30% holds the date
  flavours: { small: 3, standard: 4 },
} as const;

export type Service = keyof typeof PRICING.extraGuestRate;

export type Estimate = {
  low: number | null; // null for custom quotes
  high: number | null;
  // Internal only: never shown to clients.
  formulaPrice: number; // the calculated price, even for custom quotes (owner's starting point)
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

// The minimum covers the included guests; every guest after that adds the extra rate.
export function basePrice(guests: number, service: Service) {
  const extraGuests = Math.max(guests - PRICING.includedGuests[service], 0);
  return PRICING.minimum + extraGuests * PRICING.extraGuestRate[service];
}

// The "Most range from … to …" figures in the quote section.
export function typicalPriceRange() {
  return { low: PRICING.minimum, high: PRICING.customQuoteFrom };
}

// The largest guest count that still gets a price (more is a custom quote).
export function maxGuestsBeforeCustom(service: Service) {
  const roomUnderCutOff = PRICING.customQuoteFrom - PRICING.minimum;
  const extraGuests = Math.ceil(roomUnderCutOff / PRICING.extraGuestRate[service]) - 1;
  return PRICING.includedGuests[service] + extraGuests;
}

// Shortest and longest live serving time across all events, for the FAQ.
export function servingTimeRange() {
  const hours = Object.values(PRICING.servingHours).flatMap((s) => [s.small, s.normal, s.long]);
  return { min: Math.min(...hours), max: Math.max(...hours) };
}

// How big a snack portion is compared with a main-meal one (0.65 = 65%).
export function snackPortionShare() {
  return PRICING.guestsPerPizza.main / PRICING.guestsPerPizza.snack;
}

export function estimate({ guests, service }: { guests: number; service: Service }): Estimate {
  const pizzas = pizzasFor(guests, service);
  const doughBalls = pizzas + PRICING.extraDoughBalls;
  const helpers = pizzas > PRICING.helpers.secondHelperOverPizzas ? 2 : 1;

  const formulaPrice = basePrice(guests, service);
  const isCustom = formulaPrice >= PRICING.customQuoteFrom;
  const low = isCustom ? null : formulaPrice;
  const high = low === null ? null : low + PRICING.rangeSpread;

  const isSmallEvent = !isCustom && formulaPrice < PRICING.smallEventUnder;
  const flavours = isSmallEvent ? PRICING.flavours.small : PRICING.flavours.standard;

  const serving = PRICING.servingHours[service];
  const servingHours =
    pizzas > serving.longOverPizzas ? serving.long : isSmallEvent ? serving.small : serving.normal;

  return {
    low,
    high,
    formulaPrice,
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

// "$1,210 – $1,410", or a single price if both ends match.
export function formatRange(low: number, high: number) {
  return low === high ? formatMoney(low) : `${formatMoney(low)} – ${formatMoney(high)}`;
}

// For the owner's email and dashboard. Custom quotes show the formula price as a starting point.
export function describeEstimate(
  est: Pick<Estimate, "low" | "high" | "isCustom"> & { formulaPrice?: number },
) {
  if (est.isCustom || est.low === null || est.high === null) {
    return est.formulaPrice
      ? `Custom quote (formula ${formatMoney(est.formulaPrice)})`
      : "Custom quote";
  }
  return formatRange(est.low, est.high);
}
