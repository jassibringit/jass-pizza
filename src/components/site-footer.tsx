import Link from "next/link";

// TODO: replace these with your real details before going live.
const contact = {
  phone: "(647) 000-0000", // shown on the page
  phoneLink: "+16470000000", // used for tap-to-call: +1 then the 10 digits, no spaces
  email: "hello@jasspizza.ca",
};

// lucide-react has no brand logos, so these are small inline SVGs.
// fill/stroke="currentColor" makes them follow the link's text colour (gold on hover).
function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="size-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/jass.pizza", icon: <InstagramIcon /> },
  { label: "TikTok", href: "https://www.tiktok.com/@jass.pizza", icon: <TikTokIcon /> },
];

const linkClass =
  "inline-flex min-h-11 items-center text-[15px] text-foreground transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-display text-2xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            jass pizza<span className="text-gold">.</span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            © Jass Pizza · Brampton, Peel &amp; the GTA
          </p>
        </div>

        {/* Contact + socials in one row; wraps on small phones */}
        <ul className="flex flex-wrap gap-x-6">
          <li>
            <a href={`tel:${contact.phoneLink}`} className={linkClass}>
              {contact.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className={linkClass}>
              {contact.email}
            </a>
          </li>
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} gap-2`}
              >
                {social.icon}
                {social.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
