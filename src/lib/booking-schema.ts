import { z } from 'zod'
import { isBefore, parseISO, startOfToday } from "date-fns";


export const eventTypes = [
  "Wedding / Pre-wedding",
  "Birthday",
  "Anniversary",
  "Corporate",
  "Other",
] as const;





export const QuoteSchema = z.object({
  eventType: z.enum(eventTypes, "Pick what you're celebrating"),
  // Must be a real date (YYYY-MM-DD) and not in the past.
  // Anything else would crash format() in book.ts.
  date: z.iso
    .date("Pick a date")
    .refine((d) => !isBefore(parseISO(d), startOfToday()), "Pick a future date"),
  guests: z.coerce
    .number("Enter a number")
    .int("Use a whole number")
    .min(30, "At least 30 guests")
    .max(100, "For more than 100 guests, mention it in the message"),
  city: z.string().trim().min(1, "Enter the venue city").max(100, "City name is too long"),
  name: z.string().trim().min(1, "Enter your name").max(100,"Name is too long"),
  // Optional: blank is fine, but if they type something it must be a real number.
  phone: z
    .string()
    .trim()
    .min(10, "Enter a phone number with area code")
    .max(20, "That phone number is too long")
    .or(z.literal("")),
  email: z.email("Enter a valid email").max(254, "That email is too long"),
  message: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
});

// The clean answers, and the error lists Zod returns for them (same keys).
export type QuoteData = z.infer<typeof QuoteSchema>;
export type QuoteErrors = {
  [key in keyof QuoteData]?: string[];
};

