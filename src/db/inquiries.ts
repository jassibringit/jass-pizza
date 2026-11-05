import { desc } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import type { QuoteData } from "@/lib/booking-schema";

// Everything that reads or writes the inquiries table lives here.
// (Later: updateStatus() for /admin.)

// All inquiries, newest first.
export async function getInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

// Turns the checked form answers into a database row.
export async function saveInquiry(booking: QuoteData) {
  await db.insert(inquiries).values({
    name: booking.name,
    eventType: booking.eventType,
    eventDate: booking.date, // form calls it "date", the table calls it "eventDate"
    guests: booking.guests,
    city: booking.city,
    email: booking.email,
    phone: booking.phone || null, // empty "" becomes null
    message: booking.message || null,
  });
}
