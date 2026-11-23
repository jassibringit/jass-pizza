import { describe, expect, it } from "vitest";
import { dashboardStats, greeting, torontoDate, type StatsInput } from "./dashboard-stats";

// Noon in Toronto on Wed Nov 18, 2026 (Toronto is UTC-5 in November).
const now = new Date("2026-11-18T17:00:00Z");
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const row = (overrides: Partial<StatsInput>): StatsInput => ({
  status: "new",
  createdAt: daysAgo(30),
  eventDate: null,
  ...overrides,
});

describe("dashboardStats", () => {
  it("counts new and quoted as open, and which arrived this week", () => {
    const stats = dashboardStats(
      [
        row({ status: "new", createdAt: daysAgo(1) }),
        row({ status: "quoted", createdAt: daysAgo(10) }),
        row({ status: "booked" }),
        row({ status: "lost", createdAt: daysAgo(1) }),
      ],
      now,
    );
    expect(stats.open).toBe(2);
    expect(stats.openThisWeek).toBe(1);
    expect(stats.needsReply).toBe(1);
  });

  it("finds upcoming booked events and the soonest one", () => {
    const stats = dashboardStats(
      [
        row({ status: "booked", eventDate: "2027-05-02" }),
        row({ status: "booked", eventDate: "2026-11-29" }),
        row({ status: "booked", eventDate: "2026-11-18" }), // today counts
        row({ status: "booked", eventDate: "2026-11-01" }), // already happened
        row({ status: "booked", eventDate: null }), // no date yet
        row({ status: "quoted", eventDate: "2026-11-20" }), // not booked
      ],
      now,
    );
    expect(stats.upcoming).toBe(3);
    expect(stats.nextEventDate).toBe("2026-11-18");
    expect(stats.bookedThisMonth).toBe(3); // Nov 29, Nov 18 and Nov 1
  });

  it("handles an empty list", () => {
    expect(dashboardStats([], now)).toEqual({
      open: 0,
      openThisWeek: 0,
      needsReply: 0,
      upcoming: 0,
      nextEventDate: null,
      bookedThisMonth: 0,
    });
  });
});

describe("Toronto time", () => {
  it("uses Toronto's date, not the server's", () => {
    // 2am UTC on Nov 19 is still 9pm on Nov 18 in Toronto.
    expect(torontoDate(new Date("2026-11-19T02:00:00Z"))).toBe("2026-11-18");
  });

  it("greets by Toronto's hour", () => {
    expect(greeting(new Date("2026-11-18T14:00:00Z"))).toBe("Good morning"); // 9am
    expect(greeting(new Date("2026-11-18T19:00:00Z"))).toBe("Good afternoon"); // 2pm
    expect(greeting(new Date("2026-11-19T02:00:00Z"))).toBe("Good evening"); // 9pm
  });
});
