"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function signOutAction() {
  // nextCookies() in auth.ts clears the session cookie from here.
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
