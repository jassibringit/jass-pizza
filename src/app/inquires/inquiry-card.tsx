import { format, parseISO } from "date-fns";
import type { Inquiry } from "@/db/schema";

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
  const eventDate = format(parseISO(inquiry.eventDate), "EEE, MMM d, yyyy");

  return (
    <article className="flex h-full flex-col gap-5 border border-border bg-card p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
            {inquiry.eventType}
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight">
            {inquiry.name}
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-gold/50 px-3 py-1 text-xs tracking-wider text-gold uppercase">
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
          <dd className="mt-1">{inquiry.guests}</dd>
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

      {/* Contact: tap to email or call */}
      <ul className="mt-auto flex flex-col">
        <li>
          <a href={`mailto:${inquiry.email}`} className={linkClass}>
            {inquiry.email}
          </a>
        </li>
        {inquiry.phone && (
          <li>
            <a href={`tel:${inquiry.phone}`} className={linkClass}>
              {inquiry.phone}
            </a>
          </li>
        )}
      </ul>

      <p className="text-xs text-muted-foreground">
        Received {receivedFormat.format(inquiry.createdAt)} · #{inquiry.id}
      </p>
    </article>
  );
}
