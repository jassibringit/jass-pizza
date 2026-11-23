import type { Inquiry } from "@/db/schema";

const TIME_ZONE = "America/Toronto";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Only the fields the numbers need, so tests can pass tiny objects.
export type StatsInput = Pick<Inquiry, "status" | "createdAt" | "eventDate">;

export type DashboardStats = {
  open: number; // new + quoted
  openThisWeek: number; // of those, how many arrived in the last 7 days
  needsReply: number; // new
  upcoming: number; // booked, event date from today on
  nextEventDate: string | null; // soonest upcoming, "2026-11-29"
  bookedThisMonth: number; // booked, event date in the current month
};

// Today's date in Toronto as "yyyy-mm-dd" (the en-CA format), whatever timezone the server runs in.
export function torontoDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

// "now" is passed in rather than read here, so tests can pick the date.
export function dashboardStats(inquiries: StatsInput[], now: Date): DashboardStats {
  const today = torontoDate(now); // "2026-11-18"
  const thisMonth = today.slice(0, 7); // "2026-11"

  const open = inquiries.filter((i) => i.status === "new" || i.status === "quoted");
  const booked = inquiries.filter((i) => i.status === "booked");

  // Event dates are "yyyy-mm-dd" strings, so comparing them as text sorts them by date.
  const upcomingDates = booked
    .map((i) => i.eventDate)
    .filter((date): date is string => date !== null && date >= today)
    .sort();

  return {
    open: open.length,
    openThisWeek: open.filter((i) => now.getTime() - i.createdAt.getTime() < WEEK_MS).length,
    needsReply: inquiries.filter((i) => i.status === "new").length,
    upcoming: upcomingDates.length,
    nextEventDate: upcomingDates[0] ?? null,
    bookedThisMonth: booked.filter((i) => i.eventDate?.startsWith(thisMonth)).length,
  };
}

// "Good morning" by the time in Toronto.
export function greeting(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
