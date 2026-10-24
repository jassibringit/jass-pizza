import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#how", label: "How it works" },
  { href: "/packages", label: "Packages" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="relative border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link
          href="/"
          className="font-display text-3xl font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          jass pizza<span className="text-gold">.</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex flex-wrap gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[15px] text-foreground transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/book"
          className="hidden min-h-11 items-center rounded-full border border-gold md:inline-flex px-5 py-3 text-[15px] text-foreground transition-colors hover:border-gold-bright hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Request a quote →
        </Link>

        <MobileMenu links={navLinks} />
      </div>
    </header>
  );
}
