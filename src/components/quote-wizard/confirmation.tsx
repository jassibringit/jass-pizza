"use client";

import { serviceStyleLabels, type ServiceStyle } from "@/lib/booking-schema";
import { StepHeading } from "./wizard-steps";
import type { WizardData } from "./wizard-state";

const shortServiceLabel: Record<ServiceStyle, string> = {
  main: serviceStyleLabels.main,
  appetizer: "Appetizer",
};

export function Confirmation({ data }: { data: WizardData }) {
  const firstName = data.name.trim().split(/\s+/)[0];
  const summary = [
    data.eventType,
    shortServiceLabel[data.serviceStyle as ServiceStyle],
    `${data.guests} guests`,
    data.date,
    data.city,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-col">
      <p className="font-display text-2xl text-gold italic">got it.</p>
      <div className="mt-3">
        <StepHeading focus>
          Thanks, {firstName}. The ovens are on standby<span className="text-gold">.</span>
        </StepHeading>
      </div>

      <div className="mt-8 border border-border px-5 py-4">
        <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">Your event</p>
        <p className="mt-1">{summary}</p>
      </div>

      <p className="mt-6 leading-relaxed text-ivory-muted">
        We&apos;ll get back to you within 24 hours. A 30% deposit holds your date once you&apos;re happy.
      </p>
    </div>
  );
}
