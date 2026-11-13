"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useReducer,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { bookAction, type BookState } from "@/actions/book";
import { Arrow } from "@/components/arrow";
import { stepSchemas } from "@/lib/booking-schema";
import { Confirmation } from "./confirmation";
import {
  ContactStep,
  DatePlaceStep,
  EventTypeStep,
  GuestsStep,
  ServiceStyleStep,
} from "./wizard-steps";
import {
  DONE,
  FIELD_STEP,
  STEP_COUNT,
  STEP_NAMES,
  initialState,
  wizardReducer,
  type WizardData,
} from "./wizard-state";

const STORAGE_KEY = "jass-pizza:quote";
const FORM_ID = "quote-step";
const AUTO_ADVANCE_MS = 250;

type FieldErrors = Partial<Record<keyof WizardData, string>>;

// Validate only the current step with its own schema.
function validateStep(step: number, data: WizardData) {
  const schema: z.ZodType | undefined = stepSchemas[step];
  if (!schema) return { valid: true, errors: {} as FieldErrors };
  const result = schema.safeParse(data);
  if (result.success) return { valid: true, errors: {} as FieldErrors };

  const errors: FieldErrors = {};
  const fieldErrors: Record<string, string[] | undefined> = z.flattenError(result.error).fieldErrors;
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) errors[field as keyof WizardData] = messages[0];
  }
  return { valid: false, errors };
}

export function QuoteWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const { step, direction, data } = state;

  // Errors only show for fields the visitor has left (or changed, for the date picker).
  const [touched, setTouched] = useState<Set<keyof WizardData>>(new Set());
  // False until the first move, so the page doesn't jump focus on load.
  const [hasMoved, setHasMoved] = useState(false);
  // A ref, not state: it only gates saving and shouldn't cause a re-render.
  const restored = useRef(false);

  const honeypot = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const reduceMotion = useReducedMotion();

  // ── Submitting: Server Action + useActionState ──
  const [serverState, submit, isPending] = useActionState(
    async (prev: BookState, input: WizardData & { company?: string }) => {
      const result = await bookAction(prev, input);
      if (result.success) {
        dispatch({ type: "done" });
      } else if (result.errors) {
        // The browser checks each step, so this is rare. Send them to the first problem.
        const first = Object.keys(result.errors)[0] as keyof WizardData | undefined;
        if (first && first in FIELD_STEP) dispatch({ type: "goTo", step: FIELD_STEP[first] });
      }
      return result;
    },
    {},
  );

  // ── Save progress in sessionStorage so a refresh doesn't lose answers ──
  useEffect(() => {
    try {
      // Browser storage only exists in the browser, so this waits for the first effect.
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "restore", saved: JSON.parse(saved) });
    } catch {
      // Storage blocked or the saved value is broken: start fresh.
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    try {
      if (step === DONE) sessionStorage.removeItem(STORAGE_KEY);
      else sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch {
      // Private mode or storage full: the form still works, it just won't survive a refresh.
    }
  }, [step, data]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // ── Validation for the current step ──
  const { valid, errors: clientErrors } = validateStep(step, data);
  const visibleErrors: FieldErrors = {};
  for (const field of touched) {
    const message = clientErrors[field] ?? serverState.errors?.[field]?.[0];
    if (message) visibleErrors[field] = message;
  }

  // ── Handlers ──
  function setField(field: keyof WizardData, value: string) {
    dispatch({ type: "set", field, value });
    // A date is picked in one go, so check it straight away (quiet inline error).
    if (field === "date") markTouched(field);
  }

  function markTouched(field: keyof WizardData) {
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));
  }

  function goNext() {
    window.clearTimeout(advanceTimer.current);
    setHasMoved(true);
    dispatch({ type: "next" });
  }

  function goBack() {
    window.clearTimeout(advanceTimer.current);
    setHasMoved(true);
    dispatch({ type: "back" });
  }

  // Card steps: select, show the gold state briefly, then move on.
  function choose(field: "eventType" | "serviceStyle", value: string) {
    dispatch({ type: "set", field, value });
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(goNext, AUTO_ADVANCE_MS);
  }

  // Input steps are real <form>s, so Enter submits them. That's the "Enter = Next" behaviour.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid) return;
    if (step < STEP_COUNT - 1) {
      goNext();
      return;
    }
    const company = honeypot.current?.value ?? "";
    startTransition(() => submit({ ...data, company }));
  }

  // ── Motion: forward slides up, back slides down; reduced motion fades only ──
  const offset = reduceMotion ? 0 : 28;
  const stepVariants: Variants = {
    enter: (dir: number) => ({ opacity: 0, y: dir * offset }),
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: reduceMotion ? 0 : 0.06 },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir * -offset,
      transition: { duration: 0.2, ease: "easeIn" },
    }),
  };

  const stepProps = {
    dir: direction,
    focusHeading: hasMoved,
    data,
    errors: visibleErrors,
    onChange: setField,
    onBlur: markTouched,
  };

  const isCardStep = step === 0 || step === 1;
  const isLastStep = step === STEP_COUNT - 1;

  return (
    <div
      // Lets the section hide its "prefer to chat" block once the inquiry is sent.
      data-done={step === DONE ? "" : undefined}
      className="flex w-full flex-col border-y border-border bg-background sm:border"
    >
      <div className="flex flex-1 flex-col px-6 pt-7 pb-6 sm:px-10 sm:pt-10">
        {step < DONE && <Progress step={step} reduceMotion={!!reduceMotion} />}

        <div className="mt-8 min-h-[22rem] flex-1">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === DONE ? (
                <Confirmation data={data} />
              ) : isCardStep ? (
                step === 0 ? (
                  <EventTypeStep {...stepProps} onChoose={(v) => choose("eventType", v)} />
                ) : (
                  <ServiceStyleStep {...stepProps} onChoose={(v) => choose("serviceStyle", v)} />
                )
              ) : (
                <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
                  {step === 2 && <GuestsStep {...stepProps} />}
                  {step === 3 && <DatePlaceStep {...stepProps} />}
                  {step === 4 && (
                    <>
                      <ContactStep {...stepProps} />
                      {/* Honeypot: hidden from people, bots fill it in */}
                      <div aria-hidden="true" className="absolute -left-[9999px]">
                        <label htmlFor="company">Company</label>
                        <input
                          ref={honeypot}
                          id="company"
                          name="company"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                    </>
                  )}
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {serverState.message && step < DONE && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {serverState.message}
          </p>
        )}
      </div>

      {step < DONE && (
        <nav
          aria-label="Form steps"
          className="flex items-center justify-between gap-4 border-t border-border px-6 py-5 sm:px-10"
        >
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span aria-hidden="true">←</span> Back
            </button>
          ) : (
            <span />
          )}

          <button
            // Input steps submit their <form>; card steps just move on.
            type={isCardStep ? "button" : "submit"}
            form={isCardStep ? undefined : FORM_ID}
            onClick={isCardStep ? goNext : undefined}
            disabled={!valid || isPending}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground transition-[background-color,opacity] hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
          >
            {isLastStep ? (isPending ? "Sending…" : "Send my inquiry") : "Next"}
            {!isPending && <Arrow />}
          </button>
        </nav>
      )}
    </div>
  );
}

function Progress({ step, reduceMotion }: { step: number; reduceMotion: boolean }) {
  const current = step + 1;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Step {current} of {STEP_COUNT}
        </p>
        <p className="text-xs text-muted-foreground">{STEP_NAMES[step]}</p>
      </div>
      <div
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={current}
        aria-valuetext={`Step ${current} of ${STEP_COUNT}: ${STEP_NAMES[step]}`}
        className="mt-3 h-0.5 bg-border"
      >
        <motion.div
          className="h-full origin-left bg-gold"
          initial={false}
          animate={{ scaleX: current / STEP_COUNT }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
