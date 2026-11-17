import { afterEach, describe, expect, it, vi } from "vitest";
import { earliestEventDate, stepSchemas } from "./booking-schema";

// earliestEventDate() depends on today's date, so each test pins the clock.
function today(date: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${date}T12:00:00`));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("earliestEventDate", () => {
  it("is 15 days away during the season", () => {
    today("2027-05-01");
    expect(earliestEventDate()).toBe("2027-05-16");
  });

  it("skips to April when 15 days lands in winter", () => {
    today("2026-11-16"); // + 15 days = Dec 1, a closed month
    expect(earliestEventDate()).toBe("2027-04-01");
  });

  it("skips to April from the middle of winter", () => {
    today("2027-01-10");
    expect(earliestEventDate()).toBe("2027-04-01");
  });

  it("stays in November when there's still time", () => {
    today("2027-11-01");
    expect(earliestEventDate()).toBe("2027-11-16");
  });
});

describe("date step", () => {
  const dateStep = stepSchemas[3];

  it("accepts the earliest date it offers", () => {
    today("2026-11-16");
    expect(dateStep.safeParse({ date: earliestEventDate(), city: "Brampton" }).success).toBe(true);
  });

  it("rejects winter dates and dates too soon", () => {
    today("2027-05-01");
    expect(dateStep.safeParse({ date: "2027-12-05", city: "Brampton" }).success).toBe(false);
    expect(dateStep.safeParse({ date: "2027-05-10", city: "Brampton" }).success).toBe(false);
  });

  it("allows leaving the date empty", () => {
    expect(dateStep.safeParse({ date: "", city: "Brampton" }).success).toBe(true);
  });
});
