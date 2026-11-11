import type { Metadata } from "next";
import Link from "next/link";
import { ManualInquiryForm } from "./manual-inquiry-form";

export const metadata: Metadata = {
  title: "Add an inquiry",
  robots: { index: false, follow: false },
};

// The page stays a Server Component; only the form needs to run in the browser.
export default function NewInquiryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <Link
        href="/admin/inquiries"
        className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        ← All inquiries
      </Link>
      <p className="mt-6 text-[13px] tracking-[0.25em] text-gold uppercase">
        From a DM or call
      </p>
      <h1 className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl">
        Add an inquiry<span className="text-gold">.</span>
      </h1>

      <ManualInquiryForm />
    </main>
  );
}
