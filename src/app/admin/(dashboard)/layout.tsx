import { Suspense } from "react";
import { signOutAction } from "@/actions/auth";
import { requireOwner } from "@/lib/require-owner";

async function OwnerOnly({ children }: { children: React.ReactNode }) {
  await requireOwner();

  return (
    <>
      <div className="mx-auto flex max-w-7xl justify-end px-6 pt-6">
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

// Protects every page under /inquiries.
// Reading the session is dynamic, so it has to sit inside Suspense (cacheComponents).
export default function InquiriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <OwnerOnly>{children}</OwnerOnly>
    </Suspense>
  );
}
