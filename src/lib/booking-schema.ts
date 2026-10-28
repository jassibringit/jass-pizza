import { z } from 'zod'


export const eventTypes = [
  "Wedding / Pre-wedding",
  "Birthday",
  "Anniversary",
  "Corporate",
  "Other",
] as const;

export const venueTypes = [
  "Home / backyard",
  "Banquet hall",
  "Park or outdoor venue",
  "Office",
  "Other",
] as const;

export const heardFromOptions = [
  "Instagram",
  "Google",
  "Friend or family",
  "Saw you at an event",
  "Other",
] as const;

export const settings = ["Indoor", "Outdoor"] as const;




export const QuoteSchema = z.object({
  eventType: z.enum(eventTypes, "Pick what you're celebrating"),
  date: z.string().min(1, "Pick a date"),
  guests: z.coerce
    .number("Enter a number")
    .int("Use a whole number")
    .min(30, "At least 30 guests")
    .max(100, "For more than 100 guests, mention it in the message"),
  city: z.string().trim().min(1, "Enter the venue city"),
  setting: z.enum(settings).optional(),
  startTime: z.string().optional(),
  venueType: z.enum(venueTypes).optional(),
  name: z.string().trim().min(1, "Enter your name"),
  // Optional: blank is fine, but if they type something it must be a real number.
  phone: z
    .string()
    .trim()
    .min(10, "Enter a phone number with area code")
    .or(z.literal("")),
  email: z.email("Enter a valid email"),
  heardFrom: z.enum(heardFromOptions).optional(),
  message: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
});

// The clean answers, and the error lists Zod returns for them (same keys).
export type QuoteData = z.infer<typeof QuoteSchema>;
export type QuoteErrors = {
  [key in keyof QuoteData]?: string[];
};

