import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

// Already signed in: skip the form.
async function RedirectIfSignedIn() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/admin");
  return null;
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16 md:py-24">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>

      <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
        Dashboard
      </p>
      <h1 className="mt-4 font-display text-4xl leading-none font-semibold md:text-5xl">
        sign in<span className="text-gold">.</span>
      </h1>
      <SignInForm />
    </main>
  );
}
