import { z } from "zod";

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
