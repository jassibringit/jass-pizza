import { serviceStyles } from "@/lib/booking-schema";
import { inquirySources, inquiryStatuses } from "@/lib/inquiry-schema";
import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// After changing this file: npx drizzle-kit generate → read the new .sql → npx drizzle-kit migrate

// One row per lead: from the website form, or added by hand from a DM or call.
export const inquiries = pgTable("inquiries", {
  // Filled in by the database
  id: serial("id").primaryKey(), // 1, 2, 3… filled in automatically
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), // when it arrived
  status: text("status", { enum: inquiryStatuses }).notNull().default("new"), // new → quoted → booked / lost
  source: text("source", { enum: inquirySources }).notNull().default("website"), // where the lead came from

  // Required for every lead (Zod checks them before saving)
  name: text("name").notNull(),
  eventType: text("event_type").notNull(), // "Birthday", "Corporate"…
  eventDate: date("event_date"), // "2027-06-14"; optional, people may not have a date yet
  guests: integer("guests").notNull(), // whole number
  serviceStyle: text("service_style", { enum: serviceStyles }), // main | appetizer (older rows: empty)
  city: text("city").notNull(),

  // Optional: a DM might give only one way to reach them, so no .notNull() (empty = null).
  // The website form still requires email: that rule lives in its Zod schema.
  email: text("email"),
  phone: text("phone"),
  handle: text("handle"), // their @username on Instagram / TikTok
  message: text("message"), // what they wrote, or your notes
});

// The shape of one row when you read it back (id, createdAt, status, source included).
export type Inquiry = typeof inquiries.$inferSelect;
