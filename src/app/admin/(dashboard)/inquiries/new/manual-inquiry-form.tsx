"use client"; // needs state (errors) and hooks (useActionState)

import Link from "next/link";
import {
  startTransition,
  useActionState,
  useState,
  type ComponentProps,
} from "react";
import { createInquiryAction, type CreateInquiryState } from "@/actions/inquiries";
import { eventTypes } from "@/lib/booking-schema";
import { manualSources, type ManualInquiryErrors } from "@/lib/inquiry-schema";

const legendClass = "font-display text-2xl";
const labelClass = "text-sm text-ivory-muted";
const fieldBase =
  "w-full border border-border bg-background px-5 text-base text-foreground scheme-dark transition-colors placeholder:text-muted-foreground hover:border-gold focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive";
const inputClass = `${fieldBase} min-h-11 rounded-full`;
const textareaClass = `${fieldBase} rounded-3xl py-3`;
const errorClass = "px-5 text-sm text-destructive";
const pillClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border px-5 py-2 text-foreground capitalize transition-colors hover:border-gold has-checked:border-gold has-checked:bg-gold has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring";

type FieldName = keyof ManualInquiryErrors;

// One labelled input with its error. Saves repeating the same 10 lines per field.
// Omit<…, "name">: we replace the input's `name` (any string) with FieldName (only real keys).
type TextFieldProps = Omit<ComponentProps<"input">, "name"> & {
  name: FieldName;
  label: string;
  error?: string;
  optional?: boolean;
};

function TextField({ name, label, error, optional, ...inputProps }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelClass}>
        {label}
        {optional && <span className="text-muted-foreground"> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass}
        {...inputProps}
      />
      {error && (
        <p id={`${name}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

export function ManualInquiryForm() {
  // Kept in our own state so clearError can remove one as you fix it.
  const [errors, setErrors] = useState<ManualInquiryErrors>({});

  const [state, formAction, isPending] = useActionState(
    async (prev: CreateInquiryState, formData: FormData) => {
      // On success the action redirects to /inquiries, so this only returns on a problem.
      const result = await createInquiryAction(prev, formData);
      setErrors(result.errors ?? {});
      return result;
    },
    {},
  );

  const hasErrors = Object.values(errors).some(Boolean);

  const clearError = (name: FieldName) => {
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
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
        const name = e.target.name as FieldName;
        clearError(name);
        // The "at least one way to reach them" error sits on handle; any contact field fixes it.
        if (name === "email" || name === "phone") clearError("handle");
      }}
      className="mt-10 flex max-w-3xl flex-col gap-10 md:mt-14"
    >
      {/* 1. Where they came from */}
      <fieldset aria-describedby={errors.source ? "source-error" : undefined}>
        <legend className={legendClass}>where did they reach you?</legend>
        <ul className="mt-4 flex flex-wrap gap-3">
          {manualSources.map((source) => (
            <li key={source}>
              <label className={pillClass}>
                <input type="radio" name="source" value={source} className="sr-only" />
                {source}
              </label>
            </li>
          ))}
        </ul>
        {errors.source && (
          <p id="source-error" className="mt-3 text-sm text-destructive">
            {errors.source[0]}
          </p>
        )}
      </fieldset>

      {/* 2. Who they are and how to reach them */}
      <fieldset className="flex flex-col gap-4">
        <legend className={legendClass}>who is it?</legend>
        <p className="text-sm text-muted-foreground">
          Add at least one way to reach them: handle, phone or email.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="name" label="Name" autoComplete="off" maxLength={100} error={errors.name?.[0]} />
          <TextField name="handle" label="Handle" placeholder="@their.username" autoComplete="off" maxLength={50} optional error={errors.handle?.[0]} />
          <TextField name="phone" label="Phone" type="tel" autoComplete="off" maxLength={20} optional error={errors.phone?.[0]} />
          <TextField name="email" label="Email" type="email" autoComplete="off" maxLength={254} optional error={errors.email?.[0]} />
        </div>
      </fieldset>

      {/* 3. The event */}
      <fieldset className="flex flex-col gap-4">
        <legend className={legendClass}>the event.</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="eventType" className={labelClass}>
              Celebrating
            </label>
            <select
              id="eventType"
              name="eventType"
              defaultValue=""
              aria-invalid={!!errors.eventType}
              aria-describedby={errors.eventType ? "eventType-error" : undefined}
              className={inputClass}
            >
              <option value="" disabled>
                Pick one
              </option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p id="eventType-error" className={errorClass}>
                {errors.eventType[0]}
              </p>
            )}
          </div>
          <TextField name="date" label="Date" type="date" error={errors.date?.[0]} />
          <TextField name="guests" label="Guests" type="number" inputMode="numeric" min={1} error={errors.guests?.[0]} />
          <TextField name="city" label="City" placeholder="e.g. Brampton" maxLength={100} error={errors.city?.[0]} />
        </div>
      </fieldset>

      {/* 4. Anything else */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={legendClass}>
          notes<span className="text-gold">.</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="What they asked, flavours, venue, anything useful"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={textareaClass}
        />
        {errors.message && (
          <p id="message-error" className={errorClass}>
            {errors.message[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-3">
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
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save inquiry →"}
          </button>
          <Link
            href="/admin/inquiries"
            className="inline-flex min-h-11 items-center text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
