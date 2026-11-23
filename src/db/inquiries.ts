import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import type { QuoteData } from "@/lib/booking-schema";
import { estimate, type Estimate } from "@/lib/pricing";
import type { InquiryStatus, ManualInquiryData } from "@/lib/inquiry-schema";
import { requireOwner } from "@/lib/require-owner";

// Everything that reads or writes the inquiries table lives here,
// in CRUD order: create, read, update, delete.

// The pricing columns, from an estimate calculated on the server.
function estimateColumns(est: Estimate) {
  return {
    estimateLow: est.low,
    estimateHigh: est.high,
    pizzas: est.pizzas,
    doughBalls: est.doughBalls,
    helpers: est.helpers,
  };
}

// Turns the checked form answers into a database row.
export async function saveInquiry(booking: QuoteData, est: Estimate) {
  await db.insert(inquiries).values({
    ...estimateColumns(est),
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
    // Only estimable once you know the service style.
    ...(data.serviceStyle
      ? estimateColumns(estimate({ guests: data.guests, service: data.serviceStyle }))
      : {}),
    city: data.city,
    email: data.email || null,
    phone: data.phone || null,
    handle: data.handle || null,
    message: data.message || null,
  });
}

// All inquiries, newest first. cache() shares one result per request, so the
// sidebar badge and the page don't each hit the database.
export const getInquiries = cache(async () => {
  await requireOwner();
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
});

// Moves one inquiry to a new pipeline status.
export async function updateInquiryStatus(id: number, status: InquiryStatus) {
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

// Removes one inquiry for good. Without .where() this would delete every row.
export async function deleteInquiry(id: number) {
  await db.delete(inquiries).where(eq(inquiries.id, id));
}

export async function getInquiry(id: number) {
  const rows = await db.select().from(inquiries).where(eq(inquiries.id, id));
  return rows[0];
}
