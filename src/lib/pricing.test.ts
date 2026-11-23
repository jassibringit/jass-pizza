import { describe, expect, it } from "vitest";
import {
  PRICING,
  basePrice,
  describeEstimate,
  estimate,
  formatMoney,
  formatRange,
  maxGuestsBeforeCustom,
  servingTimeRange,
  snackPortionShare,
  typicalPriceRange,
} from "./pricing";

describe("estimate: price range", () => {
  it.each([
    // guests, service, low, high
    [40, "main", 1030, 1430], // $850 + 10 × $18
    [50, "main", 1210, 1610],
    [60, "main", 1390, 1790],
    [80, "main", 1750, 2150],
    [60, "snack", 1075, 1475], // $850 + 15 × $15
    [100, "snack", 1675, 2075],
  ] as const)("%i guests, %s → $%i–$%i", (guests, service, low, high) => {
    const result = estimate({ guests, service });
    expect(result.isCustom).toBe(false);
    expect(result.low).toBe(low);
    expect(result.high).toBe(high);
  });

  it.each([
    [10, "main"],
    [30, "main"], // the last included guest
    [45, "snack"],
  ] as const)("%i guests, %s → the minimum + spread", (guests, service) => {
    const result = estimate({ guests, service });
    expect(result.low).toBe(PRICING.minimum);
    expect(result.high).toBe(PRICING.minimum + PRICING.rangeSpread);
  });

  it("every range is exactly the spread wide, so the exact price needs a chat", () => {
    for (const service of ["main", "snack"] as const) {
      for (let guests = 10; guests <= maxGuestsBeforeCustom(service); guests++) {
        const { low, high } = estimate({ guests, service });
        expect(high! - low!).toBe(PRICING.rangeSpread);
      }
    }
  });

  it("adding a guest never makes the event cheaper", () => {
    for (const service of ["main", "snack"] as const) {
      let previous = basePrice(1, service);
      for (let guests = 2; guests <= 200; guests++) {
        const current = basePrice(guests, service);
        expect(current).toBeGreaterThanOrEqual(previous);
        previous = current;
      }
    }
  });
});

describe("basePrice", () => {
  it("the minimum covers the included guests", () => {
    expect(basePrice(1, "main")).toBe(PRICING.minimum);
    expect(basePrice(30, "main")).toBe(PRICING.minimum);
    expect(basePrice(45, "snack")).toBe(PRICING.minimum);
  });

  it("each guest after that adds the extra-guest rate", () => {
    expect(basePrice(31, "main")).toBe(PRICING.minimum + 18);
    expect(basePrice(46, "snack")).toBe(PRICING.minimum + 15);
  });
});

describe("custom quotes", () => {
  it("start where the price reaches the cut-off", () => {
    expect(maxGuestsBeforeCustom("main")).toBe(93); // $1,984
    expect(maxGuestsBeforeCustom("snack")).toBe(121); // $1,990
    for (const service of ["main", "snack"] as const) {
      const max = maxGuestsBeforeCustom(service);
      expect(estimate({ guests: max, service }).isCustom).toBe(false);
      expect(estimate({ guests: max + 1, service }).isCustom).toBe(true);
    }
  });

  it("hide the price from the client but keep the formula price for the owner", () => {
    const result = estimate({ guests: 100, service: "main" });
    expect(result.low).toBeNull();
    expect(result.high).toBeNull();
    expect(result.formulaPrice).toBe(850 + 70 * 18); // $2,110
  });

  it("describe themselves with the formula price for the owner", () => {
    expect(describeEstimate(estimate({ guests: 100, service: "main" }))).toBe(
      "Custom quote (formula $2,110)",
    );
    expect(describeEstimate({ low: null, high: null, isCustom: true })).toBe("Custom quote");
  });
});

describe("estimate: internal numbers", () => {
  it("counts pizzas, dough balls and helpers", () => {
    expect(estimate({ guests: 60, service: "main" })).toMatchObject({
      pizzas: 47, // ceil(60 / 1.3)
      doughBalls: 50,
      helpers: 2,
    });
    expect(estimate({ guests: 60, service: "snack" })).toMatchObject({
      pizzas: 30, // ceil(60 / 2)
      doughBalls: 33,
      helpers: 1,
    });
  });

  it("switches to two helpers above 40 pizzas", () => {
    expect(estimate({ guests: 80, service: "snack" }).helpers).toBe(1); // 40 pizzas
    expect(estimate({ guests: 82, service: "snack" }).helpers).toBe(2); // 41 pizzas
  });
});

describe("estimate: serving time", () => {
  it.each([
    [30, "main", 2], // $850: small event
    [38, "main", 2], // $994: still under $1,000
    [40, "main", 2.5], // $1,030
    [80, "main", 3], // 62 pizzas: the 3-hour maximum
    [60, "snack", 1.5], // 30 pizzas
    [90, "snack", 2.5], // 45 pizzas
  ] as const)("%i guests, %s → %f hours", (guests, service, hours) => {
    expect(estimate({ guests, service }).servingHours).toBe(hours);
  });
});

describe("estimate: flavours", () => {
  it("small events (under $1,000) get 3 flavours, the rest 4", () => {
    expect(estimate({ guests: 30, service: "main" }).flavours).toBe(3); // $850
    expect(estimate({ guests: 38, service: "main" }).flavours).toBe(3); // $994
    expect(estimate({ guests: 39, service: "main" }).flavours).toBe(4); // $1,012
    expect(estimate({ guests: 54, service: "snack" }).flavours).toBe(3); // $985
    expect(estimate({ guests: 55, service: "snack" }).flavours).toBe(4); // exactly $1,000
  });

  it("custom quotes get the standard 4", () => {
    expect(estimate({ guests: 130, service: "main" }).flavours).toBe(4);
  });
});

describe("typicalPriceRange", () => {
  it("runs from the minimum to the custom-quote cut-off", () => {
    expect(typicalPriceRange()).toEqual({ low: PRICING.minimum, high: PRICING.customQuoteFrom });
  });
});

describe("servingTimeRange", () => {
  it("spans the shortest and longest serving times", () => {
    expect(servingTimeRange()).toEqual({ min: 1.5, max: 3 });
  });
});

describe("snackPortionShare", () => {
  it("snack portions are 65% of a main-meal portion", () => {
    expect(snackPortionShare()).toBeCloseTo(0.65);
  });
});

describe("formatRange", () => {
  it("joins two prices with an en dash", () => {
    expect(formatRange(1210, 1410)).toBe("$1,210 – $1,410");
  });

  it("shows one price when both ends match", () => {
    expect(formatRange(850, 850)).toBe("$850");
  });
});

describe("formatMoney", () => {
  it("formats Canadian dollars without cents", () => {
    expect(formatMoney(1440)).toBe("$1,440");
    expect(formatMoney(850)).toBe("$850");
  });
});
