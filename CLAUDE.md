# Jass Pizza

Website and owner dashboard for Jass Pizza, a live pizza catering business serving Brampton, Peel Region and the GTA.

- **Public site:** marketing pages and a booking inquiry form
- **Owner dashboard (authenticated):** leads pipeline, quote tools, event reminders
- **AI features:** FAQ assistant for visitors, inquiry reply drafts with human approval before sending

## Stack

Next.js (App Router, `src/`), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, Neon Postgres + Drizzle ORM, Better Auth, Zod, Resend + React Email, Vercel AI SDK, Vercel Blob. Tests with Vitest and Playwright. Deployed on Vercel with GitHub Actions CI.

## Conventions

- Server Components by default. Add `"use client"` only to the smallest component that needs state, effects or browser APIs.
- Mutations use Server Actions, validated with Zod on the server.
- No hard-coded colours or fonts in components. Use the tokens in `src/app/globals.css`.
- Prefer role classes for UI (`bg-background`, `bg-primary`, `text-muted-foreground`, `border-border`) and brand classes for decorative accents (`text-gold`).
- Secrets and pricing live in environment variables or the database, never in source.
- Accessibility: semantic elements, labelled inputs, visible focus states, 44px minimum touch targets, responsive down to phone width.
- Keep changes small and focused, with a clear commit message.

## Design

Reference mockups are in `docs/mockups/` (`Main`, `Packages`, `Book`, `Assistant`, `Admin`). Treat them as visual and content references. Rebuild them as components with Tailwind, not inline styles. `Main.dc.html` sets the house style for all pages.
- mobile first design
- Dark, editorial look: lowercase headlines ending in a gold period (menu item names keep their capitals, e.g. "Classic Margherita"), gold italic accent words, pill buttons with "→", thin gold borders, full-width photography, numbered N°1–3 feature cards.
- Colours: ink `#0E0D0B`, ink-2 `#15130F`, ink-3 `#1C1A15`, gold `#C9A24A`, gold-bright `#E2C47A`, ivory `#F4EEE2`, ivory-muted `#D9D1C2`, stone `#B8AF9E`.
- Type: Playfair Display for headings (`font-display`), DM Sans for body text (`font-sans`), loaded with `next/font`.

## Domain rules

Content, validation and AI prompts must follow these rules.

- The public site shows a starting price, a typical range, and a per-inquiry estimate in the quote wizard (step 5). Final quotes are given personally (date, guests, travel, add-ons). The AI assistant may repeat those figures but never gives a final quote.
- Pricing rules live in one pure, tested module: `src/lib/pricing.ts` (`estimate()`), used by the wizard to show the estimate and by the Server Action to recalculate and save it. Never duplicate the maths elsewhere; change it there and run `npm test`. The owner's rate card and DM calculator at `/admin/pricing` read the same module. Pizza counts, dough balls and helpers are internal and never shown to clients. Estimate = one rate per guest (with a minimum price) to that plus $200 or 20%, whichever is more; the low end is the base price for a simple event, and travel, date and add-ons move it up. Small events (low estimate under $1,000, `PRICING.smallEventUnder`) include 3 flavours and, for main meals, 2 hours of service; the rest include 4 flavours and 2.5 hours (3.5 over 60 pizzas).
- No package tiers: price depends on guest count and service style, calculated by `src/lib/pricing.ts`. Every price number (rates, minimum, range, the quote section's "events start at" and typical range) lives in `PRICING` there; nowhere else.
- Every event includes: in-house dough and sauces, 12" pizzas made live in front of guests, setup and cleanup, plates, napkins and dips, no hidden fees (listed in `src/components/quote-section.tsx`).
- Maximum 4 flavours per event, chosen from the menu below. The source of truth for the menu is `src/components/menu-section.tsx`; keep the two in sync.
- Menu:
  - **Classic Margherita**: tomato sauce, fresh mozzarella, basil, olive oil.
  - **Cheese Pizza**: tomato sauce, a blend of mozzarella and parmesan.
  - **Roasted Garlic Bianca**: roasted garlic white sauce, mushrooms, mozzarella.
  - **Paneer Tikka Delight**: tomato sauce, tandoori paneer, bell peppers, onions, mozzarella.
  - **Classic Pepperoni**: tomato sauce, mozzarella, pepperoni.
  - **Tandoori Chicken Twist**: tomato sauce, tandoori chicken, onions, cilantro, mozzarella.
  - **Garden Veggie Classic**: tomato sauce, bell peppers, onions, mushrooms, mozzarella.
- Add-on: **Fresh-Filled Cannoli**: house-made ricotta filling, piped fresh at the event, finished with pistachio or chocolate chips. Available on request.
- Pizzas are made in two Gozney ovens. Never describe them as wood-fired.
- The ovens run outdoors only. Every event needs an outdoor spot of about 10 × 10 ft for ventilation (patio, driveway, backyard), even if guests are indoors.
- Dough and sauces are made in-house. Cannoli filling is house-made; the shells are not.
- A 30% deposit holds the date.
- Inquiries (the step-by-step form in the homepage `#quote` section, `src/components/quote-wizard/`; rules in `src/lib/booking-schema.ts`): event types are Wedding / Mehndi, Birthday, Anniversary, Corporate, Religious / Community, Something else. Minimum 10 guests. The date is optional, but when given it must be at least 15 days away and in season.
- Service style: "main" (pizza is the main food) or "snack" (there's other food too). Stored per inquiry, with the server-calculated estimate (low, high, pizzas, dough balls, helpers).
- Service area: Brampton, Peel and the GTA, with a travel fee outside Peel Region.
- Season: events run April to November only (no December–March). The rule lives in `isClosedMonth` and `seasonNote` in `src/lib/booking-schema.ts`.
