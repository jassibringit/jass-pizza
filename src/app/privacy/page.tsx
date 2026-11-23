import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { contact } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Jass Pizza handles the details you share with us.",
  alternates: { canonical: "/privacy" },
};

const linkClass =
  "text-gold underline underline-offset-4 transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-6 py-4">
          <Link
            href="/"
            className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Image src="/logo-round.png" alt="Jass Pizza home" width={56} height={56} className="size-14" />
          </Link>
          <Link href="/" className={`${linkClass} inline-flex min-h-11 items-center text-sm`}>
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-20">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">
          Privacy<span className="text-gold">.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: November 23, 2026</p>

        <div className="mt-10 flex flex-col gap-8 leading-relaxed text-ivory-muted">
          <section>
            <h2 className="font-display text-2xl text-foreground">What we collect</h2>
            <p className="mt-3">
              When you message us about an event, we keep the details you send: your name, how to
              reach you (phone, email or social handle), and your event details like the date,
              guest count, city and anything else you tell us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Why</h2>
            <p className="mt-3">
              Only to reply to you, give you a quote and run your event. We don&apos;t sell your
              details or send you marketing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Who else sees it</h2>
            <p className="mt-3">
              We use a few trusted services to run things: our website host (Vercel), our database
              (Neon) and OpenAI, which helps us draft replies to messages. Some of these store
              data outside Canada, mainly in the United States. We don&apos;t share your details
              with anyone else.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">How long we keep it</h2>
            <p className="mt-3">
              We keep event details while we&apos;re planning and for our records afterwards. If
              you don&apos;t book, we delete your details within 12 months.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">This website</h2>
            <p className="mt-3">
              The site doesn&apos;t use tracking, ads or analytics, and doesn&apos;t set cookies
              for visitors.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Your choices</h2>
            <p className="mt-3">
              You can ask what we have about you, or ask us to delete it, any time. Just message
              us on{" "}
              <a href={contact.instagramDm} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Instagram
              </a>{" "}
              or{" "}
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
