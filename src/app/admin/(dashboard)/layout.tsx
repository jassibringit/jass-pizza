import Link from "next/link";
import { Suspense } from "react";
import { signOutAction } from "@/actions/auth";
import { requireOwner } from "@/lib/require-owner";

const dashboardLinks = [
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/pricing", label: "Pricing" },
];

async function OwnerOnly({ children }: { children: React.ReactNode }) {
  await requireOwner();

  return (
    <>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pt-6">
        <nav aria-label="Dashboard">
          <ul className="flex gap-6">
            {dashboardLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-foreground underline-offset-4 transition-colors hover:text-gold-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </>
  );
}

// Protects every page under /admin (except /admin/login).
// Reading the session is dynamic, so it has to sit inside Suspense (cacheComponents).
export default function InquiriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <OwnerOnly>{children}</OwnerOnly>
    </Suspense>
  );
}
