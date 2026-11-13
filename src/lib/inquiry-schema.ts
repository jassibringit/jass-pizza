import { z } from "zod";
import { QuoteSchema, serviceStyles } from "./booking-schema";
// Where a lead is in the pipeline. The single source of truth:
// the database column, the validation and the <select> all use this list.

export const inquiryStatuses = ["new", "quoted", "booked", "lost"] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

// Every dashboard form sends the inquiry's id. Forms send text, so coerce "7" → 7.
const InquiryIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const UpdateStatusSchema = InquiryIdSchema.extend({
  status: z.enum(inquiryStatuses),
});

export const DeleteInquirySchema = InquiryIdSchema;

export const manualSources = ["instagram", "tiktok", "facebook", "phone", "referral", "other"] as const;
export const inquirySources = ["website", ...manualSources] as const;
export type InquirySource = (typeof inquirySources)[number];

export const ManualInquirySchema = QuoteSchema.extend({
  source: z.enum(manualSources, "Pick where they reached you"),
  // DMs often don't say yet, so these are optional when you log a lead yourself.
  serviceStyle: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(serviceStyles).optional(),
  ),
  guests: z.coerce.number("Enter a number").int("Use a whole number").min(1, "At least 1 guest"),
  email: z.email("Enter a valid email").max(254, "That email is too long").or(z.literal("")),
  handle: z.string().trim().max(50, "That handle is too long"),
})
  .refine((d) => d.email || d.phone || d.handle, {
    message: "Add at least one way to reach them: email, phone or handle",
    path: ["handle"],
  });

export type ManualInquiryData = z.infer<typeof ManualInquirySchema>;
export type ManualInquiryErrors = {
  [key in keyof ManualInquiryData]?: string[];
};
