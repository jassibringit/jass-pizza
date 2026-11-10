# Feature: add inquiries manually (Instagram, TikTok, phone…)

**Goal:** when someone DMs Jass Pizza instead of using the website form, I can add them
from the dashboard so _every_ lead lives in one place (the `inquiries` table).

**Status:** Steps 0–7 done (form v1 plain → v2 errors → v3 styled). Next: Step 8. Tick the boxes as you go.

---

## The idea in one picture

Same chain as the booking form and the status feature, so it's the 3rd time you build it:

```
/inquiries/new   your form (UI)
      ↓  FormData
createInquiryAction   the Server Action: validate → save → go back to the list
      ↓  checked data
saveManualInquiry   the data layer: knows the table's column names
      ↓  SQL
Neon
```

Build it **bottom-up** (data first, screen last), testing after each step.



## Step 1. Two new lists: where leads come from

File: `src/lib/inquiry-schema.ts`

- [ ] Add the sources. Website is separate because only the website form uses it:

```ts
export const manualSources = ["instagram", "tiktok", "facebook", "phone", "referral", "other"] as const;
export const inquirySources = ["website", ...manualSources] as const;
export type InquirySource = (typeof inquirySources)[number];
```

**Like you're 10:** a list of "doors" a customer can walk in through. You write the list
once, and the database, the checks and the dropdown all read the same list.

**Pro pattern: single source of truth.** Same as `inquiryStatuses`. `...manualSources`
("spread") copies one list into another, so you never type "instagram" twice.

---

## Step 2. Teach the table about the new info

File: `src/db/schema.ts`

- [ ] Add `source`: required, defaults to `"website"`
  `source: text("source", { enum: inquirySources }).notNull().default("website"),`
- [ ] Add `handle`: optional, their @username
  `handle: text("handle"),`
- [ ] Make `email` optional: remove `.notNull()` (a DM might not give an email)
- [ ] `npx drizzle-kit generate`, **open the new .sql file and read it**
- [ ] `npx drizzle-kit migrate`
- [ ] Neon → Tables: old rows now say `source = website`

**Like you're 10:** the table is a spreadsheet. You're adding two new columns. The
default fills in the old rows, like writing "website" in every empty box automatically.

**Watch out:**
- If generate says _Cannot find module '@/lib/…'_, change the import at the top of
  `schema.ts` to `../lib/inquiry-schema` (drizzle-kit doesn't understand `@/`).
- Making email optional is safe. The **website** form still requires it, because its
  Zod schema says so. **Rule: the table is loose enough for every form; each form's Zod
  is as strict as that form needs.**

**Pro pattern: migrations with defaults.** Adding a required column to a table that
already has rows only works if you give a default (remember the "column does not exist"
and "null values" errors? This is how pros avoid them).

---

## Step 3. Show it on the card (before building the form)

File: `src/app/inquiries/inquiry-card.tsx`

- [ ] Show the source (small text like "via Instagram") near the event type
- [ ] Show `handle` in the contact list when it exists
- [ ] Guard email: only show the mailto link when `inquiry.email` exists (`inquiry.email && …`),
      like you already do for phone
- [ ] Test: every existing card says "via website"

**Like you're 10:** before you build the new door, make sure the room can show who came
through which door.

**Pro habit:** handle `null` everywhere a column became optional. TypeScript helps: the
`Inquiry` type now says `email: string | null`.

---

## Step 4. The rules for YOUR form (Zod)

File: `src/lib/inquiry-schema.ts`

- [ ] `ManualInquirySchema`: what you must fill in when adding a lead by hand
  - `source`: `z.enum(manualSources)` (not website)
  - `name`, `eventType`, `date`, `city`: required (same as the website)
  - `guests`: whole number, at least 1 (no 30 minimum: it's your choice to take small parties)
  - `email`, `phone`, `handle`, `message`: optional (`.or(z.literal(""))` like phone)
- [ ] `.refine(...)`: **at least one** of email / phone / handle, or the lead is useless
- [ ] `export type ManualInquiryData = z.infer<typeof ManualInquirySchema>`
- [ ] `export type ManualInquiryErrors = { [key in keyof ManualInquiryData]?: string[] }`

```ts
.refine((d) => d.email || d.phone || d.handle, {
  message: "Add at least one way to reach them",
  path: ["handle"], // which field shows the error
})
```

**Like you're 10:** the bouncer at the door. The website bouncer is strict (email
required). Your bouncer is friendlier, but still won't let in a lead you can't contact.

**Pro pattern: rules that involve several fields** go in `.refine()` on the whole object.
Fields can't check each other, but the object can see all of them.

---

## Step 5. The data function

File: `src/db/inquiries.ts`

- [ ] `saveManualInquiry(data: ManualInquiryData)`: like `saveInquiry`, plus `source` and
      `handle`, and empty optional fields → `null` (`data.email || null`)

**Like you're 10:** the only person allowed to write in the spreadsheet. Everyone else
hands them a note.

**Pro pattern: the data layer.** The action never knows column names (`event_date`); only
this file does. Later: `$inferInsert` (`typeof inquiries.$inferInsert`) is the type of "a
new row". Look at it on hover, it's how pros type insert functions.

---

## Step 6. The Server Action

File: `src/actions/inquiries.ts`

- [ ] `createInquiryAction(prev, formData)`: the `useActionState` shape, like `bookAction`
  1. `// TODO (auth)` at the top
  2. `safeParse`, then on failure return `{ errors: z.flattenError(...).fieldErrors }`
  3. `await saveManualInquiry(result.data)`
  4. `revalidatePath("/inquiries")`
  5. `redirect("/inquiries")` (from `next/navigation`)

**Like you're 10:** the shop assistant. Checks your note (Zod), gives it to the
spreadsheet person, then walks you back to the list.

**Watch out:** `redirect()` works by _throwing_ a special signal. Never put it inside a
`try { }`, or your `catch` swallows it and nothing happens. Put it at the very end.

**Pro pattern: Post/Redirect/Get.** After a form changes data, send the person to a normal
page. Refreshing then won't submit the form twice.

---

## Step 7. The page and the form

Files (new):
- `src/app/inquiries/new/page.tsx`: the URL `/inquiries/new`. A Server Component with
  the heading ("add an inquiry.") and the form
- `src/app/inquiries/new/manual-inquiry-form.tsx`: `"use client"`, the form

- [ ] Fields: source (radio pills or a select), name, handle, phone, email, event type,
      date (reuse `EventDatePicker`), guests, city, notes (`message`)
- [ ] Copy the patterns from `quote-section.tsx`: `useActionState` wrapper, `errors`
      state, `clearError`, `aria-invalid` / `aria-describedby`, the "Saving…" button
- [ ] Phone-first layout: one column, `md:grid-cols-2` on bigger screens

**Like you're 10:** a folder inside a folder makes a longer address.
`app/inquiries/new/page.tsx` → `/inquiries/new`.

**Pro pattern: REST-style URLs.** `/things` = list, `/things/new` = add form,
`/things/42` = one thing. You'll see this in every app.

**Pro habit:** reuse what you've built (styles, the date picker, the error pattern)
instead of inventing it again.

---

## Step 8. A way in

File: `src/app/inquiries/page.tsx`

- [ ] Add a pill link `+ Add inquiry →` next to the heading, `href="/inquiries/new"`
- [ ] Use `<Link>` from `next/link`, not `<a>` (no full page reload)

---

## Step 9. Test like a pro

- [ ] Add an Instagram lead with only a handle → saved, shows "via Instagram" + handle
- [ ] Submit with no email, phone or handle → error "Add at least one way to reach them"
- [ ] Submit empty → every required field shows its error
- [ ] Website form still requires email (it has its own schema)
- [ ] Tamper: DevTools, change a source option to `value="website"` → rejected
- [ ] Neon: new row has `source = instagram`, `email = NULL`
- [ ] Commit: `git commit -m "Add manual inquiries from social media"`

---

## What this feature teaches (job interview words)

| You did | Interview word |
|---|---|
| One list used by DB, Zod and UI | single source of truth |
| Adding columns with a default | schema migration, backfill |
| Different rules per form, one table | validation at the boundary |
| `.refine()` across fields | cross-field validation |
| UI → action → data layer | layered architecture, separation of concerns |
| `redirect()` after save | Post/Redirect/Get |
| `/inquiries/new` | RESTful routing, nested routes |
| Copying the form pattern | reusable patterns, consistency |

## Not now (later)

- Auth: the `TODO (auth)` comments. **Don't deploy `/inquiries` until it has a login.**
- Edit an inquiry (`/inquiries/42/edit`): same pattern, with update
- Filter the list by source or status
