"use server";

import { z } from "zod";
import { format, parseISO } from "date-fns";
import { Resend } from "resend";
import { QuoteSchema, type QuoteErrors } from "@/lib/booking-schema";

// What the action sends back to the form.
export type BookState = {
  errors?: QuoteErrors;
  success?: boolean;
  message?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function bookAction(
  prev: BookState,
  formData: FormData,
): Promise<BookState> {
  const data = Object.fromEntries(formData);

  // The real check: runs on the server, so it can't be skipped.
  const result = QuoteSchema.safeParse(data);
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  // The checked, cleaned answers (guests is a number, text is trimmed).
  const booking = result.data;
  const eventDate = format(parseISO(booking.date), "EEEE, MMMM d, yyyy");

  // Plain text: simple, and safe to put visitor input in.
  // Optional fields fall back to "—" so every line is always there.
  const text = `New quote request

EVENT
Celebrating: ${booking.eventType}
Date: ${eventDate}
Guests: ${booking.guests}
City: ${booking.city}
Indoor/outdoor: ${booking.setting ?? "—"}
Serving start: ${booking.startTime || "—"}
Venue: ${booking.venueType ?? "—"}

CONTACT
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone || "—"}
Heard about us: ${booking.heardFrom ?? "—"}

MESSAGE
${booking.message || "—"}

Hit reply to answer ${booking.name} directly.`;

  const { error } = await resend.emails.send({
    from: "Jass Pizza <onboarding@resend.dev>",
    to: process.env.BOOKING_EMAIL!,
    replyTo: booking.email,
    subject: `New inquiry: ${booking.eventType}, ${eventDate}, ${booking.guests} guests`,
    text,
  });

  if (error) {
    // Full details in the terminal for you, a friendly message for the visitor.
    console.error("Resend failed:", error);
    return {
      message:
        "Something went wrong sending your inquiry. Please try again in a minute.",
    };
  }

  return { success: true };
}
