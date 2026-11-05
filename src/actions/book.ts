"use server";

import { z } from "zod";
import { QuoteSchema, type QuoteErrors } from "@/lib/booking-schema";
import { saveInquiry } from "@/db/inquiries";
import { sendBookingEmail } from "@/emails/send-booking-email";

// What the action sends back to the form.
export type BookState = {
  errors?: QuoteErrors;
  success?: boolean;
  message?: string;
};

// The recipe: bots → check → save → notify → reply.
export async function bookAction(
  prev: BookState,
  formData: FormData,
): Promise<BookState> {
  const data = Object.fromEntries(formData);

  // 1. Honeypot: only bots fill the hidden field. Pretend it worked.
  if (data.company) {
    return { success: true };
  }

  // 2. The real check: runs on the server, so it can't be skipped.
  const result = QuoteSchema.safeParse(data);
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }
  const booking = result.data; // checked and cleaned (guests is a number, text is trimmed)

  // 3. Save first, so the inquiry is never lost.
  // If it fails, keep going: the email below still tells you about the lead.
  try {
    await saveInquiry(booking);
  } catch (err) {
    console.error("Saving inquiry failed:", err);
  }

  // 4. Notify the owner.
  const { error } = await sendBookingEmail(booking);
  if (error) {
    // Full details in the terminal for you, a friendly message for the visitor.
    console.error("Resend failed:", error);
    return {
      message:
        "Something went wrong sending your inquiry. Please try again in a minute.",
    };
  }

  // 5. Tell the form it worked.
  return { success: true };
}
