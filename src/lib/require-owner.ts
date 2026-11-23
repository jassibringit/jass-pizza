import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// The owner's session, or null. Route handlers use this to answer 401 instead of redirecting.
export async function getOwnerSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== process.env.OWNER_EMAIL) return null;
  return session;
}

// Used by every dashboard page and action.
export async function requireOwner() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  // 404 rather than 403 so the dashboard doesn't advertise that it exists.
  if (session.user.email !== process.env.OWNER_EMAIL) notFound();

  return session;
}
