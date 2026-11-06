"use server";

import { revalidatePath } from "next/cache";
import { deleteInquiry, updateInquiryStatus } from "@/db/inquiries";
import { DeleteInquirySchema, UpdateStatusSchema } from "@/lib/inquiry-schema";

// Dashboard actions. Each one: validate → do → refresh.
// Server Actions are public URLs, so each must check auth itself (not just the page).

export async function updateStatusAction(formData: FormData) {
  // TODO (auth): check the visitor is logged in as the owner first.

  const result = UpdateStatusSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return;

  await updateInquiryStatus(result.data.id, result.data.status);

  // The data changed: re-render the page so the card shows the new status.
  revalidatePath("/inquires");
}

export async function deleteInquiryAction(formData: FormData) {
  // TODO (auth): check the visitor is logged in as the owner first.

  const result = DeleteInquirySchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return;

  await deleteInquiry(result.data.id);

  revalidatePath("/inquires");
}
