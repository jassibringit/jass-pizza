import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryList } from "./inquiry-list";

// Private page: keep it out of Google. (Still needs a login before going live.)
export const metadata: Metadata = {
  title: "Inquiries",
  robots: { index: false, follow: false },
};

export default function InquiriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
        Dashboard
      </p>
      <h1 className="mt-4 font-display text-4xl leading-none font-semibold md:text-6xl">
        inquiries<span className="text-gold">.</span>
      </h1>

      {/* The heading shows instantly; the list streams in when the database answers */}
      <Suspense
        fallback={<p className="mt-10 text-muted-foreground">Loading inquiries…</p>}
      >
        <InquiryList />
      </Suspense>
    </main>
  );
}
