# AI reply draft failures

Every time a draft needs fixing before sending, add an entry. Re-check the whole list after each prompt change. Later, each entry becomes an eval case.

No customer names, emails or phone numbers here (the repo is public). Describe the inquiry instead.

Status: **Open** (not fixed), **Re-test** (prompt changed, check a few new drafts), **Fixed** (passed 3 drafts in a row).

---

## 1. Calendar contradiction
- **Date:** 2026-11-20
- **Inquiry:** 45 guests, main meal, Brampton
- **Wrong:** Said "we'll check the calendar" and also asked them to go ahead
- **Should:** Never mention the calendar or availability
- **Fix:** Replaced the calendar rule
- **Status:** Re-test

## 2. Label leak
- **Date:** 2026-11-20
- **Inquiry:** 45 guests, main meal, Brampton
- **Wrong:** Copied the label "price to quote"
- **Should:** Write the price naturally
- **Fix:** Rule with an example sentence
- **Status:** Re-test

## 3. No greeting
- **Date:** 2026-11-20
- **Inquiry:** 45 guests, main meal, Brampton
- **Wrong:** No "Hi" greeting
- **Should:** Start with "Hi" + first name
- **Fix:**
- **Status:** Open

## 4. Deposit too early
- **Date:** 2026-11-20
- **Inquiry:** 35 guests, North York
- **Wrong:** Mentioned the deposit at the start
- **Should:** Deposit only at the end
- **Fix:** Split price and deposit lines + structure rule
- **Status:** Open

## 5. "Total" with a travel fee
- **Date:** 2026-11-20
- **Inquiry:** 35 guests, North York
- **Wrong:** Called it "the total" when a travel fee applies
- **Should:** Say "starting at" or "before travel"
- **Fix:**
- **Status:** Open

## 6. Praising our own food
- **Date:** 2026-11-20
- **Inquiry:** 35 guests, North York
- **Wrong:** "which sounds delicious!"
- **Should:** No praising our own food
- **Fix:**
- **Status:** Open
