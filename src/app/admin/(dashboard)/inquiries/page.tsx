import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { InquiryList } from "./inquiry-list";

export const metadata: Metadata = {
  title: "Inquiries",
  robots: { index: false, follow: false },
};

export default function InquiriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
        Dashboard
      </p>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-4xl leading-none font-semibold md:text-6xl">
          inquiries<span className="text-gold">.</span>
        </h1>
        <Link
          href="/admin/inquiries/new"
          className="inline-flex min-h-11 items-center self-start rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:self-auto"
        >
          Add inquiry →
        </Link>
      </div>

      <Suspense
        fallback={<p className="mt-10 text-muted-foreground">Loading inquiries…</p>}
      >
        <InquiryList />
      </Suspense>
    </main>
  );
}
