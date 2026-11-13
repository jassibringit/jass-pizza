import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import type { QuoteData } from "@/lib/booking-schema";
import type { InquiryStatus, ManualInquiryData } from "@/lib/inquiry-schema";
import { requireOwner } from "@/lib/require-owner";

// Everything that reads or writes the inquiries table lives here,
// in CRUD order: create, read, update, delete.

// Turns the checked form answers into a database row.
export async function saveInquiry(booking: QuoteData) {
  await db.insert(inquiries).values({
    name: booking.name,
    eventType: booking.eventType,
    eventDate: booking.date ?? null, // form calls it "date", the table calls it "eventDate"
    guests: booking.guests,
    serviceStyle: booking.serviceStyle,
    city: booking.city,
    email: booking.email,
    phone: booking.phone ?? null, // not given → null
    message: booking.message ?? null,
  });
}

// A lead you add by hand (DM, call…). Empty optional fields become null.
export async function saveManualInquiry(data: ManualInquiryData) {
  await db.insert(inquiries).values({
    source: data.source,
    name: data.name,
    eventType: data.eventType,
    eventDate: data.date ?? null,
    guests: data.guests,
    serviceStyle: data.serviceStyle ?? null,
    city: data.city,
    email: data.email || null,
    phone: data.phone || null,
    handle: data.handle || null,
    message: data.message || null,
  });
}

// All inquiries, newest first.
export async function getInquiries() {
    await requireOwner();
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

// Moves one inquiry to a new pipeline status.
export async function updateInquiryStatus(id: number, status: InquiryStatus) {
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

// Removes one inquiry for good. Without .where() this would delete every row.
export async function deleteInquiry(id: number) {
  await db.delete(inquiries).where(eq(inquiries.id, id));
}
