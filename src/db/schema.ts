import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// One row per quote request from the booking form.
export const inquiries = pgTable("inquiries", {
  // Filled in by the database
  id: serial("id").primaryKey(),       // 1, 2, 3… filled in automatically
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), // when it arrived
  status: text("status").notNull().default("new"), // new → quoted → booked (changed later in /admin)

  // From the form: required in Zod, so required here
  name: text("name").notNull(),        // required text
  eventType: text("event_type").notNull(), // "Birthday", "Corporate"…
  eventDate: date("event_date").notNull(), // "2027-06-14"
  guests: integer("guests").notNull(),     // whole number, 30–100
  city: text("city").notNull(),
  email: text("email").notNull(),

  // Optional in the form, so no .notNull(): empty is saved as null
  phone: text("phone"),
  message: text("message"),
});

// The shape of one row when you read it back (id, createdAt, status included).
export type Inquiry = typeof inquiries.$inferSelect;
