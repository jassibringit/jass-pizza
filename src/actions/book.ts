"use server";

import { z } from "zod";
import { QuoteSchema, type QuoteErrors } from "@/lib/booking-schema";
import { saveInquiry } from "@/db/inquiries";
import { sendBookingEmail } from "@/emails/send-booking-email";

// What the action sends back to the wizard.
export type BookState = {
  errors?: QuoteErrors;
  success?: boolean;
  message?: string;
};

// The wizard keeps every answer in state and sends them all at once on the last step,
// so this takes a plain object rather than FormData. `company` is the honeypot.
// Anyone can call a Server Action with anything, so the input is typed loosely and Zod decides.
export async function bookAction(
  prev: BookState,
  input: Record<string, unknown>,
): Promise<BookState> {
  // 1. Honeypot: only bots fill the hidden field. Pretend it worked.
  if (input.company) {
    return { success: true };
  }

  // 2. The real check: the browser validated each step, but anyone can call this directly.
  const result = QuoteSchema.safeParse(input);
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }
  const booking = result.data;

  // 3. Save first, so the inquiry is never lost. If it fails, the email still tells you.
  try {
    await saveInquiry(booking);
  } catch (err) {
    console.error("Saving inquiry failed:", err);
  }

  // 4. Notify the owner.
  const { error } = await sendBookingEmail(booking);
  if (error) {
    console.error("Resend failed:", error);
    return {
      message: "Something went wrong sending your inquiry. Please try again in a minute.",
    };
  }

  return { success: true };
}
