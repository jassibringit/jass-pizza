"use client"; // useFormStatus is a hook, so this runs in the browser

import { useFormStatus } from "react-dom";
import { deleteInquiryAction } from "@/actions/inquiries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteInquiryButtonProps = {
  id: number;
  name: string;
};

// "Delete" opens a confirm dialog; only the dialog's button actually deletes.
export function DeleteInquiryButton({ id, name }: DeleteInquiryButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button className="inline-flex min-h-11 items-center self-start text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Delete<span className="sr-only"> {name}&apos;s</span> inquiry
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}&apos;s inquiry?</AlertDialogTitle>
          <AlertDialogDescription>
            This can&apos;t be undone. For a real lead that didn&apos;t book,
            mark it lost instead.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-h-11 px-5">Cancel</AlertDialogCancel>
          <form action={deleteInquiryAction} className="flex">
            <input type="hidden" name="id" value={id} />
            <ConfirmButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Its own component because useFormStatus only works inside the <form>.
function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <AlertDialogAction
      type="submit"
      variant="destructive"
      disabled={pending}
      className="min-h-11 flex-1 px-5"
    >
      {pending ? "Deleting…" : "Delete"}
    </AlertDialogAction>
  );
}
