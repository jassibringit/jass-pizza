"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  earliestEventDate,
  eventTypes,
  serviceStyles,
  type ServiceStyle,
} from "@/lib/booking-schema";
import type { WizardData } from "./wizard-state";

// ── Shared styles ───────────────────────────────────────────────────────────

export const labelClass = "text-sm text-muted-foreground";
// Inputs are underline-only, per the design. The underline turns gold on focus.
export const inputClass =
  "min-h-11 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-base text-foreground scheme-dark transition-colors placeholder:text-muted-foreground/70 hover:border-gold/60 focus-visible:border-b-2 focus-visible:border-gold focus-visible:outline-none aria-invalid:border-destructive";
export const errorClass = "text-sm text-destructive";
const cardBase =
  "w-full rounded-[4px] border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const cardOff = "border-border text-foreground hover:border-gold";
const cardOn = "border-gold bg-gold text-primary-foreground";

// ── Motion ──────────────────────────────────────────────────────────────────

// Each child of a step fades/slides in 60ms after the previous one (the parent sets the stagger).
export function useItemVariants(): Variants {
  const reduce = useReducedMotion();
  const offset = reduce ? 0 : 14;
  return {
    enter: (dir: number) => ({ opacity: 0, y: dir * offset }),
    center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
}

function Item({ dir, children }: { dir: number; children: ReactNode }) {
  const variants = useItemVariants();
  return (
    <motion.div variants={variants} custom={dir}>
      {children}
    </motion.div>
  );
}

// ── Pieces every step uses ──────────────────────────────────────────────────

// The question (an h3: it sits under the section's h2 on the homepage).
// When a new step appears, focus moves here so screen readers announce it.
export function StepHeading({ focus, children }: { focus: boolean; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus]);

  return (
    <h3
      ref={ref}
      tabIndex={-1}
      className="font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
    >
      {children}
    </h3>
  );
}

// One gold italic word, as in the design: "What are you <em>celebrating</em>?"
export function Accent({ children }: { children: ReactNode }) {
  return <em className="text-gold italic">{children}</em>;
}

type StepProps = {
  dir: number;
  focusHeading: boolean;
  data: WizardData;
  errors: Partial<Record<keyof WizardData, string>>;
  onChange: (field: keyof WizardData, value: string) => void;
  onBlur: (field: keyof WizardData) => void;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={errorClass}>
      {message}
    </p>
  ) : null;
}

// ── Step 1: event type ──────────────────────────────────────────────────────

export function EventTypeStep({
  dir,
  focusHeading,
  data,
  onChoose,
}: Pick<StepProps, "dir" | "focusHeading" | "data"> & { onChoose: (value: string) => void }) {
  return (
    <>
      <Item dir={dir}>
        <StepHeading focus={focusHeading}>
          What are you <Accent>celebrating</Accent>?
        </StepHeading>
        <p className="mt-4 text-ivory-muted">Pick the closest fit. It helps us suggest the right setup.</p>
      </Item>
      <Item dir={dir}>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {eventTypes.map((type) => {
            const selected = data.eventType === type;
            return (
              <li key={type}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChoose(type)}
                  className={`${cardBase} min-h-14 px-5 py-4 text-[15px] ${selected ? `${cardOn} font-medium` : cardOff}`}
                >
                  {type}
                </button>
              </li>
            );
          })}
        </ul>
      </Item>
    </>
  );
}

// ── Step 2: service style ───────────────────────────────────────────────────

const serviceCopy: Record<ServiceStyle, { title: string; body: string }> = {
  main: { title: "Main meal", body: "Pizza is the main food. We plan for every guest." },
  appetizer: { title: "Late-night / appetizer", body: "Plan for ~60% of guest count." },
};

export function ServiceStyleStep({
  dir,
  focusHeading,
  data,
  onChoose,
}: Pick<StepProps, "dir" | "focusHeading" | "data"> & { onChoose: (value: string) => void }) {
  return (
    <>
      <Item dir={dir}>
        <StepHeading focus={focusHeading}>
          Is pizza the <Accent>main meal</Accent>?
        </StepHeading>
        <p className="mt-4 text-ivory-muted">This helps us plan the right number of pizzas for your crowd.</p>
      </Item>
      <Item dir={dir}>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {serviceStyles.map((style) => {
            const selected = data.serviceStyle === style;
            return (
              <li key={style} className="h-full">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChoose(style)}
                  className={`${cardBase} flex h-full min-h-28 flex-col justify-center gap-1 px-5 py-5 ${selected ? cardOn : cardOff}`}
                >
                  <span className="font-display text-2xl">{serviceCopy[style].title}</span>
                  <span className={`text-sm ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {serviceCopy[style].body}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Item>
    </>
  );
}

// ── Step 3: guest count ─────────────────────────────────────────────────────

export function GuestsStep({ dir, focusHeading, data, errors, onChange, onBlur }: StepProps) {
  return (
    <>
      <Item dir={dir}>
        <StepHeading focus={focusHeading}>
          How many <Accent>guests</Accent>?
        </StepHeading>
        <p className="mt-4 text-ivory-muted">Expected headcount.</p>
      </Item>
      <Item dir={dir}>
        <div className="mt-8 flex max-w-xs flex-col gap-2">
          <label htmlFor="guests" className={labelClass}>
            Number of guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            inputMode="numeric"
            min={10}
            required
            value={data.guests}
            onChange={(e) => onChange("guests", e.target.value)}
            onBlur={() => onBlur("guests")}
            aria-invalid={!!errors.guests}
            aria-describedby={errors.guests ? "guests-error" : undefined}
            className={inputClass}
          />
          <FieldError id="guests-error" message={errors.guests} />
        </div>
      </Item>
    </>
  );
}

// ── Step 4: date & place ────────────────────────────────────────────────────

export function DatePlaceStep({ dir, focusHeading, data, errors, onChange, onBlur }: StepProps) {
  return (
    <>
      <Item dir={dir}>
        <StepHeading focus={focusHeading}>
          When and <Accent>where</Accent>?
        </StepHeading>
      </Item>
      <Item dir={dir}>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className={labelClass}>
              Event date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              min={earliestEventDate()}
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
              onBlur={() => onBlur("date")}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "date-error" : undefined}
              className={inputClass}
            />
            <FieldError id="date-error" message={errors.date} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="city" className={labelClass}>
              Venue city
            </label>
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              maxLength={100}
              required
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              onBlur={() => onBlur("city")}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error ovens-note" : "ovens-note"}
              className={inputClass}
            />
            <FieldError id="city-error" message={errors.city} />
          </div>
        </div>
      </Item>
      <Item dir={dir}>
        <p id="ovens-note" className="mt-6 text-sm text-muted-foreground">
          Our ovens need an outdoor space of about 10 × 10 ft for ventilation.
        </p>
      </Item>
    </>
  );
}

// ── Step 5: contact ─────────────────────────────────────────────────────────

export function ContactStep({ dir, focusHeading, data, errors, onChange, onBlur }: StepProps) {
  return (
    <>
      <Item dir={dir}>
        <StepHeading focus={focusHeading}>
          How should we <Accent>contact you</Accent>?
        </StepHeading>
        <p className="mt-4 text-ivory-muted">We&apos;ll get back to you, usually within a day.</p>
      </Item>
      <Item dir={dir}>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              required
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              onBlur={() => onBlur("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass}
            />
            <FieldError id="name-error" message={errors.name} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass}
            />
            <FieldError id="email-error" message={errors.email} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className={labelClass}>
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              onBlur={() => onBlur("phone")}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClass}
            />
            <FieldError id="phone-error" message={errors.phone} />
          </div>
        </div>
      </Item>
      <Item dir={dir}>
        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="message" className={labelClass}>
            Anything else? (flavours, dietary needs, theme)
          </label>
          <textarea
            id="message"
            name="message"
            rows={2}
            maxLength={1000}
            placeholder="e.g. Backyard mehndi, mostly vegetarian"
            value={data.message}
            onChange={(e) => onChange("message", e.target.value)}
            onBlur={() => onBlur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`${inputClass} resize-none`}
          />
          <FieldError id="message-error" message={errors.message} />
        </div>
      </Item>
    </>
  );
}
