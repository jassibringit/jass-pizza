"use client";
import { EventDatePicker } from "@/components/event-date-picker";
import { startTransition, useActionState, useState } from "react";

import { eventTypes, type QuoteErrors } from "@/lib/booking-schema";
import { bookAction, type BookState } from "@/actions/book";

// Shared by every question, so all the fields match.
const labelClass = "font-display text-2xl";
const fieldBase =
  "w-full border border-border bg-background px-5 text-base text-foreground scheme-dark transition-colors placeholder:text-muted-foreground hover:border-gold focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive";
const errorClass = "px-5 text-sm text-destructive";
const inputClass = `${fieldBase} min-h-11 rounded-full`;
const textareaClass = `${fieldBase} rounded-3xl py-3`;
const pillClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border px-5 py-2 text-foreground transition-colors hover:border-gold has-checked:border-gold has-checked:bg-gold has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring";

export function QuoteSection() {
  // Kept in our own state so clearError can remove one as the visitor fixes it.
  const [errors, setErrors] = useState<QuoteErrors>({});

  const [state, formAction, isPending] = useActionState(
    async (prev: BookState, formData: FormData) => {
      const result = await bookAction(prev, formData); // Zod runs on the server
      setErrors(result.errors ?? {});
      return result;
    },
    {},
  );

  // True while any field still has an error (clearError removes them one by one).
  const hasErrors = Object.values(errors).some(Boolean);

  const clearError = (name: keyof QuoteErrors) => {
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <section id="quote" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-32">
        <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
          Check your date
        </p>
        <h2 className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl">
          Tell us about your event<span className="text-gold">.</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory-muted">
          Two minutes now, a personal quote back to you, usually within 24
          hours.
        </p>

        {state.success ? (
          <p
            role="status"
            className="mt-10 max-w-xl border border-gold/50 p-6 text-lg leading-relaxed md:mt-14"
          >
            Thanks! Your inquiry is in. We&apos;ll check the date and get back
            to you within 24 hours.
          </p>
        ) : (
          <form
            noValidate
            // onSubmit + startTransition instead of action={formAction}:
            // `action` clears every field after submit, even when there are errors.
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(() => formAction(formData));
            }}
            onChange={(e) => {
              clearError(e.target.name as keyof QuoteErrors);
            }}
            className="mt-10 flex flex-col gap-10 md:mt-14"
          >
            <fieldset aria-describedby="eventType-error">
              <legend className={labelClass}>What are you celebrating?</legend>
              <ul className="mt-4 flex flex-wrap gap-3">
                {eventTypes.map((type) => (
                  <li key={type}>
                    <label className={pillClass}>
                      <input
                        type="radio"
                        required
                        name="eventType"
                        value={type}
                        className="sr-only"
                      />
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
              {errors.eventType && (
                <p
                  id="eventType-error"
                  className="mt-3 text-sm text-destructive"
                >
                  {errors.eventType[0]}
                </p>
              )}
            </fieldset>
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px" }}
            >
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-8 md:grid-cols-3 md:gap-6">
              <EventDatePicker
                error={errors.date?.[0]}
                onPick={() => clearError("date")}
              />

              <div className="flex flex-col gap-4">
                <label htmlFor="guests" className={labelClass}>
                  Guest count
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  inputMode="numeric"
                  min={30}
                  max={100}
                  placeholder="e.g. 40"
                  required
                  aria-invalid={!!errors.guests}
                  aria-describedby="guests-error"
                  className={inputClass}
                />
                {errors.guests && (
                  <p id="guests-error" className={errorClass}>
                    {errors.guests[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="city" className={labelClass}>
                  Venue city
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Brampton"
                  required
                  aria-invalid={!!errors.city}
                  aria-describedby="city-hint city-error"
                  className={inputClass}
                  maxLength={100}
                />
                <p
                  id="city-hint"
                  className="px-5 text-sm text-muted-foreground"
                >
                  Our ovens run outdoors, so we&apos;ll need a spot like a
                  backyard, front yard, driveway or patio.
                </p>
                {errors.city && (
                  <p id="city-error" className={errorClass}>
                    {errors.city[0]}
                  </p>
                )}
              </div>
            </div>

            {/* About you. Pattern: text inputs with the right type */}
            <div className="grid gap-8 md:grid-cols-3 md:gap-6">
              <div className="flex flex-col gap-4">
                <label htmlFor="name" className={labelClass}>
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                  className={inputClass}
                />
                {errors.name && (
                  <p id="name-error" className={errorClass}>
                    {errors.name[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="phone" className={labelClass}>
                  Phone{" "}
                  <span className="font-sans text-base text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  aria-invalid={!!errors.phone}
                  aria-describedby="phone-error"
                  className={inputClass}
                />
                {errors.phone && (
                  <p id="phone-error" className={errorClass}>
                    {errors.phone[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  className={inputClass}
                />
                {errors.email && (
                  <p id="email-error" className={errorClass}>
                    {errors.email[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Pattern: textarea (long free text) */}
            <div className="flex flex-col gap-4">
              <label htmlFor="message" className={labelClass}>
                Tell us about your event
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="e.g. Venue, serving time, flavours, dietary needs: anything that helps us quote"
                aria-invalid={!!errors.message}
                aria-describedby="message-error"
                className={textareaClass}
                maxLength={1000}
              />
              {errors.message && (
                <p id="message-error" className={errorClass}>
                  {errors.message[0]}
                </p>
              )}
            </div>

            {/* Pattern: submit button + reassurance note */}
            <div className="flex flex-col items-start gap-3">
              {/* On phones the field errors are off-screen, so say so near the button */}
              {hasErrors && (
                <p role="alert" className="text-sm text-destructive">
                  Please fix the highlighted fields above.
                </p>
              )}
              {state.message && (
                <p role="alert" className="text-sm text-destructive">
                  {state.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-11 items-center rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60"
              >
                {isPending ? "Sending…" : "Send my inquiry →"}
              </button>
              <p className="text-sm text-muted-foreground">
                No payment now. We&apos;ll confirm availability first.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
