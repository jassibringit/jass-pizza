"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteInquiry, saveManualInquiry, updateInquiryStatus } from "@/db/inquiries";
import {
  DeleteInquirySchema,
  ManualInquirySchema,
  UpdateStatusSchema,
  type ManualInquiryErrors,
} from "@/lib/inquiry-schema";

// Dashboard actions. Each one: validate → do → refresh.
// Server Actions are public URLs, so each must check auth itself (not just the page).

// What createInquiryAction sends back to the form when it can't save.
export type CreateInquiryState = {
  errors?: ManualInquiryErrors;
  message?: string;
};

export async function createInquiryAction(
  prev: CreateInquiryState,
  formData: FormData,
): Promise<CreateInquiryState> {
  // TODO (auth): check the visitor is logged in as the owner first.

  const result = ManualInquirySchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  try {
    await saveManualInquiry(result.data);
  } catch (err) {
    console.error("Saving manual inquiry failed:", err);
    return { message: "Couldn't save it. Check your connection and try again." };
  }

  revalidatePath("/inquiries");
  // Back to the list. redirect() works by throwing, so keep it last and outside try/catch.
  redirect("/inquiries");
}

export async function updateStatusAction(formData: FormData) {
  // TODO (auth): check the visitor is logged in as the owner first.

  const result = UpdateStatusSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return;

  await updateInquiryStatus(result.data.id, result.data.status);

  // The data changed: re-render the page so the card shows the new status.
  revalidatePath("/inquiries");
}

export async function deleteInquiryAction(formData: FormData) {
  // TODO (auth): check the visitor is logged in as the owner first.

  const result = DeleteInquirySchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return;

  await deleteInquiry(result.data.id);

  revalidatePath("/inquiries");
}
