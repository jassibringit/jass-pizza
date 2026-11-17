"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { PRICING, estimate, formatMoney, formatRange, type Service } from "@/lib/pricing";

// Counts up from ~85% to the final amount. The motion value updates the text directly,
// so React doesn't re-render on every frame. Reduced motion: shows the final number.
function CountUp({ value, reduce }: { value: number; reduce: boolean }) {
  const amount = useMotionValue(reduce ? value : Math.round(value * 0.85));
  const text = useTransform(amount, (v) => formatMoney(Math.round(v)));

  useEffect(() => {
    if (reduce) {
      amount.set(value);
      return;
    }
    const controls = animate(amount, value, { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [amount, value, reduce]);

  return <motion.span>{text}</motion.span>;
}

// Shown at the top of the contact step, so people see a number before they send.
// Uses the same estimate() the server recalculates and saves.
export function EstimatePanel({ guests, service }: { guests: number; service: Service }) {
  const reduce = !!useReducedMotion();
  const est = estimate({ guests, service });

  return (
    <section aria-label="Your estimate" className="border border-border bg-card px-5 py-5 sm:px-6">
      <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">Your estimate</p>

      {est.isCustom || est.low === null || est.high === null ? (
        <>
          <p className="mt-2 font-display text-2xl leading-snug md:text-3xl">
            That&apos;s a big one! Events this size get a custom quote.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ivory-muted">
            We&apos;ll reach out to plan the details with you: venue, timing and menu.
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 font-display text-2xl leading-tight font-semibold md:text-3xl">
            {/* Screen readers get the final price once, not every number while it counts */}
            <span className="sr-only">
              {formatRange(est.low, est.high)}
              {PRICING.showHst && " plus HST"}
            </span>
            <span aria-hidden="true">
              <CountUp value={est.low} reduce={reduce} />
              {est.high !== est.low && (
                <>
                  {" – "}
                  <CountUp value={est.high} reduce={reduce} />
                </>
              )}
              {PRICING.showHst && (
                <span className="font-sans text-lg font-normal text-muted-foreground"> + HST</span>
              )}
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ivory-muted">
            Includes live pizza for {est.servingHours} hours, up to {est.flavours} flavours, setup, cleanup,
            plates and dips. Your final price depends on travel, date and add-ons. We&apos;ll confirm it with you.
          </p>
        </>
      )}
    </section>
  );
}
