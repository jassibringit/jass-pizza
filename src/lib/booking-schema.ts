import { z } from "zod";
import { addDays, format, isBefore, parseISO, startOfToday } from "date-fns";

export const eventTypes = [
  "Wedding / Mehndi",
  "Birthday",
  "Anniversary",
  "Corporate",
  "Religious / Community",
  "Something else",
] as const;

// "main": pizza is the meal, plan for every guest. "appetizer": plan for ~60% of guests.
export const serviceStyles = ["main", "appetizer"] as const;
export type ServiceStyle = (typeof serviceStyles)[number];
export const serviceStyleLabels: Record<ServiceStyle, string> = {
  main: "Main meal",
  appetizer: "Late-night / appetizer",
};

// Ovens run outdoors, so no events in these months. getMonth(): 0 = Jan … 11 = Dec.
const closedMonths = new Set([11, 0, 1, 2]); // Dec–Mar
export const seasonNote = "We book events from April to November.";

export function isClosedMonth(date: Date) {
  return closedMonths.has(date.getMonth());
}

// We need at least this much notice to prepare dough and plan the event.
export const MIN_LEAD_DAYS = 15;
export function earliestEventDate() {
  return format(addDays(startOfToday(), MIN_LEAD_DAYS), "yyyy-MM-dd");
}

// The date is optional, so emails and the dashboard show this when there isn't one.
export function formatEventDate(date: string | null | undefined, pattern = "EEEE, MMMM d, yyyy") {
  return date ? format(parseISO(date), pattern) : "Not decided yet";
}

// Empty inputs arrive as "", which should count as "not given" for optional fields.
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const eventDate = z.iso
  .date("Enter a valid date")
  .refine(
    (d) => !isBefore(parseISO(d), addDays(startOfToday(), MIN_LEAD_DAYS)),
    `Pick a date at least ${MIN_LEAD_DAYS} days from today`,
  )
  .refine((d) => !isClosedMonth(parseISO(d)), seasonNote);

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
      .min(10, "At least 10 guests")
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
