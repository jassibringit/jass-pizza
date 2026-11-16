import { describe, expect, it } from "vitest";
import {
  PRICING,
  basePrice,
  estimate,
  formatMoney,
  formatRange,
  maxGuestsBeforeCustom,
  snackPortionShare,
  typicalPriceRange,
} from "./pricing";

describe("estimate: price range", () => {
  it.each([
    // guests, service, low, high
    [60, "main", 1260, 1512], // 20% of $1,260 is more than $200
    [100, "main", 2100, 2520],
    [100, "snack", 1600, 1920],
  ] as const)("%i guests, %s → $%i–$%i", (guests, service, low, high) => {
    const result = estimate({ guests, service });
    expect(result.isCustom).toBe(false);
    expect(result.low).toBe(low);
    expect(result.high).toBe(high);
  });

  it.each([
    [30, "main"],
    [40, "snack"],
    [45, "snack"],
  ] as const)("small events (%i guests, %s) show the minimum + $200", (guests, service) => {
    const result = estimate({ guests, service });
    expect(result.low).toBe(PRICING.minimum);
    expect(result.high).toBe(PRICING.minimum + 200);
  });

  it("every range is at least $200 wide, so the exact price needs a chat", () => {
    for (const service of ["main", "snack"] as const) {
      for (let guests = 10; guests <= 104; guests++) {
        const { low, high, isCustom } = estimate({ guests, service });
        if (isCustom) continue;
        expect(high! - low!).toBeGreaterThanOrEqual(200);
      }
    }
  });

  it("adding a guest never makes the event cheaper", () => {
    for (const service of ["main", "snack"] as const) {
      let previous = estimate({ guests: 1, service });
      for (let guests = 2; guests <= 200; guests++) {
        const current = estimate({ guests, service });
        if (current.isCustom) break;
        expect(current.low!).toBeGreaterThanOrEqual(previous.low!);
        expect(current.high!).toBeGreaterThanOrEqual(previous.high!);
        previous = current;
      }
    }
  });

  it("never quotes below the minimum", () => {
    expect(estimate({ guests: 10, service: "snack" }).low).toBe(PRICING.minimum);
  });

  it("130 guests on main is a custom quote, with no range", () => {
    const result = estimate({ guests: 130, service: "main" });
    expect(result.isCustom).toBe(true);
    expect(result.low).toBeNull();
    expect(result.high).toBeNull();
  });

  it("the cap is inclusive: 80 pizzas is still a range, 81 is custom", () => {
    expect(estimate({ guests: 104, service: "main" })).toMatchObject({ pizzas: 80, isCustom: false });
    expect(estimate({ guests: 105, service: "main" })).toMatchObject({ pizzas: 81, isCustom: true });
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
    [60, "main", 2.5], // 47 pizzas
    [80, "main", 3.5], // 62 pizzas
    [60, "snack", 1.5], // 30 pizzas
    [90, "snack", 2.5], // 45 pizzas
  ] as const)("%i guests, %s → %f hours", (guests, service, hours) => {
    expect(estimate({ guests, service }).servingHours).toBe(hours);
  });
});

describe("estimate: flavours", () => {
  it("events whose low estimate is under $1,000 get 3 flavours, the rest 4", () => {
    expect(estimate({ guests: 30, service: "main" }).flavours).toBe(3); // at the minimum
    expect(estimate({ guests: 47, service: "main" }).flavours).toBe(3); // $987
    expect(estimate({ guests: 48, service: "main" }).flavours).toBe(4); // $1,008
    expect(estimate({ guests: 62, service: "snack" }).flavours).toBe(3); // $992
    expect(estimate({ guests: 63, service: "snack" }).flavours).toBe(4); // $1,008
  });

  it("custom quotes get the standard 4", () => {
    expect(estimate({ guests: 130, service: "main" }).flavours).toBe(4);
  });
});

describe("basePrice", () => {
  it("is guests × the per-guest rate", () => {
    expect(basePrice(60, "main")).toBe(60 * 21);
    expect(basePrice(60, "snack")).toBe(60 * 16);
  });
});

describe("maxGuestsBeforeCustom", () => {
  it("is the last guest count that still gets a range", () => {
    for (const service of ["main", "snack"] as const) {
      const max = maxGuestsBeforeCustom(service);
      expect(estimate({ guests: max, service }).isCustom).toBe(false);
      expect(estimate({ guests: max + 1, service }).isCustom).toBe(true);
    }
  });
});

describe("typicalPriceRange", () => {
  it("runs from the minimum to the typical large event, rounded to $100", () => {
    expect(typicalPriceRange()).toEqual({ low: PRICING.minimum, high: 2500 }); // 100 main: $2,520
  });
});

describe("snackPortionShare", () => {
  it("snack portions are 65% of a main-meal portion", () => {
    expect(snackPortionShare()).toBeCloseTo(0.65);
  });
});

describe("formatRange", () => {
  it("joins two prices with an en dash", () => {
    expect(formatRange(1260, 1512)).toBe("$1,260 – $1,512");
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
