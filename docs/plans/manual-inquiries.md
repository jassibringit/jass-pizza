# Manual inquiries

Leads that arrive by Instagram/TikTok DM, phone or referral are added from the dashboard
(`/inquiries/new`), so every lead lives in the `inquiries` table.

## Data

- `source`: `website` (booking form) or one of `manualSources` in `src/lib/inquiry-schema.ts`.
  Defaults to `website`, which backfilled existing rows (migration `0002`).
- `handle`: optional social username, stored with or without the leading `@`.
- `email`: nullable. The public form still requires it through `QuoteSchema`.

## Validation

`ManualInquirySchema` extends `QuoteSchema`:

- `source` must be a manual source (not `website`)
- any guest count ≥ 1 (no 30-guest minimum)
- email, phone, handle, message optional
- at least one of email / phone / handle (`.refine`, error shown on `handle`)

## Flow

`/inquiries/new` → `createInquiryAction` (owner check → Zod → `saveManualInquiry`) →
`revalidatePath` + redirect to `/inquiries`.

## Testing checklist

- [ ] Instagram lead with only a handle saves and shows the source icon + profile link
- [ ] No email, phone or handle → "Add at least one way to reach them"
- [ ] Empty submit → every required field shows an error
- [ ] Public quote form still requires email
- [ ] Changing a source option to `website` in DevTools is rejected
- [ ] Logged out: `/inquiries/new` redirects to `/sign-in`

## Later

- Edit an inquiry (`/inquiries/[id]/edit`)
- Filter the list by source or status
- Money: quote / deposit columns (store cents as integers), later a `payments` table
