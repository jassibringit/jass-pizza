import { createAuthClient } from "better-auth/react";

// The browser side of auth: sign up, sign in, sign out.
// Safe for "use client" files (no secrets here, unlike auth.ts).
export const authClient = createAuthClient();
