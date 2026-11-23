import Link from "next/link";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { getInquiries } from "@/db/inquiries";
import { requireOwner } from "@/lib/require-owner";
import { AdminNav } from "./admin-nav";

const signOutClass =
  "inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center font-display text-2xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      jass pizza<span className="text-gold">.</span>
    </Link>
  );
}

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className={signOutClass}>
        <LogOut aria-hidden="true" className="size-4" />
        <span className="sr-only">Sign out</span>
      </button>
    </form>
  );
}

async function OwnerOnly({ children }: { children: React.ReactNode }) {
  const session = await requireOwner();
  const inquiries = await getInquiries();
  const newCount = inquiries.filter((i) => i.status === "new").length;

  const name = session.user.name || "Owner";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-1 flex-col">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-ink lg:flex">
        <div className="px-6 pt-8">
          <Logo />
        </div>
        <nav aria-label="Dashboard" className="mt-12 flex-1 px-3">
          <p className="px-4 pb-3 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            Owner space
          </p>
          <AdminNav variant="sidebar" newCount={newCount} />
        </nav>
        <div className="flex items-center gap-3 border-t border-border px-5 py-5">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm text-gold"
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">Owner</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Phone top bar */}
      <header className="flex items-center justify-between border-b border-border px-6 py-2 lg:hidden">
        <Logo />
        <SignOutButton />
      </header>

      <div className="flex-1 pb-24 lg:pb-0 lg:pl-60">{children}</div>

      {/* Phone tab bar */}
      <nav
        aria-label="Dashboard"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <AdminNav variant="tabs" newCount={newCount} />
      </nav>
    </div>
  );
}

// Protects every page under /admin (except /admin/login).
// Reading the session is dynamic, so it has to sit inside Suspense (cacheComponents).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <OwnerOnly>{children}</OwnerOnly>
    </Suspense>
  );
}
