import { Resend } from "resend";
import { format, parseISO } from "date-fns";
import type { QuoteData } from "@/lib/booking-schema";
import BookingNotification from "@/emails/booking-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

// Emails the owner about a new inquiry.
// Returns Resend's { data, error } so the caller decides what the visitor sees.
export async function sendBookingEmail(booking: QuoteData) {
  const eventDate = format(parseISO(booking.date), "EEEE, MMMM d, yyyy");

  // Plain text: simple, and safe to put visitor input in.
  // Optional fields fall back to "—" so every line is always there.
  const text = `New quote request

EVENT
Celebrating: ${booking.eventType}
Date: ${eventDate}
Guests: ${booking.guests}
City: ${booking.city}

CONTACT
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone || "—"}

MESSAGE
${booking.message || "—"}

Hit reply to answer ${booking.name} directly.`;

  return resend.emails.send({
    from: "Jass Pizza <onboarding@resend.dev>",
    to: process.env.BOOKING_EMAIL!,
    replyTo: booking.email,
    subject: `New inquiry: ${booking.eventType}, ${eventDate}, ${booking.guests} guests`,
    react: BookingNotification(booking),
    text,
  });
}
