import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { getInquiries } from "@/db/inquiries";
import { formatEventDate } from "@/lib/booking-schema";
import { dashboardStats, greeting } from "@/lib/dashboard-stats";
import type { InquiryStatus } from "@/lib/inquiry-schema";
import { requireOwner } from "@/lib/require-owner";
import { QuickEstimate } from "./quick-estimate";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

const tabs = ["all", "new", "quoted", "booked"] as const;
type Tab = (typeof tabs)[number];

const tabLabels: Record<Tab, string> = {
  all: "All inquiries",
  new: "New",
  quoted: "Quoted",
  booked: "Booked",
};

// The URL can say anything (?status=banana), so only accept the known tabs.
function toTab(value: string | string[] | undefined): Tab {
  return tabs.find((tab) => tab === value) ?? "all";
}

const statusPill: Record<InquiryStatus, string> = {
  new: "bg-gold/20 text-gold",
  quoted: "border border-gold/40 text-gold",
  booked: "bg-success/15 text-success",
  lost: "bg-secondary text-muted-foreground",
};

const PIPELINE_ROWS = 6;

type OverviewProps = { searchParams: Promise<{ status?: string | string[] }> };

export default function OverviewPage({ searchParams }: OverviewProps) {
  return (
    <Suspense fallback={<p className="px-6 py-10 text-muted-foreground md:px-10">Loading…</p>}>
      <Overview searchParams={searchParams} />
    </Suspense>
  );
}

async function Overview({ searchParams }: OverviewProps) {
  // Start both at once instead of waiting for one before the other.
  const [session, inquiries, params] = await Promise.all([requireOwner(), getInquiries(), searchParams]);

  const now = new Date();
  const stats = dashboardStats(inquiries, now);
  const firstName = (session.user.name || "there").split(" ")[0];
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const month = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", month: "long" }).format(now);

  const tab = toTab(params.status);
  const rows = inquiries.filter((i) => tab === "all" || i.status === tab).slice(0, PIPELINE_ROWS);

  const cards = [
    {
      label: "Open inquiries",
      value: stats.open,
      note: stats.openThisWeek > 0 ? `↑ ${stats.openThisWeek} this week` : "None new this week",
    },
    {
      label: "Upcoming events",
      value: stats.upcoming,
      note: stats.nextEventDate ? `Next: ${formatEventDate(stats.nextEventDate, "MMM d")}` : "Nothing booked yet",
    },
    {
      label: "Booked this month",
      value: stats.bookedThisMonth,
      note: `Events in ${month}`,
    },
  ];

  return (
    <main>
      <header className="flex flex-col gap-6 border-b border-border px-6 py-8 sm:flex-row sm:items-end sm:justify-between md:px-10 md:py-10">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">{today}</p>
          <h1 className="mt-3 font-display text-4xl leading-none font-semibold md:text-5xl">
            {greeting(now)}, {firstName}
            <span className="text-gold">.</span>
          </h1>
        </div>
        <Link
          href="/admin/inquiries/new"
          className="inline-flex min-h-11 items-center gap-2 self-start bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:self-auto"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add inquiry
        </Link>
      </header>

      <div className="px-6 py-8 md:px-10 md:py-10">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">
          Your business, at a glance<span className="text-gold">.</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your events.</p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <li key={card.label} className="border border-border bg-card p-5 md:p-6">
              <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{card.label}</p>
              <p className="mt-4 font-display text-4xl">{card.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{card.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.6fr_1fr]">
          <section aria-labelledby="pipeline-heading" className="border border-border bg-card p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="pipeline-heading" className="font-display text-2xl font-semibold">
                  Inquiry pipeline<span className="text-gold">.</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Keep every conversation moving.</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                View all <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <nav aria-label="Filter by status" className="mt-4 overflow-x-auto border-b border-border">
              <ul className="flex gap-5">
                {tabs.map((t) => (
                  <li key={t}>
                    <Link
                      href={t === "all" ? "/admin" : `/admin?status=${t}`}
                      scroll={false}
                      aria-current={t === tab ? "page" : undefined}
                      className="-mb-px inline-flex min-h-11 items-center border-b-2 border-transparent text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:border-gold aria-[current=page]:text-gold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                    >
                      {tabLabels[t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {rows.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">Nothing here yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {rows.map((inquiry) => (
                  <li key={inquiry.id}>
                    <Link
                      href="/admin/inquiries"
                      className="flex min-h-16 items-center gap-4 py-3 transition-colors hover:bg-secondary/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm text-ivory-muted"
                      >
                        {inquiry.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{inquiry.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {inquiry.eventType} · {inquiry.guests} guests
                        </span>
                      </span>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {inquiry.eventDate ? formatEventDate(inquiry.eventDate, "MMM d, yyyy") : "No date"}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusPill[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <QuickEstimate />
        </div>
      </div>
    </main>
  );
}
