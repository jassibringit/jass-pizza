import { getInquiries } from "@/db/inquiries";
import { InquiryCard } from "./inquiry-card";

// Reads the database, so the page wraps it in <Suspense>.
export async function InquiryList() {
  const inquiries = await getInquiries();

  if (inquiries.length === 0) {
    return (
      <p className="mt-10 text-muted-foreground">
        No inquiries yet. They&apos;ll show up here as soon as someone sends the
        form.
      </p>
    );
  }

  return (
    <>
      <p className="mt-4 text-muted-foreground">
        {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}, newest first
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {inquiries.map((inquiry) => (
          <li key={inquiry.id}>
            <InquiryCard inquiry={inquiry} />
          </li>
        ))}
      </ul>
    </>
  );
}
