// State for the quote wizard: which step we're on, which way we moved, and the answers so far.
// Kept separate from the components so the logic is easy to read (and test) on its own.

export type WizardData = {
  eventType: string;
  serviceStyle: string;
  guests: string; // kept as text while typing; Zod turns it into a number
  date: string;
  city: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type WizardState = {
  step: number; // 0–4 are the questions, DONE is the confirmation screen
  direction: 1 | -1; // 1 = forward (slide up), -1 = back (slide down)
  data: WizardData;
};

export const STEP_NAMES = [
  "The occasion",
  "Service style",
  "Guest count",
  "Date & place",
  "Your details",
] as const;
export const STEP_COUNT = STEP_NAMES.length;
export const DONE = STEP_COUNT;

// Which step each field lives on, so a server error can send the visitor back to it.
export const FIELD_STEP: Record<keyof WizardData, number> = {
  eventType: 0,
  serviceStyle: 1,
  guests: 2,
  date: 3,
  city: 3,
  name: 4,
  email: 4,
  phone: 4,
  message: 4,
};

const emptyData: WizardData = {
  eventType: "",
  serviceStyle: "",
  guests: "",
  date: "",
  city: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

export const initialState: WizardState = { step: 0, direction: 1, data: emptyData };

export type WizardAction =
  | { type: "set"; field: keyof WizardData; value: string }
  | { type: "next" }
  | { type: "back" }
  | { type: "goTo"; step: number }
  | { type: "done" }
  | { type: "restore"; saved: unknown }
  | { type: "reset" };

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "set":
      return { ...state, data: { ...state.data, [action.field]: action.value } };
    case "next":
      return { ...state, step: Math.min(state.step + 1, STEP_COUNT - 1), direction: 1 };
    case "back":
      return { ...state, step: Math.max(state.step - 1, 0), direction: -1 };
    case "goTo":
      return { ...state, step: action.step, direction: action.step > state.step ? 1 : -1 };
    case "done":
      return { ...state, step: DONE, direction: 1 };
    case "restore":
      return restore(action.saved) ?? state;
    case "reset":
      return initialState;
  }
}

// sessionStorage can hold anything (or be edited by hand), so check it before trusting it.
function restore(saved: unknown): WizardState | null {
  if (!saved || typeof saved !== "object") return null;
  const { step, data } = saved as { step?: unknown; data?: unknown };
  if (typeof step !== "number" || step < 0 || step >= STEP_COUNT) return null;
  if (!data || typeof data !== "object") return null;

  const restored = { ...emptyData };
  for (const key of Object.keys(emptyData) as (keyof WizardData)[]) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "string") restored[key] = value;
  }
  return { step, direction: 1, data: restored };
}
