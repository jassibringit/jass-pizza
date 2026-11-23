import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { MobileMenu } from "./mobile-menu";
import { StickyHeader } from "./sticky-header";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#how", label: "How it works" },
  { href: "#quote", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <StickyHeader>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 transition-[padding] duration-300 max-md:group-data-[scrolled=true]/header:py-1.5 md:px-6 md:py-5">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image src="/logo-round.png" alt="Jass Pizza home" width={80} height={80} priority className="size-14 transition-[width,height] duration-300 max-md:group-data-[scrolled=true]/header:size-10 md:-my-4 md:size-20" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex flex-wrap gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[15px] text-foreground transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <span className="link-underline">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="#quote"
          className="group hidden min-h-11 items-center gap-2 rounded-full border border-gold md:inline-flex px-5 py-3 text-[15px] text-foreground transition-colors hover:border-gold-bright hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Request a quote <Arrow />
        </Link>

        <MobileMenu links={navLinks} />
      </div>
    </StickyHeader>
  );
}
