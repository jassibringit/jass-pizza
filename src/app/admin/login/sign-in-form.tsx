"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const labelClass = "text-sm text-ivory-muted";
const inputClass =
  "min-h-11 w-full rounded-full border border-border bg-background px-5 text-base text-foreground scheme-dark transition-colors placeholder:text-muted-foreground hover:border-gold focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const form = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (error) {
      // Same message either way, so it doesn't reveal which emails have accounts.
      setError("That email and password don't match.");
      setIsPending(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!error}
          aria-describedby={error ? "sign-in-error" : undefined}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!error}
          aria-describedby={error ? "sign-in-error" : undefined}
          className={inputClass}
        />
      </div>

      {error && (
        <p id="sign-in-error" role="alert" className="px-5 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center self-start rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition-colors hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in →"}
      </button>
    </form>
  );
}
