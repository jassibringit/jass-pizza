"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutGrid, Receipt } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", Icon: LayoutGrid },
  { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox },
  { href: "/admin/pricing", label: "Rate card", Icon: Receipt },
];

// Overview only matches exactly; the others also match their sub-pages (/admin/inquiries/new).
function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

// Client component only because it needs the current URL to highlight the active link.
export function AdminNav({ variant, newCount }: { variant: "sidebar" | "tabs"; newCount: number }) {
  const pathname = usePathname();

  if (variant === "tabs") {
    return (
      <ul className="grid grid-cols-3">
        {links.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className="relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors aria-[current=page]:text-gold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <Icon aria-hidden="true" className="size-5" />
              {label}
              {href === "/admin/inquiries" && newCount > 0 && (
                <span className="absolute top-2 left-1/2 ml-2 rounded-full bg-gold px-1.5 text-[10px] leading-4 font-bold text-primary-foreground">
                  {newCount}
                  <span className="sr-only"> new</span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <Link
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className="flex min-h-11 items-center gap-3 px-4 py-3 text-sm text-ivory-muted transition-colors hover:bg-secondary hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            <Icon aria-hidden="true" className="size-4 text-gold" />
            <span className="flex-1">{label}</span>
            {href === "/admin/inquiries" && newCount > 0 && (
              <span className="rounded-full bg-gold/20 px-2 text-xs leading-5 text-gold">
                {newCount}
                <span className="sr-only"> new</span>
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
