import type { ComponentType } from "react";
import { Globe, MessageCircle, Phone, Users } from "lucide-react";
import type { Inquiry } from "@/db/schema";
import { formatEventDate, serviceStyleLabels } from "@/lib/booking-schema";
import { updateStatusAction } from "@/actions/inquiries";
import {
  inquiryStatuses,
  type InquirySource,
  type InquiryStatus,
} from "@/lib/inquiry-schema";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/brand-icons";
import { DeleteInquiryButton } from "./delete-inquiry-button";

// A label and logo per source, so you can see at a glance where a lead came from.
// Record<InquirySource, …>: adding a source without a logo here is a type error.
const sourceInfo: Record<
  InquirySource,
  { label: string; Icon: ComponentType<{ className?: string }> }
> = {
  website: { label: "Website", Icon: Globe },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  tiktok: { label: "TikTok", Icon: TikTokIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  phone: { label: "Phone", Icon: Phone },
  referral: { label: "Referral", Icon: Users },
  other: { label: "Other", Icon: MessageCircle },
};

// Where a handle can be opened, so it becomes a tap-to-open link.
const profileUrl: Partial<Record<InquirySource, string>> = {
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
};

// One look per status. Record<InquiryStatus, …> means TypeScript complains
// if a status is ever added to the list without a style here.
const statusClass: Record<InquiryStatus, string> = {
  new: "border-gold bg-gold text-primary-foreground", // needs a reply: loudest
  quoted: "border-gold/50 text-gold", // waiting on them
  booked: "border-success/50 text-success", // deposit in
  lost: "border-border text-muted-foreground", // done, fades back
};

const linkClass =
  "inline-flex min-h-11 items-center break-all text-foreground underline-offset-4 transition-colors hover:text-gold-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// "Received" time in Toronto, whatever timezone the server runs in.
const receivedFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  dateStyle: "medium",
  timeStyle: "short",
});

type InquiryCardProps = {
  inquiry: Inquiry;
};

// One inquiry: the event up top, how to reach them below.
export function InquiryCard({ inquiry }: InquiryCardProps) {
  const eventDate = formatEventDate(inquiry.eventDate, "EEE, MMM d, yyyy");
  // Capital S: JSX only treats capitalised names as components.
  const { label: sourceLabel, Icon: SourceIcon } = sourceInfo[inquiry.source];
  // Stored with or without "@"; strip it so we can add our own.
  const handle = inquiry.handle?.replace(/^@/, "");
  const handleUrl = profileUrl[inquiry.source];

  return (
    <article className="flex h-full flex-col gap-5 border border-border bg-card p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          {/* Event type and source side by side; wraps under on narrow cards */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
              {inquiry.eventType}
            </p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <SourceIcon className="size-4" />
              <span>
                <span className="sr-only">Came in via </span>
                {sourceLabel}
              </span>
            </p>
          </div>
          <h2 className="mt-2 font-display text-2xl leading-tight">
            {inquiry.name}
          </h2>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs tracking-wider uppercase ${statusClass[inquiry.status]}`}
        >
          {inquiry.status}
        </span>
      </header>

      {/* The event: what matters most when quoting */}
      <dl className="grid grid-cols-3 gap-4 border-y border-border py-4">
        <div>
          <dt className="text-xs text-muted-foreground">Date</dt>
          <dd className="mt-1">{eventDate}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Guests</dt>
          <dd className="mt-1">
            {inquiry.guests}
            {inquiry.serviceStyle && (
              <span className="block text-xs text-muted-foreground">
                {serviceStyleLabels[inquiry.serviceStyle]}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">City</dt>
          <dd className="mt-1">{inquiry.city}</dd>
        </div>
      </dl>

      {inquiry.message && (
        <p className="leading-relaxed whitespace-pre-line text-ivory-muted">
          {inquiry.message}
        </p>
      )}

      {/* Contact: tap to email, call or open their profile */}
      <ul className="mt-auto flex flex-col">
        {inquiry.email && (
          <li>
            <a href={`mailto:${inquiry.email}`} className={linkClass}>
              {inquiry.email}
            </a>
          </li>
        )}
        {inquiry.phone && (
          <li>
            <a href={`tel:${inquiry.phone}`} className={linkClass}>
              {inquiry.phone}
            </a>
          </li>
        )}
        {handle && (
          <li>
            {handleUrl ? (
              <a
                href={`${handleUrl}${encodeURIComponent(handle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} gap-2`}
              >
                <SourceIcon className="size-4" />@{handle}
                <span className="sr-only"> on {sourceLabel} (opens in a new tab)</span>
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center">@{handle}</span>
            )}
          </li>
        )}
      </ul>

      <p className="text-xs text-muted-foreground">
        Received {receivedFormat.format(inquiry.createdAt)} · #{inquiry.id}
      </p>
      <form action={updateStatusAction} className="flex items-center gap-2">
        <input type="hidden" name="id" value={inquiry.id} />

        <label htmlFor={`status-${inquiry.id}`} className="sr-only">
          Status for {inquiry.name}
        </label>
        <select
          id={`status-${inquiry.id}`}
          name="status"
          defaultValue={inquiry.status}
          className="min-h-11 flex-1 rounded-full border border-border bg-background px-4 text-foreground scheme-dark focus-visible:outline-2 focus-visible:outline-ring"
        >
          {inquiryStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button className="min-h-11 rounded-full border border-gold px-5 text-gold transition-colors hover:bg-gold hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring">
          Save
        </button>
      </form>

      <DeleteInquiryButton id={inquiry.id} name={inquiry.name} />
    </article>
  );
}
