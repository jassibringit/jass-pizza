import Link from "next/link";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/brand-icons";
import { contact } from "@/lib/contact";

const socials = [
  { label: "WhatsApp", href: contact.whatsapp, icon: <WhatsAppIcon /> },
  { label: "Instagram", href: contact.instagram, icon: <InstagramIcon /> },
  { label: "TikTok", href: contact.tiktok, icon: <TikTokIcon /> },
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
