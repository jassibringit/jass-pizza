import { z } from "zod";
import { addDays, addMonths, format, isBefore, parseISO, startOfMonth, startOfToday } from "date-fns";
import type { Service } from "@/lib/pricing";

export const eventTypes = [
  "Wedding / Mehndi",
  "Birthday",
  "Anniversary",
  "Corporate",
  // "Religious / Community",
  "Something else",
] as const;

// "main": pizza is the main food. "snack": there's other food too (late-night / appetizer).
// Must match the services priced in src/lib/pricing.ts.
export const serviceStyles = ["main", "snack"] as const satisfies readonly Service[];
export type ServiceStyle = (typeof serviceStyles)[number];
export const serviceStyleLabels: Record<ServiceStyle, string> = {
  main: "Pizza is the main food",
  snack: "Other food too",
};

// Ovens run outdoors, so no events in these months. getMonth(): 0 = Jan … 11 = Dec.
const closedMonths = new Set([11, 0, 1, 2]); // Dec–Mar
export const seasonNote = "We book events from April to November.";

export function isClosedMonth(date: Date) {
  return closedMonths.has(date.getMonth());
}

// We need at least this much notice to prepare dough and plan the event.
export const MIN_LEAD_DAYS = 15;
export const MIN_GUESTS = 10;
// The first date we'd accept: enough notice, then skip past any closed months
// (so the date picker opens on a bookable month, not December).
export function earliestEventDate() {
  let date = addDays(startOfToday(), MIN_LEAD_DAYS);
  while (isClosedMonth(date)) date = startOfMonth(addMonths(date, 1));
  return format(date, "yyyy-MM-dd");
}

// The date is optional, so emails and the dashboard show this when there isn't one.
export function formatEventDate(date: string | null | undefined, pattern = "EEEE, MMMM d, yyyy") {
  return date ? format(parseISO(date), pattern) : "Not decided yet";
}

// Empty inputs arrive as "", which should count as "not given" for optional fields.
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

// A real date in season. Leads the owner adds by hand use this as is.
export const seasonDate = z.iso
  .date("Enter a valid date")
  .refine((d) => !isClosedMonth(parseISO(d)), seasonNote);

// Website inquiries also need enough notice.
const eventDate = seasonDate.refine(
  (d) => !isBefore(parseISO(d), addDays(startOfToday(), MIN_LEAD_DAYS)),
  `Pick a date at least ${MIN_LEAD_DAYS} days from today`,
);

// One schema per wizard step, so each screen only validates its own fields.
export const stepSchemas = [
  z.object({
    eventType: z.enum(eventTypes, "Pick what you're celebrating"),
  }),
  z.object({
    serviceStyle: z.enum(serviceStyles, "Pick a service style"),
  }),
  z.object({
    guests: z.coerce
      .number("Enter a number")
      .int("Use a whole number")
      .min(MIN_GUESTS, `At least ${MIN_GUESTS} guests`)
      .max(1000, "For very large events, mention it in your notes"),
  }),
  z.object({
    date: z.preprocess(emptyToUndefined, eventDate.optional()),
    city: z.string().trim().min(1, "Enter the venue city").max(100, "City name is too long"),
  }),
  z.object({
    name: z.string().trim().min(1, "Enter your name").max(100, "Name is too long"),
    email: z.email("Enter a valid email").max(254, "That email is too long"),
    phone: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .min(10, "Enter a phone number with area code")
        .max(20, "That phone number is too long")
        .optional(),
    ),
    message: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
    ),
  }),
] as const;

// The whole inquiry: every step combined. The server validates this.
export const QuoteSchema = stepSchemas[0]
  .extend(stepSchemas[1].shape)
  .extend(stepSchemas[2].shape)
  .extend(stepSchemas[3].shape)
  .extend(stepSchemas[4].shape);

// What the browser sends (strings) and what Zod hands back (cleaned, guests is a number).
export type QuoteInput = z.input<typeof QuoteSchema>;
export type QuoteData = z.infer<typeof QuoteSchema>;
export type QuoteErrors = {
  [key in keyof QuoteData]?: string[];
};
